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

pageType = "STAKEHOLDERPAGE" # change this to whatever type you initialize for stakeholder page

def index(request):
    return HttpResponse("This is the API")

def readAttributes(request):
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
            userObj = md.User.objects.get(user_id=userId)
            courseIdQuerySet = md.Takes.objects.filter(user_id=userObj.user_id).values_list('course_id')
            scenarioIdQuerySet = md.ClassAssignment.objects.filter(course_id__in=courseIdQuerySet)\
                                   .values('scenario_id')
            scenarioVersionQuerySet = md.Version.objects.filter(scenario_id__in=scenarioIdQuerySet)\
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

def stakeholderPage(request):
    if request.method == "GET":
        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        
        resultData = []
        try:
            # check if version ID exists
            versionQuerySet = md.Version.objects.filter(version_id=versionID,).values()
            if len(versionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})

            # retrieve stakeholder
            stakeholderQuerySet = md.Stakeholder.objects.filter(version_id = versionID).values()
            if len(stakeholderQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': "‘No Stakeholder found’"})
            resultData = list(stakeholderQuerySet)
        
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Stakeholder")

        return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})

def stakeholder(request):
    if request.method == "GET":
        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})

        # retrieve stakeholder ID
        try:
            stakeholderID = int(request.GET['stakeholderId'])
        except Exception as ex:
            print("Invalid Stakeholder ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'})

        # retrieve user ID
        try:
            userID = int(request.GET['userId'])
        except Exception as ex:
            print("Invalid User ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID'})
        
        resultData = []
        try:
            # check if version ID exists
            versionObj = md.Version.objects.get(version_id=versionID)

            # check if stakeholder ID exist
            stakeholderObj = md.Stakeholder.objects.get(version_id = versionID, stakeholder_id=stakeholderID)

            # check if session ID exist
            sessionQuerySet = md.Session.objects.filter(version_id=versionID, user_id=userID).values('session_id')
            if len(sessionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Session ID found'})

            # check if stakeholder exists in conversationHad table
            stakeholderHadQuerySet = md.ConversationsHad.objects.filter(version_id=versionID, stakeholder_id=stakeholderID, session_id__in=sessionQuerySet).values()
            if len(stakeholderHadQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Stakeholder hasn\'t been submitted'})
            
            # retrieve stakeholder information
            stakeholder = {key: stakeholderObj.__dict__[key] for key in ('stakeholder_id', 'name', 'description', 'job', 'introduction', 'photopath')}

            # return data
            resultData.append(stakeholder)
        
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except md.Stakeholder.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder ID found'})
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Stakeholder")

        return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})

def stakeholderHad(request):
    if request.method == 'GET':
        # retrieve user ID
        try:
            userID = int(request.GET['userId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID'})
        
        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})

        resultData = []
        try:
            # check if version ID exist
            versionObj = md.Version.objects.get(version_id=versionID)

            # check if session ID exist
            sessionQuerySet = md.Session.objects.filter(user_id=userID, version_id=versionID).values('session_id')
            if len(sessionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Session ID found'})
            
            # retrieve stakeholder Had
            stakehoderHadQuerySet = md.ConversationsHad.objects.filter(session_id__in=sessionQuerySet, version_id=versionID).distinct('stakeholder_id').values('stakeholder_id')
            if len(stakehoderHadQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder has been submitted'})
            for id in stakehoderHadQuerySet:
                stakeholderObj = md.Stakeholder.objects.get(version_id=versionID, stakeholder_id=id['stakeholder_id'])
                stakeholder = {key: stakeholderObj.__dict__[key] for key in ('stakeholder_id', 'name', 'description', 'job', 'introduction', 'photopath')}
                resultData.append(stakeholder)
        
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except Exception as ex:
            logging.exception("Query thrown: Query failed to retrieve Stakeholder Had")
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})

def conversationPage(request):
    if request.method == "GET":
        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})

        # retrieve stakeholder ID
        try:
            stakeholderID = int(request.GET['stakeholderId'])
        except Exception as ex:
            print("Invalid Stakeholder ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'}) 
        
        resultData = []
        try:
            # check if version ID exists
            versionObj = md.Version.objects.get(version_id=versionID)

            # check if stakeholder ID exist
            stakeholderObj = md.Stakeholder.objects.get(version_id = versionID, stakeholder_id=stakeholderID)
            stakeholder = {key: stakeholderObj.__dict__[key] for key in ['stakeholder_id','name']}

            # retrieve Conversation
            conversationQuerySet = md.Conversation.objects.filter(stakeholder_id=stakeholderID)\
                .values()
            if len(conversationQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': "‘No conversation found’"})
            resultData.append(stakeholder)
            resultData.append(list(conversationQuerySet))
        
        except md.Scenario.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Scenario ID found'})
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except md.Stakeholder.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder ID found'})
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Conversation")
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})
    
