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
        fields = ('PAGE', 'PAGE_TYPE', 'PAGE_TITLE', 'SCENARIO', 'VERSION', 'NEXT_PAGE', 'X_COORDINATE',
    'Y_COORDINATE')

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
        fields = ('STAKEHOLDER', 'NAME', 'DESCRIPTION', 'INTRODUCTION', 'SCENARIO', 'VERSION', 'JOB')
    
class ConversationsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = conversations
        fields = ('STAKEHOLDER', 'CONVERSATION', 'QUESTION', 'RESPONSE')

class ReflectionsTakenSerializer(serializers.ModelSerializer):
    class Meta:
        model = reflections_taken
        fields = ('REFLECTIONS', 'STUDENT', 'COURSE', 'E', 'DATE')


class ConversationsHadSerializer(serializers.ModelSerializer):
    class Meta:
        model = conversations_had
        fields = ('STUDENT', 'COURSE', 'E', 'DATE',
                  'STAKEHOLDER', 'SCORE', 'QUESTION')


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
        fields = ('STUDENT', 'E', 'V', 'COURSE', 'DATE', 'CHOICE')


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
        fields = ('SCENARIO', 'ISSUE', 'VERSION', 'NAME', 'IMPORTANCE_SCORE')

class Action_pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = action_page
        fields = ('id', 'PAGE', 'CHOICE', 'RESULT_PAGE')

class coverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = coverage
        fields = ('STAKEHOLDER_ID', 'ISSUE_ID', 'VERSION_ID', 'COVERAGE_SCORE')

