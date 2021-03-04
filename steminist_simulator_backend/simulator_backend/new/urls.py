from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('scenarios', views.scenarios, name='scenarios'),
    path('scenarios/intro', views.scenarioIntroduction, name='scenarioIntroduction'),
    path('scenarios/task', views.task, name='task'),
]