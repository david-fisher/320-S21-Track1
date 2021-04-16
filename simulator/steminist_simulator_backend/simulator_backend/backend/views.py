from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import backend.models as md
from rest_framework import status
from rest_framework.response import Response
import json
import logging
from datetime import datetime


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


def reflection(request):
    # DISCLAIMER: Due to the incomplete db schema this can be quite scuffed. If the database is fixed and newer functions
    # are implemented correspondingly then please delete these comments

    # It can be confusing on how the GET/POST method works so I will clarify:
    # I assume that the corresponding Session/Version/Response row are generated and pre populated  upon the user start
    # to work on ascenario and is unique to every user (i.e no 2 users can work on the same row as the other and
    # different scenario that an user is working on wouldn't share the same row either)

    # For GET method, the 'prompt' or topic will be stored in the 'choice' text field of the Response row since there is
    # no appropiate field to store the prompt in. Therefore note to backend teams or database teams, whoever might
    # be populate this field to add a '[PROMPT]' tag before the actual prompt for parsing and to the front-end team,
    # the API will get rid of the tag before sending json response so you don't have to further discard anything more
    # from it.

    # For POST method, the 'response' will be added back in the the choice section with the opening tag '[RESPONSE]'.
    # To front-end teams, this will be added in by this API so you don't have to add in anything. To backend teams or
    # whoever will be handling the data, please keep this in mind as to get rid of them before starting your run on the
    # data.

    # Final thoughts:
    # Database team, if you are reading this, I want a separate 'response' table that has the same fields as the current
    # 'responses' table but with the 'CHOICE TEXT' changed into:
    #
    # PROMPT INTEGER
    # RESPONSE TEXT
    #
    # with 'prompt' field linked to the primary key of another new table:
    #
    # TABLE prompts {
    # PROMPT_ID INTEGER PK
    # PROMPT_TEXT TEXT
    # }
    #
    # , it will make the work on this part much easier. Thank you.


    try:
        versionID = int(request.GET['version_id'])
        pageID = int(request.GET['page_id'])
        userId = int(request.GET['user_id'])
        pageTitle = request.GET['page_title']
        if pageTitle not in ('INITIAL_REFLECTION', 'MIDDLE_REFLECTION', 'FINAL_REFLECTION'):
            raise ValueError('Invalid pageTitle value.')
    except ValueError as e:
        return JsonResponse({'status': 400, 'message': 'Invalid versionID, pageID, userID or pageTitle',
                             'error': str(e)}, content_type="application/json")

    try:
        try:
            version = md.Version.objects.get(version_id=versionID)
            session = md.Session.objects.get(user_id=userId, version_id=versionID)

            # TODO: change this when there exists a proper reflection table, this is still using 'action' table for
            # now
            page = md.Page.objects.get(page_id=pageID, page_title=pageTitle, page_type='ACTION')
            actionPage = md.ActionPage.objects.get(page_id=pageID)

            # TODO: change this when there exists a proper prompt table to pull the prompts from
            # Assuming this query can returns more than one objects since reflection can have more than 1 field, use
            # filter
            # Assuming this set of response objects are special than the 'action' 's, containing prompts instead of
            # array of choices in the 'choice' column
            responseObj = md.Response.objects.filter(session_id=session.session_id, version_id=version.version_id,
                                                     page_id=pageID)
            if len(responseObj) == 0:
                raise ValueError('No reflection prompt found.')

        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                  'message': 'No version found with the given versionId'})
        except md.ActionPage.DoesNotExist or md.Page.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                  'message': 'No Action page found based on given page Id'})
        except md.Session.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                  'message': 'Session not found based on give params'})
        except ValueError as e:
            return JsonResponse(status=404,
                                data={'status': 404, 'message': str(e)})

        # GET
        if request.method == 'GET':
            prompt_message = page.body
            prompts = []

            try:
                for prompt in responseObj:
                    prompt_question = str(prompt.choice)
                    if '[PROMPT]' not in prompt_question:
                        raise ValueError("No '[PROMPT]' tag in response, the response object queried is not intended "
                                         "for Reflection purpose. Please contact backend/database about this.")
                    elif '[RESPONSE]' in prompt_question:
                        raise ValueError("'[RESPONSE]' tag in response, the prompt in the response object has already "
                                         "been filled. Use GET /reflection/response to view the responded prompts. "
                                         "Please contact backend/database about this.")

                    prompt_question = prompt_question.replace('[PROMPT]', '')
                    prompts.append({"prompt_id": int(prompt.response_id), "prompt": prompt_question})

            except ValueError as e:
                return JsonResponse({'status': 400, 'message': 'Invalid Response object query', 'error': str(e)},
                                    content_type="application/json")

            return JsonResponse({'status': 200, 'message': prompt_message, 'body': prompts},
                                content_type="application/json")


        # POST
        elif request.method == 'POST':
            responses = json.loads(request.body)['body']
            overwritten = False

            try:
                if len(responses) != len(responseObj):
                    raise ValueError('The number of responses is different from the number of prompts (%i compare to %i)'
                                     %(len(responses), len(responseObj)))

                # This loop and edits variable here is to not save changes to the Response row until everything passed
                # and is valid
                edits = []
                for prompt_res in responses:
                    editing_res = responseObj.get(response_id=prompt_res['prompt_id'])

                    if '[PROMPT]' not in editing_res.choice:
                        raise ValueError("No '[PROMPT]' tag in response, the response object queried is not intended "
                                         "for Reflection purpose. Please contact backend/database about this.")

                    if '[RESPONSE]' in editing_res.choice:
                        # overwriting old response
                        editing_res.choice = editing_res.choice.split('[RESPONSE]')[0] + '[RESPONSE]' + \
                                             prompt_res['response']
                        overwritten = True
                    else:
                        editing_res.choice = editing_res.choice + '[RESPONSE]' + prompt_res['response']

                    edits.append(editing_res)

                # Saving changes
                for edit in edits:
                    edit.save()

            except ValueError as e:
                return JsonResponse({'status': 400, 'message': 'Invalid prompt response', 'err': str(e)},
                                    content_type="application/json")
            except md.Response.DoesNotExist:
                return JsonResponse({'status': 400, 'message': 'Invalid prompt response id, response not found.',
                                     'err': str(e)}, content_type="application/json")

            if overwritten:
                return JsonResponse({'status': 200, 'result': "Updated reflection."}, content_type="application/json")
            else:
                return JsonResponse({'status': 200, 'result': "Added reflection."}, content_type="application/json")

    except Exception as e:
        logging.exception('Exception thrown: Query Failed to retrieve Page')
        return JsonResponse({'status': 500, 'message': 'Exception thrown: Query Failed to retrieve Page', 'err': str(e)},
                            content_type="application/json")



