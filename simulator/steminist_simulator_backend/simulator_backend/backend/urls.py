from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('scenarios', views.scenarios, name='scenarios'),
    path('scenarios/intro', views.scenarioIntroduction, name='scenarioIntroduction'),
    path('scenarios/task', views.scenarioTask, name='scenarioTask'),
    path('scenarios/initialAction', views.initialAction, name='initialAction')
    path('scenarios/stakeholder', views.stakeholder , name='stakeholder')
    path('scenarios/conversation', views.conversation, name='conversation')
]
