from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import new.models as md
import json

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
    studentID = jsonData['studentId']

    if not isinstance(studentID, int):
        print("Invalid student ID")
        return HttpResponseBadRequest('Invalid student ID: %s' %str(studentID))
    else:
        try:
            scenarioQuerySet = md.Scenario.objects.filter(id=studentID)
            resultData = (list(scenarioQuerySet.values()))
        except md.User.DoesNotExist:
            return HttpResponseNotFound('Student ID not found.')
        else:
            print("Got all scenarios")
            return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")


def scenarioIntroduction(request):
    jsonData = json.loads(request.body)
    scenarioID = jsonData['scenarioId']

    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' %str(scenarioID))
    else:
        try:
            scenarioIntroQuerySet = md.Page.objects.filter(order=INTROPAGE, scenario_id=scenarioID)
            resultData = (list(scenarioIntroQuerySet.values()))
        except md.Page.DoesNotExist:
            return HttpResponseNotFound('No scenario found with scenario ID.' %str(scenarioID))
        else:
            print("Got scenario introduction.")
            return JsonResponse({'status':200, 'result': resultData}, content_type="application/json")


def scenarioTask(request):
    jsonData = json.loads(request.body)
    scenarioID = jsonData['scenarioId']

    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
    else:
        try:
            scenarioTaskQuerySet = md.Page.objects.filter(order=TASKPAGE, scenario_id=scenarioID)
            resultData = (list(scenarioTaskQuerySet.values()))
            print(resultData)
        except md.DoesNotExist:
            return HttpResponseNotFound('No scenario found with scenario ID.' % str(scenarioID))
        else:
            print("Got scenario introduction.")
            return JsonResponse({'status': 200, 'result': resultData})

