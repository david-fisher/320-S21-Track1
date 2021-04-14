from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('', views.getDisplayName, name='getDisplayName')
    path('', views.getPrimaryAffiliation, name='getPrimaryAffiliation')
    path('', views.getMail, name='getMail')
    path('', views.checkAttribute, name='checkAttribute')
    path('scenarios', views.scenarios, name='scenarios'),
    path('scenarios/intro', views.scenarioIntroduction, name='scenarioIntroduction'),
    path('scenarios/task', views.scenarioTask, name='scenarioTask'),
    path('scenarios/stakeholder', views.stakeholder , name='stakeholder'),
    path('scenarios/conversation', views.conversation, name='conversation'),
    path('scenarios/action/prompt', views.actionPrompt, name='scenarioActionPrompt'),
    path('scenarios/action', views.action, name='scenarioAction')
]
