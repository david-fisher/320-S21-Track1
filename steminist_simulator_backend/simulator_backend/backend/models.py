from django.db import models
from django.db.models.deletion import CASCADE

# Create your models here.
class UserTypes(models.Model):
    user_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False)

class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(blank=False)
    firstname = models.CharField(blank=False, max_length=100)
    lastname = models.CharField(blank=False, max_length=100)
    date_joined = models.DateField()
    user_type_id = models.ForeignKey(UserTypes, on_delete=CASCADE)
    editor = models.BooleanField()

class Courses(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, max_length=100)

class StudentsIn(models.Model):
    user_id = models.ForeignKey(Users, on_delete=CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=CASCADE)

class Majors(models.Model):
    major_id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, max_length=200)

class ProfessorTeach(models.Model):
    user_id = models.AutoField(primary_key=True)
    course_id = models.ForeignKey(Courses, on_delete=CASCADE)

class Scenarios(models.Model):
    scenario_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField() # not sure what this is for
    public = models.BooleanField()
    is_finished = models.BooleanField()
    date_created = models.DateField()

class Pages(models.Model):
    page_id = models.AutoField(primary_key=True)
    page_type = models.CharField(blank=False, max_length=200)
    page_title = models.CharField(blank=False, max_length=200)
    version_id = models.IntegerField()
    body = models.TextField()
    next_page = models.IntegerField() # references the next page
    x_coordinate = models.IntegerField()
    y_coordinate = models.IntegerField()

class Versions(models.Model):
    version_id = models.AutoField(primary_key=True)
    scenario_id = models.ForeignKey(Scenarios, on_delete=CASCADE)
    name = models.CharField(blank=False, max_length=500)
    num_conversation = models.IntegerField()
    first_page = models.ForeignKey(Pages, on_delete=CASCADE)

class Responses(models.Model):
    response_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(Users, on_delete=CASCADE)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    choice = models.TextField()

class AssignedTo(models.Model):
    user_id = models.ForeignKey(Users, on_delete=CASCADE)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)

class ScenariosFor(models.Model):
    scenario_id = models.ForeignKey(Scenarios, on_delete=CASCADE)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=CASCADE)

class Stakeholders(models.Model):
    stakeholder_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    name = models.CharField(blank=False, max_length=100)
    description = models.TextField()
    job = models.CharField(blank=False, max_length=100)
    introduction = models.TextField()

class ConversationsHad(models.Model):
    # Cannot seem to reference a particular column, can only reference a model
    # user_id = models.ForeignKey(Responses.user_id, on_delete=CASCADE)
    user_id = models.IntegerField()
    # course_id = models.ForeignKey(Responses.course_id, on_delete=CASCADE)
    course_id = models.IntegerField()
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    stakeholder_id = models.ForeignKey(Stakeholders, on_delete=CASCADE)
    score = models.FloatField() # coverage score of a student's response
    conversation_id = models.IntegerField()

class Conversations(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    scenario_id = models.IntegerField()
    stakeholder_id = models.ForeignKey(Stakeholders, on_delete=CASCADE)
    question = models.TextField()
    response_id = models.TextField()

class ReflectionQuestions(models.Model):
    reflection_question_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    reflection_question = models.TextField()

class GenericPage(models.Model):
    generic_page_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    body = models.TextField()

class ActionPage(models.Model):
    action_page_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    choice = models.TextField()
    result_page = models.IntegerField()

class ActionsTaken(models.Model):
    # response_id = models.ForeignKey(Responses.response_id, on_delete=CASCADE)
    response_id = models.IntegerField()
    action_page = models.ForeignKey(ActionPage, on_delete=CASCADE) 

class Issues(models.Model):
    issue_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    name = models.TextField()
    importance_score = models.IntegerField()

class StakeholderPage(models.Model):
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    stakeholder_id = models.ForeignKey(Stakeholders, on_delete=CASCADE)

class Coverage(models.Model):
    stakeholder_id = models.ForeignKey(Stakeholders, on_delete=CASCADE)
    issue_id = models.ForeignKey(Issues, on_delete=CASCADE)
    coverage_score = models.FloatField()

class ReflectionsTaken(models.Model):
    reflections = models.CharField(max_length=100)
    user_id = models.ForeignKey(Users, on_delete=CASCADE)
    course_id = models.ForeignKey(Courses, on_delete=CASCADE)
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)

class StudentTimes(models.Model):
    user_id = models.ForeignKey(Users, on_delete=CASCADE)
    course_id = models.IntegerField()
    version_id = models.ForeignKey(Versions, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    page_id = models.ForeignKey(Pages, on_delete=CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()