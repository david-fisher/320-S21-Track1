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
from . import permissions
import urllib

# Stakeholders ViewSet
class StakeholdersViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        queryset = stakeholders.objects.all()
        return queryset
    queryset = stakeholders.objects.all()
    # Will raise a PermissionDenied exception if the test fails.
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = StakeholdersSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['SCENARIO']
    lookup_field = "STAKEHOLDER"


# Conversations ViewSet
class ConversationsViewSet(viewsets.ModelViewSet):
    queryset = conversations.objects.all()
     # Will raise a PermissionDenied exception if the test fails.
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = ConversationsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['STAKEHOLDER', 'QUESTION']


class user_accessViewSet(viewsets.ModelViewSet):
    queryset = user_access.objects.all()
     # Will raise a PermissionDenied exception if the test fails.
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = user_accessSerializer
    filter_backends = [DjangoFilterBackend]


class multi_conv(APIView):
    def put(self, request, *args, **kwargs):
        STAKEHOLDER = self.request.query_params.get('STAKEHOLDER')
        if STAKEHOLDER == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
        for updated_conv in request.data:
            extant_conv = conversations.objects.get(STAKEHOLDER = STAKEHOLDER, CONVERSATION = updated_conv['CONVERSATION'])
            serializer = ConversationsSerializer(extant_conv, data=updated_conv)
            if serializer.is_valid(): 
                serializer.save()
        conv_query = conversations.objects.filter(STAKEHOLDER = STAKEHOLDER).values()
        return Response(conv_query)

class multi_stake(APIView):
    def put(self, request, *args, **kwargs):
        SCENARIO = self.request.query_params.get('SCENARIO')
        if SCENARIO == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
        for updated_stake in request.data:
            extant_stake = stakeholders.objects.get(SCENARIO = SCENARIO, STAKEHOLDER = updated_stake['STAKEHOLDER'])
            serializer = StakeholdersSerializer(extant_stake, data=updated_stake)
            if serializer.is_valid(): 
                serializer.save()
        stake_query = stakeholders.objects.filter(SCENARIO = SCENARIO).values()
        return Response(stake_query)

class multi_coverage(APIView):
    def put(self, request, *args, **kwargs):
        STAKEHOLDER = self.request.query_params.get('STAKEHOLDER')
        if STAKEHOLDER == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
        for updated_coverage in request.data:
            extant_coverage = coverage.objects.get(STAKEHOLDER = STAKEHOLDER, ISSUE = updated_coverage['ISSUE'])
            serializer = coverageSerializer(extant_coverage, data=updated_coverage)
            if serializer.is_valid(): 
                serializer.save()
        coverage_query = coverage.objects.filter(STAKEHOLDER = STAKEHOLDER).values()
        return Response(coverage_query)


class CoverageViewSet(viewsets.ModelViewSet):
    queryset = coverage.objects.all()
    permission_classes = [permissions.IsFaculty]
    serializer_class = coverageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['STAKEHOLDER']

    


class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    permission_classes = [
        permissions.IsFaculty
    ]
    serializer_class = UserSerializer






class ScenariosForViewSet(viewsets.ModelViewSet):
    queryset = scenarios_for.objects.all()
    permission_classes = [
        permissions.IsFaculty
    ]
    serializer_class = Scenarios_forSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['COURSE']

class ScenariosViewSet(viewsets.ModelViewSet):
    queryset = scenarios.objects.all()
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = ScenariosSerializer

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SingleScenarioViewSet(viewsets.ModelViewSet):
    def get(self, request):
        scenario = scenarios.objects.all()
        serializer = ScenariosSerializer(scenarios)
        return Response(serializer.data)



class PagesViewSet(viewsets.ModelViewSet):
    queryset = pages.objects.all()
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = PagesSerializer

# Stakeholder_page Viewset
class Stakeholder_pageViewSet(viewsets.ModelViewSet):
    queryset = stakeholder_page.objects.all()
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = Stakeholder_pageSerializer


class Reflection_QuestionsViewSet(viewsets.ModelViewSet):
    queryset = reflection_question.objects.all()
    permissions_classes = [
        permissions.IsFaculty
    ]
    serializer_class = Reflection_questionsSerializer


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = courses.objects.all()
    permission_classes = [permissions.IsFaculty]
    serializer_class = CoursesSerializer



#this allows for filerting scenarios by professor_id
class allScenariosViewSet(generics.ListAPIView):
    serializer_class = allScenariosSerializer
    queryset = scenarios.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['PROFESSOR', 'IS_FINISHED']
    

class VersionsViewSet(viewsets.ModelViewSet):
    queryset = Versions.objects.all()
    permissions_class = [
        permissions.IsFaculty
    ]
    serializer_class = VersionsSerializer

# Professors_teach ViewSet
class Professors_teachViewSet(viewsets.ModelViewSet):
    queryset = professors_teach.objects.all()
    permissions_class = [
        permissions.IsFaculty
    ]
    serializer_class = Professors_teachSerializer

class IssuesViewSet(viewsets.ModelViewSet):
    queryset = Issues.objects.all()
    permission_classes = [
        permissions.IsFaculty
    ]
    serializer_class = IssuesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['SCENARIO', "NAME"]


class Action_pageViewSet(viewsets.ModelViewSet):
    queryset = action_page_choices.objects.all()
    permission_classes = [
        permissions.IsFaculty
    ]
    serializer_class = Action_pageSerializer

