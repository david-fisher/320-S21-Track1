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
from django.db.models import F
from django.db import connection
from rest_framework.parsers import JSONParser
from rest_framework.viewsets import ModelViewSet
from django.http.response import JsonResponse
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework import mixins
import urllib
from datetime import datetime
from django.utils import timezone
import tables.models as md   
import logging


# Create your views here.

class usersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user_id']


class coursesViewSet(viewsets.ModelViewSet):
    queryset = courses.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = CoursesSerializer


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


class action_page_responsesViewSet(viewsets.ModelViewSet):
    queryset = action_page_responses.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = action_page_responsesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['APC_ID', 'SESSION_ID', 'PAGE_ID_id']


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

        try:
            scenario = scenarios.objects.get(SCENARIO=scenarioId)
        except scenarios.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No scenario found with the given scenarioId'})
        

        # Check if there is a User given the userId 
        try:
            user = Users.objects.get(user_id=userId)
        except Users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        message = None
        # Obtain session field based on given params
        try:
            session = sessions.objects.get(USER_ID=user.user_id, SCENARIO_ID_id=scenario.SCENARIO)
            session.MOST_RECENT_ACCESS = datetime.now(tz=timezone.utc)
            session.save()
            message = 'Session resumed successfully.'
        except sessions.DoesNotExist:
            session = sessions(USER_ID_id=user.user_id, SCENARIO_ID_id=scenario.SCENARIO, DATE_STARTED=datetime.now(tz=timezone.utc), MOST_RECENT_ACCESS=datetime.now(tz=timezone.utc))
            session.save()
            message = 'Session created succesfully.'

        responseObj = {}
        responseObj["sessionId"] = session.SESSION_ID
        responseObj["mostRecentAccess"] = session.MOST_RECENT_ACCESS
        
        print(responseObj)
        return JsonResponse(status=200, data={'status': 200, 'message': message, 'result': responseObj})
    
    elif request.method == "GET":
        return JsonResponse(status=400, data={'status': 400, 'message': 'Use the POST method for requests to this endpoint'})

def endSession(request):
    if request.method == "POST":
        userId = (request.GET['userId'])
        scenarioId = int(request.GET['scenarioId'])

        try:
            scenario = scenarios.objects.get(SCENARIO=scenarioId)
        except scenarios.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No scenario found with the given scenarioId'})
        

        # Check if there is a User given the userId 
        try:
            user = Users.objects.get(user_id=userId)
        except Users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            session = sessions.objects.get(USER_ID_id=user.user_id, SCENARIO_ID_id=scenario.SCENARIO)
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
                "affiliation": request.META['eduPersonPrimaryAffiliation'],
                "email": request.META['mail']
        }
    except KeyError as ex:
        resultData = {
                "userId": "gerrygan",
                "name": "Gerry Gan",
                "affiliation": "Student",
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
        except Users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            page = pages.objects.get(PAGE=pageId)
        except pages.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        message = None
        # Obtain session field based on given params
        try:
            sessionTimes = session_times.objects.get(SESSION_ID_id=session.SESSION_ID, PAGE_ID_id=page.PAGE)
            sessionTimes.MOST_RECENT_ACCESS = datetime.now()
            sessionTimes.save()
            message = 'Session resumed successfully.'
        except session_times.DoesNotExist:
            sessionTimes = session_times(SESSION_ID_id=session.SESSION_ID, PAGE_ID_id=page.PAGE, START_TIME=datetime.now(), MOST_RECENT_ACCESS=datetime.now())
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
        except Users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            page = pages.objects.get(PAGE=pageId)
        except pages.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,
                                                'message': 'No User found based on given user Id'})

        try:
            sessionTimes = session_times.objects.get(SESSION_ID_id=session.SESSION_ID, PAGE_ID_id=page.PAGE)
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
        user_query = Users.objects.filter(user_id = USER).values()
        dashboard = []
        for user in user_query:
            courses_for_query = takes.objects.filter(USER_ID = user['user_id']).values()
            course_id_array = []
            for x in courses_for_query:
                course_id_array.append(x['COURSE_ID_id'])

            course_dict_array = []
            # print(user)
            for x in course_id_array:
                course = courses.objects.get(COURSE= x)
                course_dict = {"COURSE":course.COURSE, "NAME": course.NAME}
                course_dict_array.append(course_dict)
                scenarios_for_query = scenarios_for.objects.filter(COURSE=x).values()
                scenario_dict = []
                # print(scenarios_for_query)
                # print(course_dict)
                for scen in scenarios_for_query:
                    scenar = scenarios.objects.get(SCENARIO = scen['SCENARIO_id'])
                    first_page = pages.objects.get(SCENARIO = scen['SCENARIO_id'], PAGE_TYPE = "I")
                    finished = False
                    sess_list = sessions.objects.all()
                    for sess in sess_list:
                        if(sess.SCENARIO_ID_id == scen['SCENARIO_id'] and sess.USER_ID_id == USER):
                            finished = sess.IS_FINISHED
                        
                    # scenar_serializer = ScenariosSerializer(scenar, many=True).data
                    if scenar.IS_FINISHED == True:
                        scenario_dict.append({"SCENARIO": scenar.SCENARIO, "USER":scenar.user_id, "NAME":scenar.NAME, "PUBLIC":scenar.PUBLIC, "DATE_CREATED": scenar.DATE_CREATED, "NUM_CONVERSATION": scenar.NUM_CONVERSATION, "FIRST_PAGE": first_page.PAGE, "IS_FINISHED": finished})
                course_dict["SCENARIOS"] = scenario_dict
                # print(scenario_dict)
                # print(x)
                    
            user["COURSES"] = course_dict_array
            # print(user)
            dashboard.append(user)
                
        return Response(dashboard)


