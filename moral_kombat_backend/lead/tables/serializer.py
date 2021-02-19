from rest_framework import serializers
from .models import *
# demographics, students, professors, scenarios, stakeholder_page, stakeholders, conversations

class DemographicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = demographics
        fields = ('STUDENT', 'AGE', 'GRADE', 'GENDER', 'RACE', 'MAJOR')


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = students
        fields = ('STUDENT', 'NAME')

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = professors
        fields = ('PROFESSOR', 'NAME')


class ScenariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = scenarios
        fields = ('SCENARIO', 'VERSION', 'NAME', 'IS_FINISHED', 'PUBLIC', 'NUM_CONVERSATION', 'PROFESSOR')

class PagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = pages
        fields = ('PAGE', 'PAGE_TYPE', 'PAGE_TITLE', 'PAGE_BODY', 'SCENARIO', 'VERSION', 'NEXT_PAGE', 'X_COORDINATE', 'Y_COORDINATE')

class Stakeholder_pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = stakeholder_page
        fields = ('PAGE', 'STAKEHOLDER')

class Reflection_questionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = reflection_questions
        fields = ('PAGE', 'REFLECTION_QUESTION')


class StakeholdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = stakeholders
        fields = '__all__'
    
class ConversationsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = conversations
        fields = ('STAKEHOLDER', 'CONVERSATION', 'QUESTION', 'RESPONSE')

class ReflectionsTakenSerializer(serializers.ModelSerializer):
    class Meta:
        model = reflections_taken
        fields = '__all__'



class ConversationsHadSerializer(serializers.ModelSerializer):
    class Meta:
        model = conversations_had
        fields = '__all__'


class StudentsInSerializer(serializers.ModelSerializer):
    class Meta:
        model = students_in
        fields = ('STUDENT', 'COURSE')


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = courses
        fields = ('COURSE', 'NAME')


class ResponsesSerializer(serializers.ModelSerializer):
    class Meta:
        model = responses
        fields = '__all__'


class allScenariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = scenarios
        fields = ('SCENARIO', 'NAME', 'IS_FINISHED', 'PROFESSOR')

class Scenarios_forSerializer(serializers.ModelSerializer):
    class Meta:
        model = scenarios_for
        fields = ('SCENARIO', 'COURSE', 'VERSION')

class Generic_pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = generic_page
        fields = ('PAGE', 'BODY')

class Professors_teachSerializer(serializers.ModelSerializer):
    class Meta:
        model = professors_teach
        fields = ('PROFESSOR', 'COURSE')

class IssuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issues
        fields = '__all__'

class Action_pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = action_page
        fields = '__all__'


# Serializers for page types
class Pages_reflectionSerializer(serializers.ModelSerializer):
    reflection_question = Reflection_questionsSerializer()
    class Meta:
        model = pages
        fields = '__all__'

class Pages_actionSerializer(serializers.ModelSerializer):
    action_page = Action_pageSerializer()
    class Meta:
        model = pages
        fields = '__all__'

class Pages_genericSerializer(serializers.ModelSerializer):
    generic_page = Generic_pageSerializer()
    class Meta:
        model = pages
        fields = '__all__'

class Pages_stakeholderSerializer(serializers.ModelSerializer):
    stakeholder_page = Stakeholder_pageSerializer()
    class Meta:
        model = pages
        fields = '__all__'

class coverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = coverage
        fields = ('STAKEHOLDER', 'ISSUE', 'COVERAGE_SCORE')

class Actions_takenSerializer(serializers.ModelSerializer):
    class Meta:
        model = actions_taken
        fields = '__all__'
