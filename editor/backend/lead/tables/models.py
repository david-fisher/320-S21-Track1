from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class scenarios(models.Model):
    SCENARIO = models.AutoField(primary_key = True, editable=False)
    user = models.ForeignKey('users', to_field = 'user_id', on_delete =models.CASCADE, related_name="scenario_creator2", null=True, db_column="USER_ID")
    NAME = models.CharField(max_length = 1000)
    PUBLIC = models.BooleanField(default = False)
    IS_FINISHED = models.BooleanField(default = False)
    DATE_CREATED = models.DateField(auto_now_add=True)
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
    SCENARIO = models.ForeignKey('scenarios', on_delete = models.CASCADE, related_name="pages1")
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, null=True)
    NEXT_PAGE = models.ForeignKey('self', null=True, on_delete=models.DO_NOTHING)
    X_COORDINATE = models.IntegerField()
    Y_COORDINATE = models.IntegerField()



class reflection_question(models.Model):
    class Meta:
        unique_together = (('PAGE'), ('REFLECTION_QUESTION'))
    PAGE = models.ForeignKey('pages', on_delete = models.CASCADE, related_name="reflection_questions1")
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
    SCENARIO = models.ForeignKey('scenarios', to_field = 'SCENARIO', on_delete = models.CASCADE, related_name="stakeholders20", default = 1)
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
    STAKEHOLDER = models.ForeignKey('stakeholders', on_delete = models.CASCADE, related_name="conversations1")
    CONVERSATION = models.AutoField(default = None, primary_key = True)
    QUESTION = models.TextField(default = "default")
    RESPONSE = models.TextField(default = "default")
    SCENARIO_ID = models.ForeignKey('scenarios', to_field = 'SCENARIO', on_delete = models.CASCADE, related_name="stakeholders2", null=True, db_column="SCENARIO_ID")




class courses(models.Model):
    COURSE = models.IntegerField(default=None, primary_key = True)
    NAME = models.CharField(max_length = 1000)


class professors_teach(models.Model):   
    USER_ID = models.ForeignKey('users', to_field = 'user_id', on_delete = models.CASCADE, related_name="professors_teach1", null=True)
    COURSE = models.ForeignKey(courses, to_field = 'COURSE', on_delete = models.CASCADE, related_name="professors_teach2")


class UserTypes(models.Model):
    user_type_id = models.AutoField(db_column='USER_TYPE_ID', primary_key=True)  # Field name made lowercase.
    name = models.TextField(db_column='NAME', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'user_types'


class Users(models.Model):
    user_id = models.AutoField(db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    user_type = models.ForeignKey(UserTypes, models.DO_NOTHING, db_column='USER_TYPE_ID', blank=True, null=True)  # Field name made lowercase.
    access_level = models.IntegerField(db_column='ACCESS_LEVEL', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'users'


class Issues(models.Model):
    class Meta:
        unique_together = (('SCENARIO'),('ISSUE'),('VERSION'))
    SCENARIO = models.ForeignKey('scenarios', on_delete = models.CASCADE, related_name = "scenario_id5", null = True)
    ISSUE = models.AutoField(primary_key = True, editable = False)
    VERSION = models.ForeignKey('versions', on_delete=models.CASCADE, db_column="VERSION_ID", null=True)
    NAME = models.CharField(max_length = 1000)
    IMPORTANCE_SCORE = models.IntegerField(validators = [MinValueValidator(1), MaxValueValidator(5)])


class coverage(models.Model):
    class Meta:
        unique_together = (('STAKEHOLDER'),('ISSUE'))
    STAKEHOLDER = models.ForeignKey('stakeholders', on_delete = models.CASCADE, related_name = "coverage2", null = True)
    ISSUE = models.ForeignKey('Issues', on_delete = models.CASCADE, related_name = "coverage1", null = True)
    # VERSION_ID = models.ForeignKey('stakeholders',on_delete = models.CASCADE, related_name = "coverage3", default = None)
    COVERAGE_SCORE = models.FloatField(validators = [MinValueValidator(0.0)])


class action_page_choices(models.Model):
    class Meta:
        unique_together = (('PAGE'),('CHOICE'))
    PAGE = models.ForeignKey('pages',on_delete = models.CASCADE, related_name = 'action_page1')
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