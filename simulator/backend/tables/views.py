from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializer import *
from django.core import serializers
from rest_framework import status  
import json
from django.db import connection
from rest_framework.parsers import JSONParser
from rest_framework.viewsets import ModelViewSet
from django.http.response import JsonResponse
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework import mixins
import urllib
from datetime import datetime
import tables.models as md   


# Create your views here.

class usersViewSet(viewsets.ModelViewSet):
    queryset = users.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = usersSerializer


class coursesViewSet(viewsets.ModelViewSet):
    queryset = courses.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = coursesSerializer


class course_invitationsViewSet(viewsets.ModelViewSet):
    queryset = course_invitations.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = course_invitationsSerializer


class takesViewSet(viewsets.ModelViewSet):
    queryset = takes.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = takesSerializer


class course_assignmentViewSet(viewsets.ModelViewSet):
    queryset = course_assignment.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = course_assignmentSerializer


class sessionsViewSet(viewsets.ModelViewSet):
    queryset = sessions.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = sessionsSerializer


class session_timesViewSet(viewsets.ModelViewSet):
    queryset = session_times.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = session_timesSerializer


class reflections_takenViewSet(viewsets.ModelViewSet):
    queryset = reflections_taken.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = reflections_takenSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['RQ_ID', 'SESSION_ID', 'PAGE_ID']


class action_page_choicesViewSet(viewsets.ModelViewSet):
    queryset = action_page_choices.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = action_page_choicesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['APC_ID', 'SESSION_ID', 'PAGE_ID']


class conversations_hadViewSet(viewsets.ModelViewSet):
    queryset = conversations_had.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = conversations_hadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['STAKEHOLDER_ID', 'SESSION_ID']

class multi_reflection(APIView):
    def post(self, request, *args, **kwargs):
        SESSION = self.request.query_params.get('SESSION_ID')
        if SESSION == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
        print(request.data)
        for refl in request.data:
            itemdict = {}
            itemdict['REFLECTIONS'] = refl['REFLECTIONS']
            itemdict['RQ_ID'] = refl['RQ_ID']
            itemdict['PAGE_ID'] = refl['PAGE_ID']
            itemdict['SESSION_ID'] = refl['SESSION_ID']
            serializer = reflections_takenSerializer(data=itemdict)
            if serializer.is_valid(): 
                serializer.save()
        refl_query = reflections_taken.objects.filter(SESSION_ID_id = SESSION).values()
        return Response(refl_query)


def startSession(request):
    if request.method == "POST":
        userId = (request.GET['userId'])
        scenarioId = int(request.GET['scenarioId'])

        # Check if there is a User given the userId 
        try:
            user = users.objects.get(USER_ID=userId)
        except users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        message = None
        # Obtain session field based on given params
        try:
            session = sessions.objects.get(USER_ID=user.USER_ID, SCENARIO_ID=scenarioId)
            session.MOST_RECENT_ACCESS = datetime.now()
            session.save()
            message = 'Session resumed successfully.'
        except sessions.DoesNotExist:
            session = sessions(USER_ID_id=user.USER_ID, SCENARIO_ID=scenarioId, DATE_STARTED=datetime.now(), MOST_RECENT_ACCESS=datetime.now())
            session.save()
            message = 'Session created succesfully.'

        responseObj = {}
        responseObj["sessionId"] = session.SESSION_ID
        responseObj["mostRecentAccess"] = session.MOST_RECENT_ACCESS
        
        return JsonResponse(status=200, data={'status': 200, 'message': message, 'result': responseObj})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

def endSession(request):
    if request.method == "POST":
        userId = (request.GET['userId'])
        scenarioId = int(request.GET['scenarioId'])

        # Check if there is a User given the userId 
        try:
            user = users.objects.get(USER_ID=userId)
        except users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            session = sessions.objects.get(USER_ID_id=user.USER_ID, SCENARIO_ID=scenarioId)
            session.IS_FINISHED = True
            session.DATE_FINISHED = datetime.now()
            session.save()
        except sessions.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'Session does not exist so it cannot be ended.'})

        responseObj = {}
        responseObj["sessionId"] = session.SESSION_ID
        responseObj["mostRecentAccess"] = session.MOST_RECENT_ACCESS
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'Session successfully ended.'})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

