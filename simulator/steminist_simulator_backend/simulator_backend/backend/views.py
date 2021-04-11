from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
from rest_framework import status
from rest_framework.response import Response
import json
import logging

from django.db.models import F
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
    userId = int(request.GET['userId'])

    if not isinstance(userId, int):
        print("Invalid user ID")
        return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID: ' + str(userId)})
    else:
        try:
            versionIdQuerySet = md.ScenarioForUser.objects.filter(user_id=userId).values_list('version_id')
            scenarioVersionQuerySet = md.Version.objects.filter(version_id__in=versionIdQuerySet)\
                                        .values('version_id', 'name', 'num_conversation', 'first_page', 
                                                is_finished=F('scenario_id__is_finished'), date_created=F('scenario_id__date_created'))

            # If no scenarios with the given userId were found, return 404 error
            if len(scenarioVersionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Scenario not found with the given User ID'}, )

            resultData = list(scenarioVersionQuerySet)

        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Scenario")

        print("Got all scenarios")
        return JsonResponse(status=200, data={'status': 200, 'message':'success', 'result': resultData})

def scenarioIntroduction(request):    
    versionID = int(request.GET['versionId'])
    pageID = int(request.GET['pageId'])

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
            scenarioTaskQuerySet = md.Page.objects.filter(page_id=pageID, version_id=versionID) \
                .values("page_id", "page_type", "page_title", "version_id", "body", "next_page")
            # If no pages with the given versionId and pageId are found, return 404 error
            if len(scenarioTaskQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': '‘No task page found based on given Version ID’'})

            resultData = list(scenarioTaskQuerySet)
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Page")

        print("Got scenario task.")
        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})

def finalActionPrompt(request):
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
            resultData = None
            try:
                versionQuerySet = md.Version.objects.filter(version_id=versionID)
                if len(list(versionQuerySet)) == 0:
                    return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No version found with the given versionId'})

                pageQuerySet = md.Page.objects.filter(page_id=pageID, version_id=versionID)\
                                .values('page_id', 'page_type', 'page_title', 'version_id', 'body')
                if len(list(pageQuerySet)) == 0:
                    return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No final action page found based on given page Id and version Id'})

                actionPageIDQuerySet = md.ActionPage.objects.filter(page_id=pageID).values_list('action_page_id')
                actionPageChoicesQuerySet = md.Choice.objects.filter(action_page_id__in=actionPageIDQuerySet)\
                                            .values('choices_id', 'action_page_id', 'choice_text')                      
                
                if len(list(actionPageIDQuerySet)) == 0:
                    return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No final action page found based on given page Id and version Id'})

                resultData = list(pageQuerySet)[0]
                resultData["choices"] = list(actionPageChoicesQuerySet)

            except Exception as ex:
                logging.exception("Exception thrown: Query Failed to retrieve Page")
            
            return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})


def finalAction(request):
    if request.method == 'POST':
        versionID = int(request.GET['versionId'])
        pageID = int(request.GET['pageId'])

        jsonData = json.loads(request.body)
        choiceId = jsonData['choice_id']

        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(pageID, int):
            print("Invalid page ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})
        
        try:
            versionQuerySet = md.Version.objects.filter(version_id=versionID)
            if len(list(versionQuerySet)) == 0:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No version found with the given versionId'})

            actionPageIDQuerySet = md.ActionPage.objects.filter(page_id=pageID).values_list('action_page_id')
            md.ActionPage.objects.filter(action_page_id__in=actionPageIDQuerySet)\
                           .update(chosen_choice=choiceId)
            actionPage = md.ActionPage.objects.filter(action_page_id__in=actionPageIDQuerySet)

            if len(actionPage) == 0:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No final action found based on given page Id'})

        except Exception as ex:
             logging.exception("Exception thrown: Query Failed to retrieve Page")
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'Final action succesfully submitted'})