def conversation(request):
    if request.method == "GET":
        # retrieve user ID
        try:
            userID = int(request.GET['userId'])
        except Exception as ex:
            print("Invalid User ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID'})

        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})

        # retrieve course ID
        try:
            courseID = int(request.GET['courseId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Course ID'})

        # retrieve stakeholder ID
        try:
            stakeholderID = int(request.GET['stakeholderId'])
        except Exception as ex:
            print("Invalid Stakeholder ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'})

        # retrieve conversation ID
        try:
            conversationID = int(request.GET['conversationId'])
        except Exception as ex:
            print("Invalid Conversation ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Conversation ID'})    
        
        resultData = {}
        try:
            # check if version ID exists
            versionObj = md.Version.objects.get(version_id=versionID)

            # check if course ID exists
            courseObj = md.Course.objects.get(course_id=courseID)

            # check if stakeholder ID exists
            stakeholderObj = md.Stakeholder.objects.get(version_id=versionID, stakeholder_id=stakeholderID)

            # check if session ID exists
            sessionQuerySet = md.Session.objects.filter(user_id=userID, version_id=versionID, course_id=courseID).order_by('session_id').values('session_id')
            if len(sessionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Session ID found'})

            # check is stakeholder exists in conversationHad
            stakeholderHadQuerySet = md.ConversationsHad.objects.filter(stakeholder_id=stakeholderID, session_id__in=sessionQuerySet).values()
            if len(stakeholderHadQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Stakeholder hasn\'t been submitted'})
            for key in ['stakeholder_id','name']:
                resultData[key] = stakeholderObj.__dict__[key]

            # check if conversation ID exists
            conversationObj = md.Conversation.objects.get(stakeholder_id=stakeholderID, conversation_id=conversationID)
            for key in ['conversation_id', 'question', 'response_id']:
                resultData[key] = conversationObj.__dict__[key]

            # retrieve Conversation Had
            conversationHadObj = md.ConversationsHad.objects.get(course_id=courseID, version_id=versionID, stakeholder_id=stakeholderID, conversation_id=conversationID, session_id__in=sessionQuerySet)
            for key in ['score', 'date_taken']:
                resultData[key] = conversationHadObj.__dict__[key]

        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except md.Course.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Course ID found'})
        except md.Stakeholder.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder ID found'})
        except md.Conversation.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Conversation ID found'})
        except md.ConversationsHad.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'Conversation hasn\'t been submitted'})
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Conversation")
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'succes', 'result': resultData})
    elif request.method == "POST":
        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            print("Invalid Version ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})

        # retrieve stakeholder ID
        try:
            stakeholderID = int(request.GET['stakeholderId'])
        except Exception as ex:
            print("Invalid Stakeholder ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'})

        # retrieve conversation ID
        try:
            conversationID = int(request.GET['conversationId'])
        except Exception as ex:
            print("Invalid Conversation ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Conversation ID'})

        # retrieve Course ID
        try:
            courseID = int(request.GET['courseId'])
        except Exception as ex:
            print("Invalid Course ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Course ID'})

        # retrieve Session ID
        try:
            sessionID = int(request.GET['sessionId'])
        except Exception as ex:
            print("Invalid Session ID")
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Session ID'})

        resultData = None
        try:
            # check if version ID exists
            versionObj = md.Version.objects.get(version_id=versionID)
                
            # check if stakeholder ID exists
            stakeholderObj = md.Stakeholder.objects.get(version_id=versionID, stakeholder_id=stakeholderID)
            resultData = {key: stakeholderObj.__dict__[key] for key in ['stakeholder_id', 'name', 'job']}

            # check if conversation ID exists
            conversationObj = md.Conversation.objects.get(stakeholder_id=stakeholderID, conversation_id=conversationID)
            for key in ['conversation_id', 'question', 'response_id']:
                resultData[key] = conversationObj.__dict__[key]

            # check if course ID exists
            courseObj = md.Course.objects.get(course_id=courseID)

            # check if session ID exists
            sessionObj = md.Session.objects.get(session_id=sessionID, course_id=courseID, version_id=versionID)

            # check if conversation ID has already been chosen
            try:
                conversationHadObj = md.ConversationsHad.objects.get(session_id=sessionID, version_id=versionID, stakeholder_id=stakeholderID, conversation_id=conversationID, course_id=courseID)
                resultData['already_exist'] = True
            except md.ConversationsHad.DoesNotExist:

                # check if reach maximum number of conversation
                sessionQuerySet = md.Session.objects.filter(user_id=sessionObj.__dict__['user_id']).values('session_id')
                conversationHadQuerySet = md.ConversationsHad.objects.filter(session_id__in=sessionQuerySet, version_id=versionID).values()
                if len(conversationHadQuerySet) == versionObj.__dict__['num_conversation']:
                    return JsonResponse(status=400, data={'status': 400, 'message': 'No more Conversation to take'})
                # get score for conversation
                issueQuerySet = md.Issue.objects.filter(version_id=versionID).values('issue_id')
                if len(issueQuerySet) == 0:
                    return JsonResponse(staus=404, data={'status': 404, 'message': 'No Issue ID found'})
                
                try:
                    coverageObj = md.Coverage.objects.filter(issue_id__in=issueQuerySet, stakeholder_id=stakeholderID).values('coverage_score')
                except md.Coverage.DoesNotExist:
                    return JsonResponse(staus=404, data={'status': 404, 'message': 'No Coverage found'})
                
                coverageScore = 0.0
                for score in list(coverageObj):
                    coverageScore += score['coverage_score']

                # create new conversationHad object
                conversationHadObj = md.ConversationsHad(session_id=sessionObj, version_id=versionObj, stakeholder_id=stakeholderObj, conversation_id=conversationID, course_id=courseID, date_taken=datetime.now(), score=coverageScore)
                conversationHadObj.save()
                resultData['already_exist'] = False
            
            # update resultData
            resultData['score'] = conversationHadObj.__dict__['score']
            resultData['date_taken'] = conversationHadObj.__dict__['date_taken']

        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except md.Stakeholder.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder ID found'})
        except md.Conversation.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Conversation ID found'})
        except md.Course.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Course ID found'})
        except md.Session.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Session ID found'})
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Conversation")

        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})

def conversationHad(request):
    if request.method == 'GET':
        # retrieve user ID
        try:
            userID = int(request.GET['userId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid User ID'})

        # retrieve version ID
        try:
            versionID = int(request.GET['versionId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Version ID'})
        
        # retrieve stakeholder ID
        try:
            stakeholderID = int(request.GET['stakeholderId'])
        except Exception as ex:
            return JsonResponse(status=400, data={'status': 400, 'message': 'Invalid Stakeholder ID'})

        resultData = []
        try:
            # check if version ID exist
            versionObj = md.Version.objects.get(version_id=versionID)

            # check if stakeholder ID exist
            stakeholderObj = md.Stakeholder.objects.get(stakeholder_id=stakeholderID, version_id=versionID)

            # check if session ID exist
            sessionQuerySet = md.Session.objects.filter(user_id=userID, version_id=versionID).values('session_id')
            if len(sessionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Session ID found'})

            # retrieve conversation had
            conversationHadQuerySet = md.ConversationsHad.objects.filter(session_id__in=sessionQuerySet, stakeholder_id=stakeholderID, version_id=versionID).values('conversation_id')
            if len(conversationHadQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404, 'message': 'No Conversation has been submitted'})
            for id in conversationHadQuerySet:
                conversationObj = md.Conversation.objects.get(stakeholder_id=stakeholderID, conversation_id=id['conversation_id'])
                conversation = {key: conversationObj.__dict__[key] for key in ('conversation_id', 'question', 'response_id')}
                resultData.append(conversation)
        
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Version ID found'})
        except md.Stakeholder.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No Stakeholder ID found'})
        except Exception as ex:
            logging.exception("Exception thrown: Query failed to retrieve conversation.")

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

                actionPageChoicesQuerySet = md.ActionPageChoice.objects.filter(page_id=pageID)\
                                            .values(choices_id=F('apc_id'), choice_text=F('choice'))                      
                
                if len(list(actionPageChoicesQuerySet)) == 0:
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
            
            # Check if there is a Page given the pageId 
            try:
                page = md.Page.objects.get(page_id=pageID)
            except md.Page.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                    'message': 'No Page found based on given page Id'})

            # Check if the choiceId exist
            try:
                choiceObj = md.ActionPageChoice.objects.get(apc_id=choiceId)
            except md.ActionPageChoice.DoesNotExist:
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
                response['choice_text'] = choiceObj.choice
                response['next_page'] = choiceObj.result_page

                return JsonResponse(status=400, data={'status': 400,
                                                    'message': 'Response has already been submitted for this page.',
                                                    'result': response})
            except md.Response.DoesNotExist:
                # Add a response for the given choice
                responseObj = md.Response(session_id=session, version_id=version, page_id=page,
                                          date_taken=datetime.now(), course_id=course, choice=choiceObj.apc_id)
            
                responseObj.save()
                response = {key: responseObj.__dict__[key] for key in ('response_id', 'date_taken', 'choice')}

                # Add choiceText and nextPage field to response obj
                response['choice_text'] = choiceObj.choice
                response['next_page'] = choiceObj.result_page

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
                choiceObj = md.ActionPageChoice.objects.get(apc_id=int(responseObj.choice))

                # Add choiceText and nextPage field to return obj
                response['choice_text'] = choiceObj.choice
                response['next_page'] = choiceObj.result_page

                return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': response})
            
            except md.Response.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404, 'message': 'Action hasnt been submitted yet', 'result': None})

        except Exception as ex:
             logging.exception("Exception thrown: Query Failed to retrieve Page")