def readAttributes(request):
    try: 
        resultData = {
                "userId": request.META['uid'],
                "name": request.META['displayName'],
                "affliation": request.META['eduPersonPrimaryAffiliation'],
                "email": request.META['mail']
        }
    except KeyError as ex:
        resultData = {
                "userId": "gerrygan",
                "name": "Gerry Gan",
                "affliation": "Student",
                "email": "example@umass.edu"
        }

    return JsonResponse(status=200, data={'status': 200, 'message':'success', 'result': resultData})

def startSessionTimes(request):
    if request.method == "POST":
        sessionId = int(request.GET['sessionId'])
        pageId = int(request.GET['pageId'])

        # Check if there is a User given the userId 
        try:
            session = sessions.objects.get(SESSION_ID=sessionId)
        except users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        message = None
        # Obtain session field based on given params
        try:
            sessionTimes = session_times.objects.get(SESSION_ID=session.SESSION_ID, PAGE_ID=pageId)
            sessionTimes.MOST_RECENT_ACCESS = datetime.now()
            sessionTimes.save()
            message = 'Session resumed successfully.'
        except session_times.DoesNotExist:
            sessionTimes = session_times(SESSION_ID_id=session.SESSION_ID, PAGE_ID=pageId, START_TIME=datetime.now(), MOST_RECENT_ACCESS=datetime.now())
            sessionTimes.save()
            message = 'Session created succesfully.'

        responseObj = {}
        responseObj["sessionId"] = sessionTimes.SESSION_ID_id
        responseObj["mostRecentAccess"] = sessionTimes.MOST_RECENT_ACCESS
        responseObj["endtime"] = sessionTimes.END_TIME
        
        return JsonResponse(status=200, data={'status': 200, 'message': message, 'result': responseObj})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

def endSessionTimes(request):
    if request.method == "POST":
        sessionId = int(request.GET['sessionId'])
        pageId = int(request.GET['pageId'])

        # Check if there is a User given the userId 
        try:
            session = sessions.objects.get(SESSION_ID=sessionId)
        except users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            sessionTimes = session_times.objects.get(SESSION_ID_id=session.SESSION_ID, PAGE_ID=pageId)
            sessionTimes.END_TIME = datetime.now()
            sessionTimes.save()
        except session_times.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'Session does not exist so it cannot be ended.'})

        responseObj = {}
        responseObj["sessionId"] = sessionTimes.SESSION_ID
        responseObj["mostRecentAccess"] = sessionTimes.MOST_RECENT_ACCESS
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'Session successfully ended.'})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})


class courses_for_user(APIView):
    def get(self, request, *args, **kwargs):
        
        USER = self.request.query_params.get('user_id')
        user_query = users.objects.filter(USER_ID = USER).values()
        dashboard = []
        for user in user_query:
            courses_for_query = takes.objects.filter(USER_ID = user['USER_ID']).values()
            course_id_array = []
            for x in courses_for_query:
                course_id_array.append(x['COURSE_ID_id'])

            course_dict_array = []
            for x in course_id_array:
                course = courses.objects.get(COURSE_ID= x)
                course_dict = {"COURSE":course.COURSE_ID, "NAME": course.NAME}
                course_dict_array.append(course_dict)
                    
            user["COURSES"] = course_dict_array
            dashboard.append(user)
                
        return Response(dashboard)

def readAttributes(request):
    try: 
        resultData = {
                "userId": request.META['uid'],
                "name": request.META['displayName'],
                "affliation": request.META['eduPersonPrimaryAffiliation'],
                "email": request.META['mail']
        }
    except KeyError as ex:
        resultData = {
                "userId": "gerrygan",
                "name": "Gerry Gan",
                "affliation": "Student",
                "email": "example@umass.edu"
        }

    return JsonResponse(status=200, data={'status': 200, 'message':'success', 'result': resultData})