#for getting/editing scenarios in dashboard
class logistics_page(APIView):
    #http_method_names = [ 'POST,' 'PUT', 'DELETE']

    def get(self, request, *args, **kwargs):
        
        #take professor_id as input from URL by adding ?professor_id=<the id #> to the end of the url.
        SCENARIO = self.request.query_params.get('scenario_id')
        #TODO check that id != none
        #get all scenarios belonging to this professor
        scenario = scenarios.objects.get(SCENARIO = SCENARIO)
        scenario_dict = ScenariosSerializer(scenario).data
        #loop through scenarios and append required information (course, page info)
        scenarios_for_query = scenarios_for.objects.filter(SCENARIO_id=scenario_dict['SCENARIO']).values()
        course_id_array = []
        for x in scenarios_for_query:
            print(2, x)
            course_id_array.append(x['COURSE_id'])

        course_dict_array = []
        for x in course_id_array:
            course = courses.objects.get(COURSE = x)
            course_dict_array.append({"COURSE":course.COURSE, "NAME": course.NAME})
                
        pages_query = pages.objects.filter(SCENARIO_id=scenario_dict['SCENARIO']).values()
        
        page_array = []
        for page in pages_query:
            cropped_page = {}
            cropped_page['PAGE'] = page['PAGE']
            cropped_page['PAGE_TITLE'] = page['PAGE_TITLE']
            cropped_page['PAGE_TYPE'] = page['PAGE_TYPE']
            page_array.append(cropped_page) 


        scenario_dict.update({
            "COURSES": course_dict_array,
            "PAGES": page_array
        })

        
        logistics = scenario_dict
        return Response(logistics)
    
    """format:
    {
        "SCENARIO": 1,
        "VERSION": 0,
        "NAME": "Pizza is Good!",
        "IS_FINISHED": false,
        "PUBLIC": false,
        "NUM_CONVERSATION": 5,
        "PROFESSOR": 12345678,
        "COURSES": 
        [
            {
                "COURSE": 2,
                "NAME": "590G"
            },
            {
                "COURSE": 1,
                "NAME": "320"
            }
        ]
    }
        """
    #a put request for editing scenarios. must provide scenario_id in url thusly: /logistics?scenario_id=<insert id number here>
    def put(self, request, *args, **kwargs):
        #save the scenario
        extant_scenario = scenarios.objects.get(SCENARIO = request.data['SCENARIO'])
        request.data["user_id"] = extant_scenario.user.user_id
        scenario_serializer = ScenariosSerializer(extant_scenario, data = request.data)
        scenario_serializer.user = extant_scenario.user
        if scenario_serializer.is_valid():
            scenario_serializer.save()
        else:
            print(scenario_serializer.errors)

        #delete currently assocated classes
        scenarios_for.objects.filter(SCENARIO = request.data['SCENARIO']).delete()
        #get array of courses from frontend
        COURSES = request.data['COURSES']
        for course in COURSES:
            scenarios_for_dict = {
                "COURSE" : course['COURSE'],
                "SCENARIO" : request.data['SCENARIO'],
            }
            print(scenarios_for_dict)
        #save the classes associated with it in scenarios_for
            for_serializer = Scenarios_forSerializer(data=scenarios_for_dict)
            if for_serializer.is_valid():
                for_serializer.save()
                print('saved!')
            print(for_serializer.errors)
        scenario_dict = ScenariosSerializer(scenarios.objects.get(SCENARIO = request.data['SCENARIO'])).data
        scenario_dict['COURSES'] = request.data['COURSES']

        # If professor chooses to publish
        if request.data.get("PUBLIC", False) and request.data.get("IS_FINISHED", False):
            super_dict = SuperScenariosSerialializer(scenarios.objects.get(SCENARIO=request.data["SCENARIO"])).data
            print(json.dumps(super_dict))
            to_dump = dict()
            to_dump["Scenario"] = {
                "scenario_id": super_dict["SCENARIO"],
                "name": super_dict["NAME"],
                "public": super_dict["PUBLIC"],
                "is_finished": super_dict["IS_FINISHED"],
                "date_created": super_dict["DATE_CREATED"],
            }
            
            to_dump["Scenario"]["FirstPage"] = next(page["PAGE"] for page in super_dict["pages"] if page["PAGE_TITLE"] == "Introduction")
            
            to_dump["Pages"] = {
                page["PAGE"]: {
                    "page_id": page["PAGE"],
                    "page_type": page["PAGE_TYPE"],
                    "page_title": page["PAGE_TITLE"],
                    "next_page": page["NEXT_PAGE"],
                    "body": page["PAGE_BODY"],
                    "x_coordinate": page["X_COORDINATE"],
                    "y_coordinate": page["Y_COORDINATE"],
                    "version_id": page["VERSION"]
                } for page in super_dict["pages"]
            }

            to_dump["Stakeholders"] = [
                {
                    "stakeholder_id": stakeholder["STAKEHOLDER"],
                    "name": stakeholder["NAME"],
                    "photopath": stakeholder["PHOTO"],
                    "scenario_id": stakeholder["SCENARIO"],
                    "description": stakeholder["DESCRIPTION"],
                    "introduction": stakeholder["INTRODUCTION"],
                    "job": stakeholder["JOB"],
                    "version_id": stakeholder["VERSION"]
                } for stakeholder in super_dict["stakeholders"]
            ]

            to_dump["Issues"] = [
                {
                    "issue_id": issue["ISSUE"],
                    "version_id": issue["VERSION"],
                    "scenario_id": issue["SCENARIO"],
                    "importance_score": issue["IMPORTANCE_SCORE"],
                    "name": issue["NAME"]
                } for issue in super_dict["issues"]
            ]

            to_dump["ActionPageChoices"] = [
                {
                    "apc_id": action_page_choice["APC_ID"],
                    "page_id": action_page_choice["PAGE"],
                    "choice": action_page_choice["CHOICE"],
                    "result_page": action_page_choice["RESULT_PAGE"],
                } for page in super_dict["pages"] for action_page_choice in page["action_page_choices"] 
            ]


            to_dump["ReflectionQuestions"] = [
                {
                    "rq_id": reflection_question["RQ_ID"],
                    "page_id": reflection_question["PAGE"],
                    "version_id": reflection_question["VERSION"],
                    "reflection_question": reflection_question["REFLECTION_QUESTION"],
                } for page in super_dict["pages"] for reflection_question in page["reflection_questions"] 
            ]

            to_dump["CourseAssignment"] = [
                {
                    "scenario_id": course["SCENARIO"],
                    "course_id": course["COURSE"]["COURSE"]
                } for course in super_dict["scenarios_for"]
            ]

            to_dump["Courses"] = [
                {
                    "name": course["COURSE"]["NAME"],
                    "course_id": course["COURSE"]["COURSE"]
                } for course in super_dict["scenarios_for"]
            ]

            to_dump["Coverages"] = [
                {
                    "stakeholder_id": coverage["STAKEHOLDER"],
                    "issue_id": coverage["ISSUE"],
                    "coverage_score": coverage["COVERAGE_SCORE"]
                } for stakeholder in super_dict["stakeholders"] for coverage in stakeholder["coverages"]
            ]

            to_dump["Conversations"] = [
                {
                    "stakeholder_id": conversation["STAKEHOLDER"],
                    "conversation_id": conversation["CONVERSATION"],
                    "conversation_response": conversation["RESPONSE"],
                    "question": conversation["QUESTION"]
                } for stakeholder in super_dict["stakeholders"] for conversation in stakeholder["conversations"]
            ]

            to_post_to = request.build_absolute_uri("backend/scenarios/publish").replace(":8000", ":7000")
            data = json.dumps(to_dump)
            data = str(data)
            print(data)
            # Convert string to byte
            data = data.encode('utf-8')

            # data = urllib.parse.urlencode(to_dump).encode()
            req =  urllib.request.Request(to_post_to, data=data) # this will make the method "POST"
            resp = urllib.request.urlopen(req)


            print(json.dumps(to_dump))

        return Response(scenario_dict)

