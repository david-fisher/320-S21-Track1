from rest_framework import serializers
from .models import *

class usersSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'

class coursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = courses
        fields = '__all__'

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
        fields = '__all__'

class session_timesSerializer(serializers.ModelSerializer):
    class Meta:
        model = session_times
        fields = '__all__'

class reflections_takenSerializer(serializers.ModelSerializer):
    class Meta:
        model = reflections_taken
        fields = ('REFLECTIONS', 'RQ_ID', 'SESSION_ID', 'PAGE_ID')

class action_page_choicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = action_page_choices
        fields = ('APC_ID', 'SESSION_ID', 'PAGE_ID', 'DATE_TAKEN')

class conversations_hadSerializer(serializers.ModelSerializer):
    class Meta:
        model = conversations_had
        fields = ('SESSION_ID', 'STAKEHOLDER_ID', 'DATE_TAKEN')