def radarPlot(request):
    if request.method == 'GET':
        # retrieve user ID
        try:
            userID = (request.GET['userId'])
        except Exception as ex:
            return JsonResponse(status=400, message='Invalid User ID')
        
        # retrieve version ID
        try:
            scenarioID = int(request.GET['scenarioId'])
        except Exception as ex:
            return JsonResponse(status=400, message='Invalid Version ID')

        resultData = []
        try:
            # check if user ID exist 
            userObj = Users.objects.get(user_id=userID)

            # check if version ID exist
            scenarioObj = scenarios.objects.get(SCENARIO=scenarioID)
            
            # check if session ID exist
            sessionQuerySet = sessions.objects.filter(USER_ID_id=userID, SCENARIO_ID_id=scenarioID).values('SESSION_ID')
            if len(sessionQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,'message': 'No Session ID found'})

            print('AAAAA')

            # check if issue ID exist
            issueQuerySet = Issues.objects.filter(SCENARIO_id=scenarioID).values('ISSUE', 'NAME', 'IMPORTANCE_SCORE').order_by('-IMPORTANCE_SCORE')
            if len(issueQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,'message': 'No Issue ID found'})

            # get all stakeholders
            stakeholderQuerySet = stakeholders.objects.filter(SCENARIO_id=scenarioID).values('STAKEHOLDER')
            if len(stakeholderQuerySet) == 0:
                return JsonResponse(status=404, data={'status': 404,'message': 'No Stakeholder ID found'})

            print(sessionQuerySet)
            print(issueQuerySet)
            print(stakeholderQuerySet)

            
            # check if stakeholders have been talked to
            stakeholderHadQuerySet = conversations_had.objects.filter(SESSION_ID_id=sessionQuerySet[0]['SESSION_ID']).values(STAKEHOLDER=F('STAKEHOLDER_ID_id'))
            # print(stakeholderHadQuerySet)
            # if len(stakeholderHadQuerySet) == 0:
            #     return JsonResponse(status=404, data={'status': 404,'message': 'Stakeholder ID hasn\'t been submitted'})

            print(stakeholderHadQuerySet)

            issue_coverage = {}
            for key in issueQuerySet:
                issue_coverage[key['ISSUE']] = {'name': key['NAME'], 'student_coverage': 0.0, 'total_coverage': 0.0, 'student_percentage': 0.0, 'importance_coverage': 0.0, 'importance_score': key['IMPORTANCE_SCORE']}
            for issue in issueQuerySet:
                issueName = issue['NAME']
                issueID = issue['ISSUE']
                issueimpscore = issue['IMPORTANCE_SCORE']
                for stakeholder in stakeholderQuerySet:
                    coverage1 = coverage.objects.filter(ISSUE_id=issueID, STAKEHOLDER_id=stakeholder['STAKEHOLDER']).values()
                    if len(coverage1) != 0:
                        issue_coverage[issueID]['total_coverage'] += coverage1[0]['COVERAGE_SCORE'] # add total
                        if stakeholder in stakeholderHadQuerySet: # if stakeholder has been talked to, add coverage
                            issue_coverage[issueID]['student_coverage'] += coverage1[0]['COVERAGE_SCORE']
                issue_coverage[issueID]['student_percentage'] = issue_coverage[issueID]['student_coverage'] / issue_coverage[issueID]['total_coverage'] * 100
                issue_coverage[issueID]['importance_coverage'] = (issue_coverage[issueID]['student_coverage'] / issue_coverage[issueID]['total_coverage'])*(issueimpscore/5)
            
            for key in issue_coverage.keys():
                resultData.append(issue_coverage[key])

        except Users.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404, 'message': 'No User ID found'})
        except scenarios.DoesNotExist:
            return JsonResponse(status=404, data={'status': 404,'message': 'No Version ID found'})
        except Exception as ex:
            logging.exception("Exception thrown: Query Failed to retrieve Radar Plot")

        return JsonResponse(status=200, data={'status': 200, 'message': 'success', 'result': resultData})


