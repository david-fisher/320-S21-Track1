from django.db import models
from django.db.models import fields
from django.db.models.constraints import UniqueConstraint
from django.db.models.deletion import CASCADE

# Create your models here.

# Scenario Model
class Scenario(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 500)
    dueDate = models.DateField()
    description = models.CharField(blank=False, max_length = 500)
    status = models.CharField(max_length = 30)
    additional_data = models.CharField(max_length = 1000)

# Course Model
class Course(models.Model):
    id = models.AutoField(primary_key=True)
    webpage = models.CharField(max_length = 1000)
    name = models.CharField(blank=False, max_length=100)
    semester = models.CharField(blank=False, max_length=10)

# PartOf Model
class PartOf(models.Model):
    course_id = models.ForeignKey(Course, on_delete=CASCADE)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)

class User(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(blank=False, max_length=100)
    email = models.EmailField(blank=False)
    demographics = models.CharField(blank=True, max_length=1000)

# Enrolled Model
class Enrolled(models.Model):
    student_id = models.ForeignKey(User, on_delete=CASCADE)
    course_id = models.ForeignKey(Course, on_delete=CASCADE)
    # (student_id, course_id) has to be composite primary key

class Page(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.IntegerField()
    page_type = models.CharField(blank=False, max_length=5)
    body_text = models.CharField(blank=False, max_length=1000)
    scenario_id = models.ForeignKey(Scenario, on_delete=CASCADE)

class Mcq(models.Model):
    page_id = models.ForeignKey(Page, primary_key=True, on_delete=CASCADE)

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(blank=False, max_length=1000)
    mcq_id = models.ForeignKey(Mcq, on_delete=CASCADE)

class McqOption(models.Model):
    id = models.AutoField(primary_key=True)
    option = models.CharField(blank=False, max_length=1000)
    question_id = models.ForeignKey(Question, on_delete=CASCADE)
    # UniqueConstraint(fields=['question_id', 'option'])