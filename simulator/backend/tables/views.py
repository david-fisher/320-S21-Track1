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
    filterset_fields = ['RQ_ID', 'SESSION_ID']


class action_page_choicesViewSet(viewsets.ModelViewSet):
    queryset = action_page_choices.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = action_page_choicesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['APC_ID', 'SESSION_ID']


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
        userId = int(request.GET['userId'])
        versionId = int(request.GET['acId'])

        # Check if there is a Version given the versionId 
        try:
            version = md.Version.objects.get(version_id=versionId)
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No version found with the given versionId'})
        
        # Check if there is a User given the userId 
        try:
            user = md.User.objects.get(user_id=userId)
        except md.User.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        message = None
        # Obtain session field based on given params
        try:
            session = md.Session.objects.get(user_id=user.user_id, version_id=version.version_id)
            session.most_recent_access = datetime.now()
            session.save()
            message = 'Session resumed successfully.'
        except md.Session.DoesNotExist:
            session = md.Session(user_id=user.user_id, scenario_id=version.scenario_id, version_id=version,
                                 date_started=datetime.now(), most_recent_access=datetime.now())
            session.save()
            message = 'Session created succesfully.'

        responseObj = {}
        responseObj["sessionId"] = session.session_id
        responseObj["versionId"] = session.version_id_id
        responseObj["mostRecentAccess"] = session.most_recent_access
        
        return JsonResponse(status=200, data={'status': 200, 'message': message, 'result': responseObj})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

def endSession(request):
    if request.method == "POST":
        userId = int(request.GET['userId'])
        versionId = int(request.GET['versionId'])

        # Check if there is a Version given the versionId 
        try:
            version = md.Version.objects.get(version_id=versionId)
        except md.Version.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No version found with the given versionId'})
        
        # Check if there is a User given the userId 
        try:
            user = md.User.objects.get(user_id=userId)
        except md.User.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            session = md.Session.objects.get(user_id=user.user_id, version_id=version.version_id)
            session.is_finished = True
            session.save()
        except md.Session.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'Session does not exist so it cannot be ended.'})

        responseObj = {}
        responseObj["sessionId"] = session.session_id
        responseObj["mostRecentAccess"] = session.most_recent_access
        
        return JsonResponse(status=200, data={'status': 200, 'message': 'Session successfully ended.'})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

