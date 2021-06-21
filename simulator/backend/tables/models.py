from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey, OneToOneField
# Create your models here.

class scenarios(models.Model):
    SCENARIO = models.AutoField(primary_key = True, editable=False)
    user = models.ForeignKey('Users', on_delete =models.CASCADE, related_name="scenario_creator2", null=True, db_column="USER_ID", default="phaas")
    NAME = models.CharField(max_length = 1000)
    PUBLIC = models.BooleanField(default = False)
    IS_FINISHED = models.BooleanField(default = False)
    DATE_CREATED = models.DateField(auto_now_add=True)
    NUM_CONVERSATION = models.IntegerField(db_column='NUM_CONVERSATION', blank=True, null=True)  # Field name made lowercase.
    # models.OneToOneField('pages', on_delete = models.CASCADE, related_name = "scenarios1", default = 1)
    # def __str__(self):
    #     return "%s the scenario" % self.name


class pages(models.Model):
    class Meta:
        unique_together = (('PAGE'), ('SCENARIO'))
    PAGE = models.AutoField(primary_key = True, editable=False)
    PAGE_CHOICES = (
        ('I', 'INTRO'),
        ('G', 'GENERIC'),
        ('R', 'REFLECTION'),
        ('S', 'STAKEHOLDER'),
        ('A', 'ACTION'),
    )
    PAGE_TYPE = models.CharField(max_length = 2, choices = PAGE_CHOICES)
    PAGE_TITLE = models.CharField(max_length = 1000)
    PAGE_BODY = models.TextField()
    SCENARIO = models.ForeignKey('scenarios', on_delete = models.CASCADE, related_name="pages")
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, null=True)
    NEXT_PAGE = models.ForeignKey('self', null=True, on_delete=models.DO_NOTHING)
    X_COORDINATE = models.IntegerField()
    Y_COORDINATE = models.IntegerField()



class reflection_question(models.Model):
    class Meta:
        unique_together = (('PAGE'), ('REFLECTION_QUESTION'))
    PAGE = models.ForeignKey('pages', on_delete = models.CASCADE, related_name="reflection_questions")
    REFLECTION_QUESTION = models.TextField()
    RQ_ID = models.AutoField(primary_key=True, db_column="RQ_ID")
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, db_column="VERSION_ID", null=True)


class stakeholder_page(models.Model):
    class Meta:
        unique_together = (('PAGE'), ('STAKEHOLDER'))
    PAGE = models.ForeignKey('pages', on_delete = models.CASCADE, related_name="stakeholder_page1")
    STAKEHOLDER = models.ForeignKey('stakeholders', on_delete = models.CASCADE, related_name="stakeholder_page2")


class stakeholders(models.Model):
    class Meta:
        unique_together = (('STAKEHOLDER'), ('VERSION'))
    STAKEHOLDER = models.AutoField(primary_key = True, editable = False)
    SCENARIO = models.ForeignKey('scenarios', to_field = 'SCENARIO', on_delete = models.CASCADE, related_name="stakeholders", default = 1)
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, db_column="VERSION_ID", null=True)
    NAME = models.CharField(max_length = 1000, default = "default")
    DESCRIPTION = models.TextField(default = "default")
    JOB = models.TextField(default = "default")
    # MATRIX = ArrayField(ArrayField(models.IntegerField(), size = 15), size = 15)
    INTRODUCTION = models.TextField(default = 'default')
    PHOTO = models.ImageField(upload_to="stakeholder_images/", null=True)


class conversations(models.Model):
    class Meta:
        unique_together = (('STAKEHOLDER'), ('CONVERSATION'))
    STAKEHOLDER = models.ForeignKey('stakeholders', on_delete = models.CASCADE, related_name="conversations")
    CONVERSATION = models.AutoField(default = None, primary_key = True)
    QUESTION = models.TextField(default = "default")
    RESPONSE = models.TextField(default = "default")
    SCENARIO_ID = models.ForeignKey('scenarios', to_field = 'SCENARIO', on_delete = models.CASCADE, related_name="stakeholders2", null=True, db_column="SCENARIO_ID")


class courses(models.Model):
    COURSE = models.CharField(default=None, primary_key = True, max_length=10)
    NAME = models.CharField(max_length = 1000)


class scenarios_for(models.Model):
    class Meta:
        unique_together = (('SCENARIO'), ('COURSE'), ('VERSION'))
    SCENARIO = models.ForeignKey(scenarios, on_delete = models.CASCADE, related_name='scenarios_for')
    COURSE = models.ForeignKey('courses', on_delete = models.CASCADE, related_name='courses')
    VERSION = models.IntegerField(default=1, editable=False, null=True)


class professors_teach(models.Model):   
    USER_ID = models.ForeignKey('Users', on_delete = models.CASCADE, related_name="professors_teach1", null=True)
    COURSE = models.ForeignKey(courses, to_field = 'COURSE', on_delete = models.CASCADE, related_name="professors_teach2")


class Users(models.Model):
    user_id = models.CharField(db_column='USER_ID', primary_key=True, default = "phaas", max_length=50)
    NAME = models.CharField(max_length = 100, default="Peter Haas")
    AFFILIATION = models.CharField(max_length = 50, default="Professor")
    EMAIL = models.EmailField(default = "phaas@cs.umass.edu")

