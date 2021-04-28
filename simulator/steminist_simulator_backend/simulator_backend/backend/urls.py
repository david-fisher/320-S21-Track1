from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('shib/attributes', views.readAttributes, name='readAttributes'),
    path('scenarios', views.scenarios, name='scenarios'),
    path('scenarios/session', views.session, name="startSession"),
    path('scenarios/intro', views.scenarioIntroduction, name='scenarioIntroduction'),
    path('scenarios/task', views.scenarioTask, name='scenarioTask'),
    path('scenarios/reflection', views.reflection, name='reflection'),
    path('scenarios/reflection/response', views.reflectionResponse, name='reflection/response'),
    path('scenarios/stakeholder/page', views.stakeholderPage, name='stakeholderPage'),
    path('scenarios/stakeholder', views.stakeholder, name='stakeholder'),
    path('scenarios/stakeholder/had', views.stakeholderHad, name='stakeholderHad'),
    path('scenarios/conversation/page', views.conversationPage, name='conversationPage'),
    path('scenarios/conversation', views.conversation, name='conversation'),
    path('scenarios/conversation/had', views.conversationHad, name='conversationHad'),
    path('scenarios/action/prompt', views.actionPrompt, name='scenarioActionPrompt'),
    path('scenarios/action', views.action, name='scenarioAction'),
    path('scenarios/radar', views.radarPlot, name='radarPlot')
]