#returns list of scenarios for given professor along with list of associated courses
class dashboard_page(APIView):
    def get(self, request, *args, **kwargs):
        
        #take professor_id as input from URL by adding ?professor_id=<the id #> to the end of the url.
        PROFESSOR = self.request.query_params.get('professor_id')
        #TODO check that id != none
        #get all scenarios belonging to this professor
        scenario_query = scenarios.objects.filter(user_id__user_id = PROFESSOR).values()
        #loop through scenarios and append required information (course, page info)
        logistics = []
        for scenario in scenario_query:
            scenarios_for_query = scenarios_for.objects.filter(SCENARIO = scenario['SCENARIO']).values()
            course_id_array = []
            for x in scenarios_for_query:
                course_id_array.append(x['COURSE_id'])

            course_dict_array = []
            for x in course_id_array:
                course = courses.objects.get(COURSE= x)
                course_dict = {"COURSE":course.COURSE, "NAME": course.NAME}
                course_dict_array.append(course_dict)
                    
            scenario["COURSES"] = course_dict_array
            logistics.append(scenario)
                
        return Response(logistics)

        """format:

        {
        "NAME": "Best Test",
        "IS_FINISHED": false,
        "PUBLIC": false,
        "NUM_CONVERSATION": 5,
        "PROFESSOR": 12345678,
        "COURSES":[
            {"COURSE": 1},
            {"COURSE": 2},
            {"COURSE": 3}
        ]
        }
        """

    def post(self, request, *args, **kwargs):
        #save the scenario
        request.data["user_id"] = request.data["PROFESSOR"]
        del request.data["PROFESSOR"]
        scenario_serializer = ScenariosSerializer(data = request.data)
        if not (scenario_serializer.is_valid()):
            print(scenario_serializer.errors)
            print("scenario saved incorrectly")
            return Response(scenario_serializer.errors)
        scenario_serializer.save()
        scenario_dict = scenario_serializer.data
        
        #get array of courses from frontend
        COURSES = request.data['COURSES']
        for course in COURSES:
            scenarios_for_dict = {
                "SCENARIO" : scenario_dict['SCENARIO'],
                "COURSE" : course['COURSE'],
            }
            print(scenarios_for_dict)
            print(scenario_dict)
            for_serializer = Scenarios_forSerializer(data=scenarios_for_dict)
            if not for_serializer.is_valid():
                print("scenarios_for saved incorrectly")
                return Response(for_serializer.errors)

            for_serializer.save()

        #create a new intro page
        intro_page = {
        "PAGE_TYPE": "I",
        "PAGE_TITLE": "Introduction",
        "PAGE_BODY": "Page body",
        "SCENARIO": scenario_dict['SCENARIO'],
        "NEXT_PAGE": None,
        "X_COORDINATE": 0,
        "Y_COORDINATE": 0
        }

        intro_page_serializer = PagesSerializer(data=intro_page)
        print(intro_page_serializer)
        if intro_page_serializer.is_valid():
            intro_page_serializer.save()
        else:
            print("intro page saved incorrectly")
            print(intro_page_serializer.errors)
            return Response(intro_page_serializer.errors)

        #TODO create blank stakeholder page and return it
        #page must be called STAKEHOLDER_PAGE and serialier must be called stakeholder_page_serializer
        STAKEHOLDER_PAGE = {
        "PAGE_TYPE": "S",
        "PAGE_TITLE": "Stakeholders",
        "PAGE_BODY": "Page of Stakeholders",
        "SCENARIO": scenario_dict['SCENARIO'],
        "NEXT_PAGE": None,
        "X_COORDINATE": 0,
        "Y_COORDINATE": 0,
        }

        stakeholder_page_serializer = PagesSerializer(data=STAKEHOLDER_PAGE)
        if stakeholder_page_serializer.is_valid():
            stakeholder_page_serializer.save()
        else:
            print("Stakeholders page saved incorrectly")
            return Response(stakeholder_page_serializer.errors)


        scenario_dict = ScenariosSerializer(scenarios.objects.get(SCENARIO = scenario_dict['SCENARIO'])).data
        scenario_dict['COURSES'] = request.data['COURSES']
        scenario_dict['INTRO_PAGE'] = intro_page_serializer.data
        scenario_dict['STAKEHOLDER_PAGE'] = stakeholder_page_serializer.data
        return Response(scenario_dict)


                
            

