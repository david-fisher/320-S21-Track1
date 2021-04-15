from django.db import models
from django.db.models.deletion import CASCADE


# Create your models here.
class UserType(models.Model):
    user_type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False)

    class Meta:
        db_table = "user_type"

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(blank=False)
    firstname = models.CharField(blank=False, max_length=100)
    lastname = models.CharField(blank=False, max_length=100)
    date_joined = models.DateField()
    user_type_id = models.ForeignKey(UserType, on_delete=CASCADE)
    editor = models.BooleanField()

    class Meta:
        db_table = "user"

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = "course"

class StudentsIn(models.Model):
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)

    class Meta:
        db_table = "students_in"

class Major(models.Model):
    major_id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, max_length=200)

    class Meta:
        db_table = "major"

class ProfessorTeach(models.Model):
    user_id = models.AutoField(primary_key=True)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)

    class Meta:
        db_table = "professor_teach"
    
class Scenario(models.Model):
    scenario_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField() # not sure what this is for
    name = models.CharField(max_length=100, blank=False)
    public = models.BooleanField()
    is_finished = models.BooleanField()
    date_created = models.DateField()

    class Meta:
        db_table = "scenario"
    
class Page(models.Model):
    page_id = models.AutoField(primary_key=True)
    page_type = models.CharField(blank=False, max_length=200)
    page_title = models.CharField(blank=False, max_length=200)
    version_id = models.IntegerField()
    body = models.TextField()
    next_page = models.IntegerField() # references the next page
    x_coordinate = models.IntegerField()
    y_coordinate = models.IntegerField()

    class Meta:
        db_table = "page"

class Version(models.Model):
    version_id = models.AutoField(primary_key=True)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    name = models.CharField(blank=False, max_length=500)
    num_conversation = models.IntegerField()
    first_page = models.ForeignKey(Page, on_delete=CASCADE)

    class Meta:
        db_table = "version"

class Response(models.Model):
    response_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    choice = models.TextField()

    class Meta:
        db_table = "response"

class AssignedTo(models.Model):
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    
    class Meta:
        db_table = "assigned_to"

class ScenariosFor(models.Model):
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)

    class Meta:
        db_table = "scenarios_for"

class Stakeholder(models.Model):
    stakeholder_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    name = models.CharField(blank=False, max_length=100)
    description = models.TextField()
    job = models.CharField(blank=False, max_length=100)
    introduction = models.TextField()

    class Meta:
        db_table = "stakeholder"

class ConversationsHad(models.Model):
    # Cannot seem to reference a particular column, can only reference a model
    # user_id = models.ForeignKey(Responses.user_id, on_delete=CASCADE)
    user_id = models.IntegerField()
    # course_id = models.ForeignKey(Responses.course_id, on_delete=CASCADE)
    course_id = models.IntegerField()
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)
    score = models.FloatField() # coverage score of a student's response
    conversation_id = models.IntegerField()

    class Meta:
        db_table = "conversations_had"

class Conversation(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    scenario_id = models.IntegerField()
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)
    question = models.TextField()
    response_id = models.TextField()

    class Meta:
        db_table = "conversation"

class ReflectionQuestion(models.Model):
    reflection_question_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    reflection_question = models.TextField()

    class Meta:
        db_table = "reflection_question"

class GenericPage(models.Model):
    generic_page_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    body = models.TextField()

    class Meta:
        db_table = "generic_page"

class ActionPage(models.Model):
    action_page_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    choice = models.TextField()
    result_page = models.IntegerField()

    class Meta:
        db_table = "action_page"

class ActionsTaken(models.Model):
    # response_id = models.ForeignKey(Responses.response_id, on_delete=CASCADE)
    response_id = models.IntegerField()
    action_page = models.ForeignKey(ActionPage, on_delete=CASCADE) 

    class Meta:
        db_table = "actions_taken"

class Issue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    name = models.TextField()
    importance_score = models.IntegerField()

    class Meta:
        db_table = "issue"

class StakeholderPage(models.Model):
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)

    class Meta:
        db_table = "stakeholder_page"

class Coverage(models.Model):
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)
    issue_id = models.ForeignKey(Issue, on_delete=CASCADE)
    coverage_score = models.FloatField()

    class Meta:
        db_table = "coverage"

class ReflectionsTaken(models.Model):
    reflections = models.CharField(max_length=100)
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    page_id = models.ForeignKey(Page, on_delete=CASCADE)

    class Meta:
        db_table = "reflections_taken"

class StudentTime(models.Model):
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    course_id = models.IntegerField()
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        db_table = "student_time"