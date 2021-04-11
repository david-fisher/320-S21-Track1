from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
from rest_framework import status
from rest_framework.response import Response
import json
import logging
from datetime import datetime
import backend.queries as queries


from django.db import connection

INTROPAGE = 1
TASKPAGE = 2
INITIAL_REFLECTION = 3
INIT_ACTION = 4
INIT_ACTION_SUBSEQUENT = 5
CONVERSATION = 6
MIDDLE_REFLECTION = 7
FINAL_ACTION = 8
SUMMARY_PAGE = 9
FEEDBACK_PAGE = 10
FINAL_REFLECTION = 11
CONCLUSIONPAGE = 12

# Create your views here.
"""def err_json_res(status, err):
    return JsonResponse({'status':int(status), 'error':err})"""

def index(request):
    return HttpResponse("This is the API")

def scenarios(request):
    jsonData = json.loads(request.body)
    userId = jsonData['userId']

    if not isinstance(userId, int):
        print("Invalid user ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID: ' + str(userId)})
    else:
        try:
            versionIdQuerySet = md.AssignedTo.objects.filter(user_id=userId).values_list('version_id')
            scenarioVersionQuerySet = md.Version.objects.filter(version_id__in=versionIdQuerySet)\
                                        .values('version_id', 'name', 'num_conversation', 'first_page')

            # If no scenarios with the given userId were found, return 404 error
            if len(scenarioVersionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Scenario not found with the given User ID'}, )

            resultData = list(scenarioVersionQuerySet)

        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Scenario")

        print("Got all scenarios")
        return JsonResponse(status=200, data={'status': 200, 'message':'success', 'result': resultData})

def scenarioIntroduction(request):
    jsonData = json.loads(request.body)
    versionID = jsonData['versionId']
    pageID = jsonData['pageId']

    if not isinstance(versionID, int):
        print("Invalid version ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID: ' + str(versionID)})
    elif not isinstance(pageID, int):
        print("Invalid page ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID: ' + str(pageID)})
    else:
        try:
            scenarioIntroQuerySet = md.Page.objects.filter(page_id=pageID, version_id=versionID)\
                                      .values("page_id", "page_type", "page_title", "version_id", "body", "next_page")
            # If no pages with the given versionId and order were found, return 404 error
            if len(scenarioIntroQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'Page not found with the given Version ID'})

            resultData = list(scenarioIntroQuerySet)
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Page")

        print("Got scenario introduction.")
        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})

def scenarioTask(request):
    jsonData = json.loads(request.body)
    versionID = jsonData['versionId']
    pageID = jsonData['pageId']

    if not isinstance(versionID, int):
        print("Invalid Version ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
    elif not isinstance(pageID, int):
        print("Invalid page ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})
    else:
        try:
            scenarioTaskQuerySet = md.Page.objects.filter(page_id=pageID, version_id=versionID) \
                .values("page_id", "page_type", "page_title", "version_id", "body", "next_page")
            # If no pages with the given versionId and pageId are found, return 404 error
            if len(scenarioTaskQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': '‘No task page found base on given Version ID’'})

            resultData = list(scenarioTaskQuerySet)
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Page")

        print("Got scenario task.")
        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})


def initialReflection(request):

    if request.method == 'GET':
        jsonData = request.GET
        scenarioID = jsonData['scenario_id']

        try:
            scenarioID = int(scenarioID)
        except:
            print("Invalid scenario ID")
            return JsonResponse({'status':400, 'message':'Invalid scenario ID: hello'}, content_type="application/json")

        resultData = None
        try:
            message, resultData = queries.getReflectionPage(scenarioID, 'INITIAL_REFLECTION')
            # If no pages with the given scenarioId and order were found, return 404 error
            # print(len(scenarioReflectionQuerySet))
            if len(resultData) == 0:
                return JsonResponse({'status': 404, 'message':'Page not found with the given scenario ID'},
                                    content_type="application/json")

            '''
            {
                "status": 200,
                "message": "body 1",
                "body": [
                    [
                        {
                            "prompt_id": 1,
                            "response": "choice1"
                        }
                    ]
                ]
            }
            '''
        except Exception as ex:
            logging.exception('Exception thrown: Query Failed to retrieve Page')
            return JsonResponse({'status':500, 'message':'Exception thrown: Query Failed to retrieve Page'})

        print("Got initial reflection.")
        return JsonResponse({'status':200, 'message':message, 'body': resultData}, content_type="application/json")


    elif request.method == 'POST':
        jsonData = json.loads(request.body)

        scenarioID = jsonData['scenario_id']

        try:
            scenarioID = int(scenarioID)
        except:
            print("Invalid scenario ID")
            return JsonResponse({'status': 400, 'message': 'Invalid scenario ID'}, content_type="application/json")
        studentID = jsonData['student_id']
        no_error = True
        if not isinstance(studentID, int):
            print("Invalid student ID")
            return JsonResponse({'status': 400, 'message': 'Invalid student ID'}, content_type="application/json")

        timestamp = datetime.now()
        for prompt in jsonData['body']:
            prompt_num = prompt['prompt_id']
            if not isinstance(prompt_num, int):
                print("Invalid prompt number")
                return JsonResponse({'status': 400, 'message': 'Invalid prompt ID'}, content_type="application/json")

            inputData = jsonData
            no_error = queries.addInitReflectResponse(studentID, inputData, prompt_num, scenarioID, timestamp)

        if no_error:
            print("Updated initial reflection.")
            return JsonResponse({'status': 200, 'result':"Updated initial reflection."}, content_type="application/json")
        else:
            print("Initial reflection not added")
            return JsonResponse({'status': 404, 'message': 'student ID, scenario ID or prompt does not exist in database.'},
                                content_type="application/json")
