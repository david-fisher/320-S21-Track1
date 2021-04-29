from django.db import models
from django.db.models.aggregates import Max
from django.db.models.deletion import CASCADE
from django.db.models.fields.related import ForeignKey, OneToOneField

# Create your models here.

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        db_table = "courses"

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_type_id = models.IntegerField() # no idea what this is for
    access_level = models.IntegerField()

    class Meta:
        db_table = "users"

class Takes(models.Model):
    user_id = models.ForeignKey(User, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)

    class Meta:
        db_table = "takes"
    
class Scenario(models.Model):
    scenario_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    public = models.BooleanField()
    is_finished = models.BooleanField()
    date_created = models.DateField()

    class Meta:
        db_table = "scenarios"

class CourseAssignment(models.Model):
    course_id = models.ForeignKey(Course, on_delete=CASCADE)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)

    class Meta:
        db_table = "course_assignment"

class Page(models.Model):
    page_id = models.AutoField(primary_key=True)
    page_type = models.CharField(blank=False, max_length=200)
    page_title = models.CharField(blank=False, max_length=200)
    version_id = models.IntegerField()
    body = models.TextField()
    next_page = models.IntegerField()  # references the next page
    x_coordinate = models.IntegerField()
    y_coordinate = models.IntegerField()

    class Meta:
        db_table = "pages"

class Version(models.Model):
    version_id = models.AutoField(primary_key=True)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    name = models.CharField(blank=False, max_length=500)
    num_conversation = models.IntegerField()
    first_page = models.ForeignKey(Page, on_delete=CASCADE)

    class Meta:
        db_table = "versions"

class Change(models.Model):
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    asset_changed = models.CharField(max_length=1000)
    new_content = models.TextField()
    forked_from = models.IntegerField()

    class Meta:
        db_table = "changes"

class Session(models.Model):
    session_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    date_started = models.DateTimeField()
    is_finished = models.BooleanField(default=False)
    most_recent_access = models.DateTimeField(default=None, null=True)

    class Meta:
        db_table = "sessions"

class SessionTime(models.Model):
    session_id = models.ForeignKey(Session, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        db_table = "session_times"

class ScenarioForUser(models.Model):
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    user_id = models.IntegerField()

    class Meta:
        db_table = "scenario_for_user"

class Response(models.Model):
    response_id = models.AutoField(primary_key=True)
    session_id = models.ForeignKey(Session, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    choice = models.TextField()

    class Meta:
        db_table = "responses"

class Stakeholder(models.Model):
    stakeholder_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    name = models.TextField(blank=False)
    description = models.TextField()
    job = models.TextField(blank=False)
    introduction = models.TextField()
    photopath = models.TextField()

    class Meta:
        db_table = "stakeholders"

class Conversation(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)
    question = models.TextField()
    response_id = models.TextField()

    class Meta:
        db_table = "conversations"

class ConversationsHad(models.Model):
    session_id = models.ForeignKey(Session, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()
    stakeholder_id = models.ForeignKey(Stakeholder, on_delete=CASCADE)
    score = models.FloatField()  # coverage score of a student's response
    conversation_id = models.IntegerField()

    class Meta:
        db_table = "conversations_had"

class ActionPageChoice(models.Model):
    apc_id = models.AutoField(primary_key=True)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    choice = models.TextField(null=True)
    result_page = models.IntegerField(null=True)

    class Meta:
        db_table = "action_page_choices"

class Issue(models.Model):
    issue_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)
    name = models.TextField()
    importance_score = models.IntegerField()

    class Meta:
        db_table = "issues"

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

class Asset(models.Model):
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    name = models.CharField(max_length=100)
    content = models.TextField()

    class Meta:
        db_table = "asset"

class Invitation(models.Model):
    invitation_key = models.TextField()
    version_id = models.ForeignKey(Version, on_delete=CASCADE)

    class Meta:
        db_table = "invitations"

class ReflectionQuestion(models.Model):
    rq_id = models.AutoField(primary_key=True)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    reflection_question = models.TextField()

    class Meta:
        db_table = "reflection_questions" 

class ReflectionsTaken(models.Model):
    reflections = models.TextField()
    rq_id = models.ForeignKey(ReflectionQuestion, on_delete=CASCADE)
    session_id = models.ForeignKey(Session, on_delete=CASCADE)
    version_id = models.ForeignKey(Version, on_delete=CASCADE)
    page_id = models.ForeignKey(Page, on_delete=CASCADE)
    # date_taken = models.ForeignKey(Responses.date_taken, on_delete=CASCADE)
    date_taken = models.DateTimeField()

    class Meta:
        db_table = "reflections_taken"