from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
from rest_framework import status
from rest_framework.response import Response
import json
import logging

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


def initialAction(request):
    if request.method == 'GET':
        versionID = int(request.GET['versionId'])
        pageID = int(request.GET['pageId'])
        
        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(pageID, int):
            print("Invalid page ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})
        else:
            try:
                initialAction = md.ActionPage.objects.filter(page_id=pageID, version_id=versionID)
                print(initialAction)
            except Exception as ex:
                loggin.exception("Exception thrown: Query Failed to retrieve Initial Action")
            
        print("Got scenario task.")
        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': {}})
    

def stakeholder(request):
    if request.method == 'GET':
        versionID = int(request.GET['versionId'])
        pageID = int(request.GET['pageId'])
        
        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(pageID, int):
            print("Invalid page ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})
        else:
            try:
                stakeholdersID = md.StakeholderPage.objects.filter(page_id=pageID).values('stakeholder_id')
                stakeholderQuerySet = md.Stateholder.objects.filter(stakeholder_id__in = stakeholdersID, version_id = versionID)\
                    .values('stakeholder_id', 'name', 'description', 'job', 'introduction', 'photopath')
                if len(stakeholder) == 0:
                    return JsonResponse(status=404, data={'status': 404,
                                                          'message': "‘No statekholder found base on given Version ID’"})
                resultData = list(stakeholderQuerySet)
            except Exception as ex:
                loggin.exception("Exception thrown: Query Failed to retrieve Stakeholder")
            
            print("Got stakeholders.")
            return JsonResponse(status=200, data={
                'status': 200,
                'message': 'succes',
                'result': resultData
            })
    
    
def conversation(request):
    if request.method == 'GET':
        statekholderID = jsonData['stakeholderId']
        
        if not isinstance(statekholderID, int):
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid stakeholder ID'})
        elif not isinstance(scenarioID, int):
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid scenario ID'})
        else:
            try:
                conversationQuerySet = md.Conversations.objects.filter(statekholder_id=statekholderID)\
                    .values('conversation_id', 'question', 'response_id')
                if len(conversationQuerySet) == 0:
                    return JsonResponse(status=404, data={'status': 404,'message': "No conversation found base on Stakeholder ID"})
                resultData = list(conversationQuerySet)
            except Exception as ex:
                loggin.exception("Exception thrown: Query Failed to retrieve Conversation")

            print("Got conversations.")
            return JsonResponse(status=200, data={
                'status': 200,
                'message': 'success',
                'result': resultData
            })

