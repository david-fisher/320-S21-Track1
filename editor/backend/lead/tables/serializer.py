from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class UserTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypes
        fields = '__all__'

class ScenariosSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    class Meta:
        model = scenarios
        fields = ('SCENARIO', 'NAME', 'IS_FINISHED', 'PUBLIC', 'user_id', 'DATE_CREATED')

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
        fields = ('PAGE', 'REFLECTION_QUESTION')


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
        fields = ('STAKEHOLDER', 'ISSUE', 'COVERAGE_SCORE')

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
    stakeholders = StakeholdersSerializer(many=True, read_only=True)
    conversations = ConversationsSerializer(many=True, read_only=True)
    issues = IssuesSerializer(many=True, read_only=True)
    coverages = coverageSerializer(many=True, read_only=True)
    scenarios_for = SuperScenariosForSerializer(many=True, read_only=True)

    class Meta:
        model = scenarios
        fields = ("pages", "user_id", "SCENARIO", "NAME", 
        "IS_FINISHED", "PUBLIC", "DATE_CREATED", "stakeholders", "conversations", "issues", "coverages", "scenarios_for")
