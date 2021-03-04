from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseNotFound, HttpResponseBadRequest
import new.models as md

# Create your views here.
"""def err_json_res(status, err):
    return JsonResponse({'status':int(status), 'error':err})"""

def index(request):
    return HttpResponse("This is the API")


def scenarios(request):
    studentID = request.GET['studentid']
    if not isinstance(studentID, int):
        print("Invalid student ID")
        return HttpResponseBadRequest('Invalid student ID: %s' %str(studentID))
    else:
        try:
            res = md.User.get(id=studentID)
        except md.DoesNotExist:
            return HttpResponseNotFound('Student ID not found.')
        else:
            print("Got all scenarios")
            return JsonResponse({'status':200, 'result':res},)


def intro(request):
    scenarioID = request.GET['scenarioid']
    if not isinstance(studentID, int):
        print("Invalid ID")
        return HttpResponseBadRequest('Invalid scenario ID: %s' %str(scenarioID))
    else:
        try:
            res = getattr(md.Scenario.get(id=scenarioID), 'description')
        except md.DoesNotExist:
            return HttpResponseNotFound('No scenario found with scenario ID.' %str(scenarioID))
        else:
            print("Got scenario introduction.")
            return JsonResponse({'status': 200, 'result': res})


def task(request):
    scenarioID = request.GET['scenarioid']
    if not isinstance(studentID, int):
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