class user_access(models.Model):
    class Meta:
        unique_together = (('USER_ID'), ('SCENARIO_ID'))
    USER_ID = models.ForeignKey('Users', on_delete = models.CASCADE, related_name="user_access1", null=True)
    ACCESS_LEVEL = models.IntegerField()
    SCENARIO_ID = models.ForeignKey('scenarios', on_delete = models.CASCADE, related_name = "user_access1", null = True)


class Issues(models.Model):
    class Meta:
        unique_together = (('SCENARIO'),('ISSUE'),('VERSION'))
    SCENARIO = models.ForeignKey('scenarios', on_delete = models.CASCADE, related_name = "issues", null = True)
    ISSUE = models.AutoField(primary_key = True, editable = False)
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, db_column="VERSION_ID", null=True)
    NAME = models.CharField(max_length = 1000)
    IMPORTANCE_SCORE = models.IntegerField(validators = [MinValueValidator(1), MaxValueValidator(5)])


class coverage(models.Model):
    class Meta:
        unique_together = (('STAKEHOLDER'),('ISSUE'))
    STAKEHOLDER = models.ForeignKey('stakeholders', on_delete = models.CASCADE, related_name = "coverages", null = True)
    ISSUE = models.ForeignKey('Issues', on_delete = models.CASCADE, related_name = "coverage1", null = True)
    # VERSION_ID = models.ForeignKey('stakeholders',on_delete = models.CASCADE, related_name = "coverage3", default = None)
    COVERAGE_SCORE = models.FloatField(validators = [MinValueValidator(0.0)])
    SUMMARY = models.TextField(null = True, default = "", blank = True)


class action_page_choices(models.Model):
    class Meta:
        unique_together = (('PAGE'),('CHOICE'))
    PAGE = models.ForeignKey('pages',on_delete = models.CASCADE, related_name = 'action_page_choices')
    CHOICE = models.TextField()
    RESULT_PAGE = models.ForeignKey('pages',on_delete = models.CASCADE, related_name = 'action_page2', db_column="RESULT_PAGE", null=True)
    APC_ID = models.AutoField(db_column="APC_ID", primary_key=True)


class Versions(models.Model):
    version_id = models.AutoField(db_column='VERSION_ID', primary_key=True, editable=False)  # Field name made lowercase.
    scenario = models.ForeignKey('scenarios', models.CASCADE, db_column='SCENARIO_ID', blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    num_conversation = models.IntegerField(db_column='NUM_CONVERSATION', blank=True, null=True)  # Field name made lowercase.
    first_page = models.ForeignKey('pages', models.DO_NOTHING, db_column='FIRST_PAGE', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'versions'

class course_invitations(models.Model):
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)
    ACCESS_KEY = models.IntegerField()

class takes(models.Model):
    class Meta:
        unique_together = (('USER_ID'),('COURSE_ID'))
    USER_ID = models.ForeignKey(Users, on_delete=CASCADE)
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)


class course_assignment(models.Model):
    COURSE_ID = models.ForeignKey(courses, on_delete=CASCADE)
    SCENARIO_ID = models.IntegerField()

class sessions(models.Model):
    SESSION_ID = models.AutoField(primary_key=True)
    USER_ID = models.ForeignKey(Users, on_delete=CASCADE)
    SCENARIO_ID = models.ForeignKey('scenarios', models.CASCADE, db_column='SCENARIO_ID')
    DATE_STARTED = models.DateTimeField()
    DATE_FINISHED = models.DateTimeField(null=True)
    IS_FINISHED = models.BooleanField(default=False)
    MOST_RECENT_ACCESS = models.DateTimeField()

class session_times(models.Model):
    class Meta:
        unique_together = (('SESSION_ID'),('PAGE_ID'))
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    MOST_RECENT_ACCESS = models.DateTimeField(null=True)
    PAGE_ID = models.ForeignKey('pages', on_delete=CASCADE)
    START_TIME = models.DateTimeField()
    END_TIME = models.DateTimeField(null=True)


class reflections_taken(models.Model):
    class Meta:
        unique_together = (('SESSION_ID'),('RQ_ID'))
    REFLECTIONS = models.TextField()
    RQ_ID = models.ForeignKey(reflection_question, on_delete=CASCADE)
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    PAGE_ID = models.ForeignKey('pages', on_delete=CASCADE)
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)

class action_page_responses(models.Model):
    class Meta:
        unique_together = (('SESSION_ID'),('APC_ID'))
    APC_ID = models.ForeignKey(action_page_choices, on_delete=CASCADE)
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    PAGE_ID = models.ForeignKey('pages', on_delete=CASCADE)
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)

class conversations_had(models.Model):
    class Meta:
        unique_together = (('SESSION_ID'),('STAKEHOLDER_ID'))
    SESSION_ID = models.ForeignKey(sessions, on_delete=CASCADE)
    DATE_TAKEN = models.DateTimeField(auto_now_add=True)
    STAKEHOLDER_ID = models.ForeignKey('stakeholders', on_delete = models.CASCADE, db_column="STAKEHOLDER")