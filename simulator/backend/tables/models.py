from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey, OneToOneField

# Create your models here.

class users(models.Model):
    USER_ID = models.CharField(primary_key= True, max_length = 50)
    NAME = models.CharField(max_length = 100)
    AFFILIATION = models.CharField(max_length = 50)
    EMAIL = models.EmailField()

class courses(models.Model):
    COURSE_ID = models.IntegerField()
    NAME = models.TextField()

class course_invitations(models.Model):
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)
    ACCESS_KEY = models.IntegerField()

class takes(models.Model):
    USER_ID = models.ForeignKey(users, on_delete=CASCADE)
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)


class course_assignment(models.Model):
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)
    SCENARIO_ID = models.IntegerField()

class sessions(models.Model):
    SESSION_ID = models.AutoField(primary_key=True)
    USER_ID = models.ForeignKey(users, on_delete=CASCADE)
    SCENARIO_ID = models.IntegerField()
    DATE_STARTED = models.DateTimeField(auto_now_add=True)
    DATE_FINISHED = models.DateTimeField(auto_now =True, null= True)
    IS_FINISHED = models.BooleanField(default=False)
    MOST_RECENT_ACCESS = models.DateTimeField(null=True, auto_now =True)

class session_times(models.Model):
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    DATE_TAKEN = models.DateTimeField()
    PAGE_ID = models.IntegerField()
    START_TIME = models.DateTimeField(auto_now_add=True)
    END_TIME = models.DateTimeField(auto_now =True, null= True)


class reflections_taken(models.Model):
    REFLECTIONS = models.TextField()
    RQ_ID = models.IntegerField()
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    PAGE_ID = models.IntegerField()
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)

class action_page_choices(models.Model):
    APC_ID = models.IntegerField()
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    PAGE_ID = models.IntegerField()
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)

class conversations_had(models.Model):
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)
    STAKEHOLDER_ID = models.IntegerField()
