from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'NAME', 'AFFILIATION', 'EMAIL')


class user_accessSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_access
        fields = '__all__'


class ScenariosSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    class Meta:
        model = scenarios
        fields = ('SCENARIO', 'NAME', 'IS_FINISHED', 'PUBLIC', 'user_id', 'DATE_CREATED', 'NUM_CONVERSATION')

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        user = Users.objects.get(pk=user_id.pk)
        scen = scenarios.objects.create(**validated_data)
        scen.user_id = user.pk
        scen.save()
        return scen


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
        model = reflection_question
        fields = "__all__"


class StakeholdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = stakeholders
        fields = '__all__'
    
class ConversationsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = conversations
        fields = ('STAKEHOLDER', 'CONVERSATION', 'QUESTION', 'RESPONSE')




class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = courses
        fields = ('COURSE', 'NAME')


class allScenariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = scenarios
        fields = ('SCENARIO', 'NAME', 'IS_FINISHED', 'user')

class Scenarios_forSerializer(serializers.ModelSerializer):
    class Meta:
        model = scenarios_for
        fields = ('SCENARIO', 'COURSE', 'VERSION')

class VersionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Versions
        fields = '__all__'

class Professors_teachSerializer(serializers.ModelSerializer):
    class Meta:
        model = professors_teach
        fields = ('USER_ID', 'COURSE')

class IssuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issues
        fields = '__all__'

class Action_pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = action_page_choices
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

class Pages_stakeholderSerializer(serializers.ModelSerializer):
    stakeholder_page = Stakeholder_pageSerializer()
    class Meta:
        model = pages
        fields = '__all__'

class coverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = coverage
        fields = ('STAKEHOLDER', 'ISSUE', 'COVERAGE_SCORE', 'SUMMARY')

class SuperStakeholdersSerializer(serializers.ModelSerializer):
    coverages = coverageSerializer(many=True, read_only=True)
    conversations = ConversationsSerializer(many=True, read_only=True)
    class Meta:
        model = stakeholders
        fields = '__all__'

class SuperScenariosForSerializer(serializers.ModelSerializer):
    COURSE = CoursesSerializer(read_only=True)

    class Meta:
        model = scenarios_for
        fields = ('SCENARIO', 'COURSE', 'VERSION')

class SuperPagesSerializer(serializers.ModelSerializer):
    reflection_questions = Reflection_questionsSerializer(many=True, read_only=True)
    action_page_choices = Action_pageSerializer(many=True, read_only=True)
    class Meta:
        model = pages
        fields = ('PAGE', 'PAGE_TYPE', 'PAGE_TITLE', 'PAGE_BODY', 
        'SCENARIO', 'VERSION', 'NEXT_PAGE', 'X_COORDINATE', 'Y_COORDINATE', "reflection_questions"
        , "action_page_choices")


class SuperScenariosSerialializer(serializers.ModelSerializer):
    user_id = UserSerializer
    pages = SuperPagesSerializer(many=True, read_only=True)
    stakeholders = SuperStakeholdersSerializer(many=True, read_only=True)
    issues = IssuesSerializer(many=True, read_only=True)
    scenarios_for = SuperScenariosForSerializer(many=True, read_only=True)

    class Meta:
        model = scenarios
        fields = ("pages", "user_id", "SCENARIO", "NAME", 
        "IS_FINISHED", "PUBLIC", "DATE_CREATED", "stakeholders", "issues", "scenarios_for")

class course_invitationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_invitations
        fields = '__all__'

class takesSerializer(serializers.ModelSerializer):
    class Meta:
        model = takes
        fields = '__all__'

class course_assignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = course_assignment
        fields = '__all__'

class sessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = sessions
        fields = ('SESSION_ID', 'USER_ID', 'SCENARIO_ID', 'DATE_STARTED', 'DATE_FINISHED', 'IS_FINISHED', 'MOST_RECENT_ACCESS')

class session_timesSerializer(serializers.ModelSerializer):
    class Meta:
        model = session_times
        fields = ('MOST_RECENT_ACCESS', 'START_TIME', 'END_TIME', 'SESSION_ID', 'PAGE_ID')

class reflections_takenSerializer(serializers.ModelSerializer):
    class Meta:
        model = reflections_taken
        fields = ('REFLECTIONS', 'RQ_ID', 'SESSION_ID', 'PAGE_ID')

class action_page_responsesSerializer(serializers.ModelSerializer):
    class Meta:
        model = action_page_responses
        fields = ('APC_ID', 'SESSION_ID', 'PAGE_ID', 'DATE_TAKEN')

class conversations_hadSerializer(serializers.ModelSerializer):
    class Meta:
        model = conversations_had
        fields = ('SESSION_ID', 'STAKEHOLDER_ID', 'DATE_TAKEN')