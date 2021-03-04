from django.shortcuts import render
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import new.models as md
import json


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
    scenarioID = jsonData['scenarioID']

    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' %str(scenarioID))
    else:
        try:
            res = getattr(md.Scenario.objects.get(id=scenarioID), 'description')
        except md.DoesNotExist:
            return HttpResponseNotFound('No scenario found with scenario ID.' %str(scenarioID))
        else:
            print("Got scenario introduction.")
            return JsonResponse({'status':200, 'result': res}, content_type="application/json")


def task(request):
    scenarioID = request.POST['scenarioid']
    if not isinstance(scenarioID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' % str(scenarioID))
    else:
        try:
            res = getattr(md.Scenario.get(id=scenarioID), 'additional_data')
        except md.DoesNotExist:
            return HttpResponseNotFound('No scenario found with scenario ID.' % str(scenarioID))
        else:
            print("Got scenario introduction.")
            return JsonResponse({'status': 200, 'result': res})

