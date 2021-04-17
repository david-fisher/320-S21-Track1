from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('scenarios', views.scenarios, name='scenarios'),
    path('scenarios/intro', views.scenarioIntroduction, name='scenarioIntroduction'),
    path('scenarios/task', views.scenarioTask, name='scenarioTask'),
    path('scenarios/stakeholder/page', views.stakeholderPage, name='stakeholderPage'),
    path('scenarios/stakeholder', views.stakeholder, name='stakeholder'),
    path('scenarios/conversation/page', views.conversationPage, name='conversationPage'),
    path('scenarios/conversation', views.conversation, name='conversation'),
    path('scenarios/action/prompt', views.actionPrompt, name='scenarioActionPrompt'),
    path('scenarios/action', views.action, name='scenarioAction')
]