def reflectionResponse(request):
    if request.method == 'GET':
        try:
            versionID = int(request.GET['version_id'])
            pageID = int(request.GET['page_id'])
            userId = int(request.GET['user_id'])
            pageTitle = request.GET['page_title']
            if pageTitle not in ('INITIAL_REFLECTION', 'MIDDLE_REFLECTION', 'FINAL_REFLECTION'):
                raise ValueError('Invalid pageTitle value.')
        except ValueError as e:
            return JsonResponse({'status': 400, 'message': 'Invalid versionID, pageID, userID or pageTitle',
                                 'error': str(e)}, content_type="application/json")

        try:
            try:
                version = md.Version.objects.get(version_id=versionID)
                session = md.Session.objects.get(user_id=userId, version_id=versionID)

                # TODO: change this when there exists a proper reflection table, this is still using 'action' table for
                # now
                page = md.Page.objects.get(page_id=pageID, page_title=pageTitle, page_type='ACTION')
                actionPage = md.ActionPage.objects.get(page_id=pageID)

                # TODO: change this when there exists a proper prompt table to pull the prompts from
                # Assuming this query can returns more than one objects since reflection can have more than 1 field, use
                # filter
                # Assuming this set of response objects are special than the 'action' 's, containing prompts instead of
                # array of choices in the 'choice' column
                responseObj = md.Response.objects.filter(session_id=session.session_id, version_id=version.version_id,
                                                         page_id=pageID)
                if len(responseObj) == 0:
                    raise ValueError('No reflection prompt found.')

            except md.Version.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No version found with the given versionId'})
            except md.ActionPage.DoesNotExist or md.Page.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'No Action page found based on given page Id'})
            except md.Session.DoesNotExist:
                return JsonResponse(status=404, data={'status': 404,
                                                      'message': 'Session not found based on give params'})
            except ValueError as e:
                return JsonResponse(status=404,
                                    data={'status': 404, 'message': str(e)})

            prompt_message = page.body
            prompts = []

            try:
                for prompt in responseObj:
                    prompt_qa = str(prompt.choice)
                    if '[PROMPT]' not in prompt_qa:
                        raise ValueError(
                            "No '[PROMPT]' tag in response, the response object queried is not intended "
                            "for Reflection purpose. Please contact backend/database about this.")

                    splited = prompt_qa.split('[RESPONSE]')
                    prompt_question = splited[0].replace('[PROMPT]', '')
                    if len(splited) == 2:
                        prompt_response = splited[1]
                    else:
                        prompt_response = ''

                    prompts.append({"prompt_id": int(prompt.response_id), "prompt": prompt_question, "response":
                                     prompt_response})
            except ValueError as e:
                return JsonResponse({'status': 400, 'message': 'Invalid Response object query', 'error': str(e)},
                                    content_type="application/json")

            return JsonResponse({'status': 200, 'message': prompt_message, 'body': prompts},
                                    content_type="application/json")

        except Exception as e:
            logging.exception('Exception thrown: Query Failed to retrieve Page')
            return JsonResponse({'status': 500, 'message': 'Exception thrown: Query Failed to retrieve Page',
                                 'err': str(e)}, content_type="application/json")