#change a list of issue objects at URL /multi_issue?scenario_id=<insert id number here>
class multi_issue(APIView):
    def put(self, request, *args, **kwargs):
        SCENARIO = self.request.query_params.get('scenario_id')
        if SCENARIO == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
        for updated_issue in request.data:
            extant_issue = Issues.objects.get(SCENARIO = SCENARIO, ISSUE = updated_issue['ISSUE'])
            serializer = IssuesSerializer(extant_issue, data=updated_issue)
            if not serializer.is_valid(): 
                return Response(serializer.errors)
            try:
                serializer.save()
            except:
                print('something went wrong with the PUT')
        issues_query = Issues.objects.filter(SCENARIO = SCENARIO).values()
        return Response(issues_query)

#for use in the pages flowchart, input is an array of page objects
class flowchart(APIView):
    #get all page objects given a scenario id
    def get(self, request, *args, **kwargs):
        SCENARIO = int(self.request.query_params.get('scenario_id'))
        pages_query = pages.objects.filter(SCENARIO_id=SCENARIO).values()
        for page in pages_query:
            if page['PAGE_TYPE'] == 'A':
                page['ACTION'] = action_page_choices.objects.filter(PAGE=page['PAGE']).values()


        return Response(pages_query)

    #update the next_page field of all page objects
    def put(self, request, *args, **kwargs):
        SCENARIO = self.request.query_params.get('scenario_id')
        if SCENARIO == None:
            return Response({'status': 'details'}, status=status.HTTP_404_NOT_FOUND)
  
        for updated_page in request.data:
            #save updated choices within action pages  
            if updated_page['PAGE_TYPE'] == 'A':
                for updated_choice in updated_page['ACTION']:
                    extant_choice = action_page_choices.objects.filter(PAGE=updated_choice['PAGE'], CHOICE=updated_choice["CHOICE"]).first()
                    if updated_choice["RESULT_PAGE"]:
                        extant_choice.RESULT_PAGE = pages.objects.get(pk=updated_choice["RESULT_PAGE"])
                        action_serializer = Action_pageSerializer(extant_choice, updated_choice)
                        if not action_serializer.is_valid():
                            print("error with PUTing choices")
                            return Response(action_serializer.errors)
                        extant_choice.save()
            #save the page itself    
            extant_page = pages.objects.get(SCENARIO = SCENARIO, PAGE = updated_page['PAGE'])
            serializer = PagesSerializer(extant_page, data=updated_page)
            if not serializer.is_valid():
                print("error with PUTing pages")
                return Response(serializer.errors)
            serializer.save()
        #return query with newly saved pages     
        pages_query = pages.objects.filter(SCENARIO=SCENARIO).values()
        for page in pages_query:
            if page['PAGE_TYPE'] == 'A':
                page['ACTION'] = action_page_choices.objects.filter(PAGE=page['PAGE']).values()
        return Response(pages_query)



# Pages viewset
class Page_reflectionViewSet(generics.CreateAPIView):
    model = pages
    serializer_class = Pages_reflectionSerializer

class Page_actionViewSet(generics.CreateAPIView):
    model = pages
    serializer_class = Pages_actionSerializer   

class Page_StakeholderViewSet(generics.CreateAPIView):
    model = pages
    serializer_class = Pages_stakeholderSerializer
    


