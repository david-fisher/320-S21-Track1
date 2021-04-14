from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
from rest_framework import status
from rest_framework.response import Response
import json
import logging
from datetime import datetime    


from django.db.models import F
from django.db import connection

# Create your views here.
"""def err_json_res(status, err):
    return JsonResponse({'status':int(status), 'error':err})"""

def index(request):
    return HttpResponse("This is the API")

def readAttributes(request):
    print("User has a valid session")
    resultData = {
            "userId": request.META['uid'],
            "name": request.META['displayName'],
            "affliation": request.META['eduPersonPrimaryAffiliation'],
            "email": request.META['mail']
    }
    
    return JsonResponse(status=200, data={'status': 200, 'message':'success', 'result': resultData})

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


def stakeholder(request):
    if request.method == "GET":
        versionID = int(request.GET['versionId'])
        scenarioID = int(request.GET['scenarioId'])
        
        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(scenarioID, int):
            print("Invalid Scenario ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid scenario ID'})
        else:
            try:
                stakeholderQuerySet = md.Stakeholder.objects.filter(scenario_id = scenarioID, version_id = versionID)\
                    .values('stakeholder_id', 'name', 'description', 'job', 'introduction', 'photopath')
                if len(stakeholderQuerySet) == 0:
                    return JsonResponse(status=404, data={'status': 404, 'message': "‘No statekholder found’"})
                resultData = list(stakeholderQuerySet)
            except Exception as ex:
                loggin.exception("Exception thrown: Query Failed to retrieve Stakeholder")
            
            print("Got stakeholders.")
            return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})
    
    
def conversation(request):
    print("in conversation")
    if request.method == "GET":
        versionID = int(request.GET['versionId'])
        scenarioID = int(request.GET['scenarioId'])
        stakeholderID = int(request.GET['stakeholderId'])
        
        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(scenarioID, int):
            print("Invalid Scenario ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid scenario ID'})
        elif not isinstance(stakeholderID, int):
            print("Invalid Stakeholder ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'})
        else:
            try:
                stakeholderQuerySet = md.Stakeholder.objects.filter(scenario_id = scenarioID, version_id = versionID, stakeholder_id=stakeholderID)\
                    .values('stakeholder_id')
                if len(stakeholderQuerySet) == 0:
                    return JsonResponse(status=404, data={'status': 404, 'message': "‘No conversation found’"})
                conversationQuerySet = md.Conversation.objects.filter(stakeholder_id__in=stakeholderQuerySet)\
                    .values('conversation_id', 'stakeholder_id', 'question', 'response_id')
                if len(conversationQuerySet) == 0:
                    return JsonResponse(status=404, data={'status': 404, 'message': "‘No conversation found’"})
                resultData = list(conversationQuerySet)
            except Exception as ex:
                loggin.exception("Exception thrown: Query Failed to retrieve Conversation")
            
            print("Got conversation.")
            return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})


def actionPrompt(request):
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
                                                      'message': 'No action page found based on given page Id and version Id'})

                actionPageIDQuerySet = md.ActionPage.objects.filter(page_id=pageID).values_list('action_page_id')
                actionPageChoicesQuerySet = md.Choice.objects.filter(action_page_id__in=actionPageIDQuerySet)\
                                            .values('choices_id', 'action_page_id', 'choice_text')                      
                
                if len(list(actionPageIDQuerySet)) == 0:
                    return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No action page found based on given page Id and version Id'})

                resultData = list(pageQuerySet)[0]
                resultData["choices"] = list(actionPageChoicesQuerySet)

            except Exception as ex:
                logging.exception("Exception thrown: Query Failed to retrieve Page")
            
            return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})


def action(request):
    if request.method == 'POST':
        versionID = int(request.GET['versionId'])
        pageID = int(request.GET['pageId'])
        
        jsonData = json.loads(request.body)
        choiceId = jsonData['choice_id']
        userId = jsonData['user_id']

        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(pageID, int):
            print("Invalid page ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})
        
        try:
            # Check if there is a Version given the versionId 
            try:
                version = md.Version.objects.get(version_id=versionID)
            except md.Version.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No version found with the given versionId'})
            
            # Check if there is a Action Page given the pageId 
            try:
                page = md.Page.objects.get(page_id=pageID)
                actionPage = md.ActionPage.objects.get(page_id=pageID)
            except md.ActionPage.DoesNotExist or md.Page.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No Action page found based on given page Id'})
            
            # Check if the choiceId exist
            try:
                choiceObj = md.Choice.objects.get(choices_id=choiceId)
            except md.ActionPage.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No Choice found based on given choice Id'})


            # Obtain session field based on given params
            try:
                session = md.Session.objects.get(user_id=userId, version_id=versionID)
                course = session.course_id
            except md.Session.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'Session not found based on give params'})

            # If response hasn't been submitted for given page, create new Response object for the action submission.
            response = None
            try:
                responseObj = md.Response.objects.get(session_id=session, version_id=version, page_id=pageID)
                response = {key: responseObj.__dict__[key] for key in ('response_id', 'date_taken', 'choice')}

                # Add choiceText and nextPage field to response obj
                response['choice_text'] = choiceObj.choice_text
                response['next_page'] = choiceObj.next_page

                return JsonResponse(status=400, data={'status': 400,
                                                    'message': 'Response has already been submitted for this page.',
                                                    'result': response})
            except md.Response.DoesNotExist:
                # Add a response for the given choice
                responseObj = md.Response(session_id=session, version_id=version, page_id=page,
                                          date_taken=datetime.now(), course_id=course, choice=choiceObj.choices_id)
            
                responseObj.save()
                response = {key: responseObj.__dict__[key] for key in ('response_id', 'date_taken', 'choice')}

                # Add choiceText and nextPage field to response obj
                response['choice_text'] = choiceObj.choice_text
                response['next_page'] = choiceObj.next_page

        except Exception as ex:
             logging.exception("Exception thrown: Query Failed to retrieve Page")
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'Action succesfully submitted',
                                              'result': response})

    elif request.method == 'GET':
        versionID = int(request.GET['versionId'])
        pageID = int(request.GET['pageId'])
        userId = int(request.GET['userId'])

        if not isinstance(versionID, int):
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        elif not isinstance(pageID, int):
            print("Invalid page ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid page ID'})

        try:
            # Check if there is a Version given the versionId 
            try:
                version = md.Version.objects.get(version_id=versionID)
            except md.Version.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No version found with the given versionId'})
            
            # Check if there is a Action Page given the pageId 
            try:
                page = md.Page.objects.get(page_id=pageID)
                actionPage = md.ActionPage.objects.get(page_id=pageID)
            except md.ActionPage.DoesNotExist or md.Page.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No Action page found based on given page Id'})
            
            # Obtain session field based on given params
            try:
                session = md.Session.objects.get(user_id=userId, version_id=versionID)
                course = session.course_id
            except md.Session.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'Session not found based on give params'})

            response = None
            try:
                responseObj = md.Response.objects.get(session_id=session, version_id=version, page_id=pageID)
                response = {key: responseObj.__dict__[key] for key in ('response_id', 'date_taken', 'choice')}

                # Retrieve choiceObject from responseObj above
                choiceObj = md.Choice.objects.get(choices_id=int(responseObj.choice))

                # Add choiceText and nextPage field to return obj
                response['choice_text'] = choiceObj.choice_text
                response['next_page'] = choiceObj.next_page

                return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': response})
            
            except md.Response.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Action hasnt been submitted yet', 'result': None})

        except Exception as ex:
             logging.exception("Exception thrown: Query Failed to retrieve Page")