class pages_page(APIView):
    # Define get method for pages
    # @api_view(['GET'])
    def get(self, request, *args, **kwargs):

        # Takes the page_id from the URL if the url has ?page_id=<id> at the end, no parameter passed return error 400
        PAGE_ID = self.request.query_params.get('page_id')

        # Get all fields from this page_id if ti doesn't exist return error 404
        try:
            page = pages.objects.get(PAGE = PAGE_ID)
        except pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Convers Django Model Object into a dictionary
        page_data = PagesSerializer(page).data
        
        page_type = page.PAGE_TYPE
        # Check page.PAGE_TYPE = 'REFLECTION'
        if (page_type == 'R'):
            reflection_query = reflection_question.objects.filter(PAGE = PAGE_ID).values()
            page_data.update(
                {
                    "REFLECTION_QUESTIONS": reflection_query
                }
            )
            
            return Response(page_data, status=status.HTTP_200_OK)

        # Check page.PAGE_TYPE = 'ACTION'
        if (page_type == 'A'):
            action_query = action_page_choices.objects.filter(PAGE = PAGE_ID).values()
            page_data.update(
                {
                    "CHOICES": action_query
                }
            )

            return Response(page_data, status=status.HTTP_200_OK)
        
        # Check page.PAGE_TYPE = 'GENERIC'
        if (page_type == 'G' or page_type == 'I'):
            return Response(page_data, status=status.HTTP_200_OK)
        
        # Check page.PAGE_TYPE = 'STAKEHOLDER'
        if (page_type == 'S'):
            stakeholder_query = stakeholder_page.objects.filter(PAGE = PAGE_ID).values()
            page_data.update(
                {
                    "STAKEHOLDERS": stakeholder_query
                }
            )

            return Response(page_data, status=status.HTTP_200_OK)
        
        # Neither of these pages, something went wrong or missing implementation
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
    # Define POST function for pages
    # @api_view(['POST'])
    def post(self, request):

        # Takes the scenario_id from the URL if the url has ?scenario_id=<id> at the end, no parameter passed return error 400
        page_type = request.data["PAGE_TYPE"]
        # If the request is a reflection page  
        if (page_type == 'R'):
            pages_serializer = PagesSerializer(data=request.data)
            if pages_serializer.is_valid():
                pages_serializer.save()
                page_id = pages_serializer.data["PAGE"]
                for question in request.data['REFLECTION_QUESTIONS']:
                    question['PAGE'] = page_id
                    nested_serializer = Reflection_questionsSerializer(data=question)
                    if  nested_serializer.is_valid():
                        nested_serializer.save()
                    # If the nested page is not valid it deletes the wrapper page created above
                    else:
                        page = pages.objects.get(PAGE=page_id)
                        page.delete()
                        return Response(nested_serializer.data, status=status.HTTP_400_BAD_REQUEST)
                    #nested_serializer.save()
                return Response(pages_serializer.data, status=status.HTTP_201_CREATED)
            
            # If the request was badly made or could not be created
            return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # If the request is an action page  
        if (page_type == 'A'):
            pages_serializer = PagesSerializer(data=request.data)
            if pages_serializer.is_valid():
                pages_serializer.save()
                page_id = pages_serializer.data["PAGE"]
                for choice in request.data['CHOICES']:
                    choice['PAGE'] = page_id
                    nested_serializer = Action_pageSerializer(data=choice)
                    if  nested_serializer.is_valid():
                        nested_serializer.save()
                    # If the nested page is not valid it deletes the wrapper page created above
                    else:
                        page = pages.objects.get(PAGE=page_id)
                        page.delete()
                        return Response(nested_serializer.data, status=status.HTTP_400_BAD_REQUEST)
                    #nested_serializer.save()
                return Response(pages_serializer.data, status=status.HTTP_201_CREATED)
            
            # If the request was badly made or could not be created
            return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # If the request is a generic page  
        if (page_type == 'G' or page_type == 'I'):
            pages_serializer = PagesSerializer(data=request.data)
            if pages_serializer.is_valid():
                pages_serializer.save()
                page_id = pages_serializer.data["PAGE"]
                return Response(pages_serializer.data, status=status.HTTP_201_CREATED)
            
            # If the request was badly made or could not be created
            return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # If the request is a stakeholder page 
        if (page_type == 'S'):
            pages_serializer = PagesSerializer(data=request.data)
            if pages_serializer.is_valid():
                pages_serializer.save()
                page_id = pages_serializer.data["PAGE"]
                for stakeholder in request.data['STAKEHOLDERS']:
                    stakeholder['PAGE'] = page_id
                    nested_serializer = Stakeholder_pageSerializer(data=stakeholder)
                    if  nested_serializer.is_valid():
                        nested_serializer.save()
                    # If the nested page is not valid it deletes the wrapper page created above
                    else:
                        page = pages.objects.get(PAGE=page_id)
                        page.delete()
                        return Response(nested_serializer.data, status=status.HTTP_400_BAD_REQUEST)
                    #nested_serializer.save() #DELETE
                return Response(pages_serializer.data, status=status.HTTP_201_CREATED)

            # If the request was badly made or could not be created
            return Response(pages_serializer.data, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST) 

    # @api_view(['PUT'])
    def put(self, request):

        # Takes the page_id from the URL if the url has ?page_id=<id> at the end, no parameter passed return error 400
        PAGE_ID = self.request.query_params.get('page_id')

        # Get all fields from this page_id if it doesn't exist return error 404
        try:
            page = pages.objects.get(PAGE = PAGE_ID)
        except pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # PLEASE DON'T MODIFY THE SCENARIO
        request.data["SCENARIO"] = PagesSerializer(page).data['SCENARIO']

        if request.method == "PUT": 
        
            page_type = page.PAGE_TYPE

            # Check page.PAGE_TYPE = 'REFLECTION'
            if (page_type == 'R'):
                pages_serializer = PagesSerializer(page, data=request.data)
                if pages_serializer.is_valid():
                    pages_serializer.save()
                    
                    # Check that each reflectuon question already exists
                    for question in request.data['REFLECTION_QUESTIONS']:
                        try:
                            reflection_page = reflection_question.objects.get(id = question.get('id'))
                        except:
                            # If the subpage DOES NOT EXIST, then you create that new page and post it and continue to the next component
                            question['PAGE'] = PAGE_ID
                            nested_serializer = Reflection_questionsSerializer(data=question)
                            if nested_serializer.is_valid():
                                nested_serializer.save()
                            else:
                                return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                            continue

                        question['PAGE'] = PAGE_ID
                        nested_serializer = Reflection_questionsSerializer(reflection_page, data=question)
                        if nested_serializer.is_valid():
                            nested_serializer.save()
                        else:
                            return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    return Response(pages_serializer.data, status=status.HTTP_200_OK)
                # Else the request was badly made
                return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Check page.PAGE_TYPE = 'ACTION'
            if (page_type == 'A'):
                pages_serializer = PagesSerializer(page, data=request.data)
                if pages_serializer.is_valid():
                    pages_serializer.save()
                    
                    # Check that each action_page_choices already exists
                    for action in request.data['CHOICES']:
                        try:
                            choices_page = action_page_choices.objects.get(id = action.get('id'))
                        except:
                            # If the subpage DOES NOT EXIST, then you create that new page and post it and continue to the next component
                            action['PAGE'] = PAGE_ID
                            nested_serializer = Action_pageSerializer(data=action)
                            if nested_serializer.is_valid():
                                nested_serializer.save()
                            else:
                                return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                            continue

                        action['PAGE'] = PAGE_ID
                        nested_serializer = Action_pageSerializer(choices_page, data=action)
                        if nested_serializer.is_valid():
                            nested_serializer.save()
                        else:
                            return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    return Response(pages_serializer.data, status=status.HTTP_200_OK)
                # Else the request was badly made
                return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            # Check page.PAGE_TYPE = 'GENERIC'
            if (page_type == 'G' or page_type == 'I'):
                pages_serializer = PagesSerializer(page, data=request.data)
                if pages_serializer.is_valid():
                    pages_serializer.save()
                    return Response(pages_serializer.data, status=status.HTTP_200_OK)
                # Else the request was badly made
                return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Check page.PAGE_TYPE = 'STAKEHOLDERS'
            if (page_type == 'S'):
                pages_serializer = PagesSerializer(page, data=request.data)
                if pages_serializer.is_valid():
                    pages_serializer.save()
                    
                    # Check that each Stakeholder page already exists
                    for stakeholder in request.data['STAKEHOLDERS']:
                        try:
                            page_stakeholder = stakeholder_page.objects.get(id = stakeholder.get('id'))
                        except:
                            # If the subpage DOES NOT EXIST, then you create that new page and post it and continue to the next component
                            stakeholder['PAGE'] = PAGE_ID
                            nested_serializer = Stakeholder_pageSerializer(data=stakeholder)
                            if nested_serializer.is_valid():
                                nested_serializer.save()
                            else:
                                return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                            continue

                        stakeholder['PAGE'] = PAGE_ID
                        nested_serializer = Stakeholder_pageSerializer(page_stakeholder, data=stakeholder)
                        if nested_serializer.is_valid():
                            nested_serializer.save()
                        else:
                            return Response(nested_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    return Response(pages_serializer.data, status=status.HTTP_200_OK)
                # Else the request was badly made
                return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Not a valid type of page
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST) 


    # @api_view(['DELETE'])
    def delete(self, request):

        # Takes the page_id from the URL if the url has ?page_id=<id> at the end, no parameter passed return error 400
        PAGE_ID = self.request.query_params.get('page_id')

        # Check if the page exists.
        try: 
            page = pages.objects.get(PAGE=PAGE_ID)
        except pages.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        
        # Delete the page
        if (request.method == "DELETE"):

            #set next page field of pages pointing to the deleted page to be None/Null
            next_pages = pages.objects.filter(NEXT_PAGE = PAGE_ID)
            for updated_page in next_pages:
                extant_page = updated_page
                updated_page.NEXT_PAGE = None
                updated_page_dict = PagesSerializer(updated_page).data
                pages_serializer = PagesSerializer(extant_page, data=updated_page_dict)
                if pages_serializer.is_valid():
                    pages_serializer.save()
                else:
                    print("error in making next_page = null during delete!")
                    return Response(pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            #also set and result_page fields pointing to the deleted page to be null as well.
            action_pages = action_page_choices.objects.filter(RESULT_PAGE = PAGE_ID)
            for updated_page in action_pages:
                extant_page = updated_page
                updated_page.RESULT_PAGE = None
                updated_page_dict = Action_pageSerializer(updated_page).data
                action_pages_serializer = Action_pageSerializer(extant_page, data=updated_page_dict)
                if action_pages_serializer.is_valid():
                    action_pages_serializer.save()
                else:
                    print("error in making next_page = null during delete!")
                    return Response(action_pages_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Finally delete the page 

            operation = page.delete()
            page_data = {}
            if (operation):
                page_data["success"] = "delete successful"
            else:
                page_data["failure"] = "delete failed"
            
            return Response(data=page_data)


class coverages_page(APIView):
    def put(self, request, *args, **kwargs):
        # """
        # docstring
        # """
        data = JSONParser().parse(request)

        if type(data) == list:
            response = []
            for item in data:
                stkholderid = item['STAKEHOLDER']
                issueid = item['ISSUE']
                updatingItem = coverage.objects.get(
                    STAKEHOLDER=stkholderid, ISSUE=issueid)
                serializer = coverageSerializer(
                    updatingItem, data=item)
                if serializer.is_valid():
                    serializer.save()
                    response.append(serializer.data)
                else:
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)

            return Response(response, status=status.HTTP_200_OK)
        else:
            stkholderid = data['STAKEHOLDER']
            issueid = data['ISSUE']
            updatingItem = coverage.objects.get(
                STAKEHOLDER=stkholderid, ISSUE=issueid)
            serializer = coverageSerializer(
                updatingItem, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IssueCoverage(APIView):
    def post(self, request, *args, **kwargs):
    
        serializer = IssuesSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            issueid = serializer.data['ISSUE']
            scenarioid = serializer.data['SCENARIO']
            queryset = stakeholders.objects.filter(SCENARIO=scenarioid)
            data = StakeholdersSerializer(queryset, many=True).data
            for item in data:
                itemdict = {}
                itemdict['STAKEHOLDER'] = item['STAKEHOLDER']
                itemdict['ISSUE'] = issueid
                itemdict['NAME'] = serializer.data['NAME']
                itemdict['COVERAGE_SCORE'] = 0
                itemdict['SUMMARY'] = "default"
                print(itemdict)
                itemSerializer = coverageSerializer(data=itemdict)
                if itemSerializer.is_valid():
                    itemSerializer.save()
                else:
                    return Response(itemSerializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class stakeholders_page(APIView):
    
    def add_detail(self, stkholders):

        for stkholder in stkholders:
            stakeholder_id = stkholder['STAKEHOLDER']

            queryset = conversations.objects.filter(STAKEHOLDER=stakeholder_id)
            conList = ConversationsSerializer(queryset, many=True).data
            stkholder['CONVERSATIONS'] = conList

            try: 
                coverage_list = coverage.objects.filter(STAKEHOLDER=stakeholder_id).values()
            except coverage.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            issue_list = []
            # Check for every single coverage object that belongs to the staheholder id 'id' 
            for coverages in coverage_list:
                issues_dict = {}
                # issueList = coverageSerializer(coverage.objects.get(ISSUE=issueID)).data
                # issueList.update({"NAME": IssuesSerializer(Issues.objects.get(ISSUE=issueID)).data['NAME']})
                # Getting the issue for the coverage dictionary associated with the stakeholder_id
                try:
                    issue = Issues.objects.get(ISSUE=coverages.get('ISSUE_id'))
                except:
                    continue
                issues_dict.update(coverages)
                del issues_dict['id']
                issues_dict['ISSUE'] = issues_dict['ISSUE_id']
                del issues_dict['ISSUE_id']
                issues_dict['STAKEHOLDER'] = issues_dict['STAKEHOLDER_id']
                del issues_dict['STAKEHOLDER_id']
                issues_dict.update(
                    {
                        "NAME": issue.NAME
                    })

                issue_list.append(issues_dict)
            
            stkholder.update(
                {
                    "ISSUES": issue_list
                }
            )

        return stkholders

        '''
        page_data = PagesSerializer(page).datapage_data.update(
                {
                    "REFLECTION_QUESTIONS": reflection_query
                }
            )
 reflection_query = reflection_question.objects.filter(PAGE = PAGE_ID).values()
            page_data.update(
                {
                    "REFLECTION_QUESTIONS": reflection_query
                }
            )
        '''

    def get(self, request, *args, **kwargs):
        '''
        return format
        [
            {
                "STAKEHOLDER": 3,
                "NAME": "Mon",
                "DESCRIPTION": "This is Mon",
                "JOB": "Driver",
                "INTRODUCTION": "Mon is a driver",
                "SCENARIO": 1,
                "VERSION": 1,
                "CONVERSATIONS": [
                    {
                        "CONVERSATION": 4,
                        "QUESTION": "Question 1",
                        "RESPONSE": "Answer 1",
                        "STAKEHOLDER": 3
                    }
                ],
                "ISSUES": [
                    {
                        "ISSUE": 4,
                        "NAME": "Issue 3",
                        "IMPORTANCE_SCORE": 10.0,
                        "SCENARIO": 1,
                        "VERSION": 1
                    }
                ]
            },
        ]
        parse scenario_id and stakeholder_id from the request URL
        example
        http://127.0.0.1:8000/stakeholders?scenario_id=3
        http://127.0.0.1:8000/stakeholders?stakeholder_id=0
        '''
        SCENARIO_ID = self.request.query_params.get('scenario_id')
        STAKEHOLDER_ID = self.request.query_params.get('stakeholder_id')
        # STAKEHOLDER_ID = self.request.GET.get('stakeholder_id')

        # handle request for scenario_id
        # get all stakeholder in scenario with id = scenario_id
        if SCENARIO_ID != None:
            # checking valid scenario ID
            try:
                # return empty if scenario doesn't have any stakeholder
                # return list of stakeholder belong to that scenario
                scenarios.objects.get(SCENARIO=SCENARIO_ID)
                queryset = stakeholders.objects.filter(
                    SCENARIO=SCENARIO_ID)
                data = list(StakeholdersSerializer(queryset, many=True).data)
                data = self.add_detail(data)
                return Response(data, status=status.HTTP_200_OK)

            # return an error for non-existed scenario id
            except scenarios.DoesNotExist:
                message = {'MESSAGE': 'INVALID SCENARIO ID'}
                return Response(message, status=status.HTTP_404_NOT_FOUND)

        # handle request for stakeholder_id
        # get the stakeholder id = stakeholder_id
        if STAKEHOLDER_ID != None:
            try:
                queryset = stakeholders.objects.filter(
                    STAKEHOLDER=STAKEHOLDER_ID)
                data = list(StakeholdersSerializer(queryset, many=True).data)
                data = self.add_detail(data)
                return Response(data, status=status.HTTP_200_OK)

            except stakeholders.DoesNotExist:
                message = {'MESSAGE': 'INVALID STAKEHOLDER ID'}
                return Response(message, status=status.HTTP_404_NOT_FOUND)

        queryset = stakeholders.objects.all()
        data = StakeholdersSerializer(queryset, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
    
        serializer = StakeholdersSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            stkholderid = serializer.data['STAKEHOLDER']
            scenarioid = serializer.data['SCENARIO']
            queryset = Issues.objects.filter(SCENARIO=scenarioid)
            data = IssuesSerializer(queryset, many=True).data
            for item in data:
                itemdict = {}
                itemdict['STAKEHOLDER'] = stkholderid
                itemdict['ISSUE'] = item['ISSUE']
                itemdict['NAME'] = item['NAME']
                itemdict['COVERAGE_SCORE'] = 0
                itemdict['SUMMARY'] = "default"
                print(itemdict)
                itemSerializer = coverageSerializer(data=itemdict)
                if itemSerializer.is_valid():
                    itemSerializer.save()
                else:
                    return Response(itemSerializer.errors,
                                    status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):

        STAKEHOLDER_ID = self.request.query_params.get('stakeholder_id')

        if STAKEHOLDER_ID != None:
            try:
                response = stakeholders.objects.get(
                    STAKEHOLDER_ID=STAKEHOLDER_ID)
                response.delete()
                return Response({'message': 'DELETED'}, status=status.HTTP_202_ACCEPTED)
            except stakeholders.DoesNotExist:
                return Response({'message': 'NOT FOUND'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'message': 'MISSING ID'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        '''
        put can take one object or a list
        for one object put
        {
            "STAKEHOLDER": 1,
            "NAME": "Stakeholder 1a",
            "DESCRIPTION": "Description 1",
            "JOB": "Job 1",
            "INTRODUCTION": "Introduction 1",
            "SCENARIO": 1,
            "VERSION": 1
        }
        for list put
        [
            {
                "STAKEHOLDER": 1,
                "NAME": "Stakeholder 1a",
                "DESCRIPTION": "Description 1",
                "JOB": "Job 1",
                "INTRODUCTION": "Introduction 1",
                "SCENARIO": 1,
                "VERSION": 1
            },
            {
                "STAKEHOLDER": 2,
                "NAME": "Stakeholder 2a",
                "DESCRIPTION": "Description 2",
                "JOB": "Job 2",
                "INTRODUCTION": "Introduction 2",
                "SCENARIO": 1,
                "VERSION": 1
            }
        ]
        '''
        data = JSONParser().parse(request)

        if type(data) == list:
            response = []
            for item in data:
                id = item['STAKEHOLDER']
                updatingItem = stakeholders.objects.get(STAKEHOLDER=id)
                stkholderSerializer = StakeholdersSerializer(
                    updatingItem, data=item)
                if stkholderSerializer.is_valid():
                    stkholderSerializer.save()
                    response.append(stkholderSerializer.data)
                else:
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)

            return Response(response, status=status.HTTP_200_OK)
        else:
            id = data['STAKEHOLDER']
            updatingItem = stakeholders.objects.get(STAKEHOLDER=id)
            stkholderSerializer = StakeholdersSerializer(
                updatingItem, data=data)
            if stkholderSerializer.is_valid():
                stkholderSerializer.save()
                return Response(stkholderSerializer.data, status=status.HTTP_200_OK)
            else:
                return Response(stkholderSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


class coverages_page(APIView):
    def get(self, request, *args, **kwargs):
        stakeholder_id = self.request.query_params.get('stakeholder_id')

        stkholder = {}
        try: 
            coverage_list = coverage.objects.filter(STAKEHOLDER=stakeholder_id).values()
        except coverage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        issue_list = []
        # Check for every single coverage object that belongs to the staheholder id 'id' 
        for coverages in coverage_list:
            issues_dict = {}
                # issueList = coverageSerializer(coverage.objects.get(ISSUE=issueID)).data
                # issueList.update({"NAME": IssuesSerializer(Issues.objects.get(ISSUE=issueID)).data['NAME']})
                # Getting the issue for the coverage dictionary associated with the stakeholder_id
            try:
                issue = Issues.objects.get(ISSUE=coverages.get('ISSUE_id'))
            except:
                continue
            issues_dict.update(coverages)
            del issues_dict['id']
            issues_dict['ISSUE'] = issues_dict['ISSUE_id']
            del issues_dict['ISSUE_id']
            issues_dict['STAKEHOLDER'] = issues_dict['STAKEHOLDER_id']
            del issues_dict['STAKEHOLDER_id']
            issues_dict.update(
                {
                    "NAME": issue.NAME
                })

            issue_list.append(issues_dict)
            
        stkholder.update(
            {
                "ISSUES": issue_list
            }
        )

        return Response(stkholder, status=status.HTTP_200_OK)

