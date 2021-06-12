from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from django.conf import settings
from .views import *
from . import views
from django.conf.urls import url
from django.conf.urls.static import static

# DemographicsViewSet, allScenariosViewSet, StudentsViewSet, ProfessorsViewSet, ScenariosViewSet, Choices_forViewSet, Stakeholder_pageViewSet, ConversationsViewSet, Stakeholder_inViewSet, StakeholdersViewSet

router = routers.DefaultRouter()
router.register('api/users', UsersViewSet, 'Users')
router.register('api/user_access', user_accessViewSet, 'user_access')
router.register('api/courses', CoursesViewSet, 'courses')
router.register('api/professors_teach', Professors_teachViewSet, 'professors_teach')
router.register('api/scenarios', ScenariosViewSet, 'scenarios')
router.register('api/scenarios_for', ScenariosForViewSet, 'scenarios_for')
router.register('api/versions', VersionsViewSet, 'versions')
router.register('api/pages', PagesViewSet, 'pages')
router.register('api/conversations', ConversationsViewSet, 'conversations')
router.register('api/stakeholders', StakeholdersViewSet, 'stakeholders')
router.register('api/reflection_questions', Reflection_QuestionsViewSet, 'reflection_questions')
router.register('api/action_page_choices', Action_pageViewSet, 'action_page_choices')
router.register('api/issues', IssuesViewSet, 'issues')
router.register('api/stakeholder_page', Stakeholder_pageViewSet, 'stakeholder_page')
router.register('api/coverage', CoverageViewSet, 'coverage')

urlpatterns = [
    path('allScenarios', allScenariosViewSet.as_view()),
    path('multi_conv', multi_conv.as_view()),
    path('multi_stake', multi_stake.as_view()),
    path('multi_coverage', multi_coverage.as_view()),
    path('logistics', logistics_page.as_view()),
    path('multi_issue', multi_issue.as_view()),
    path('dashboard', dashboard_page.as_view()),
    path('flowchart', flowchart.as_view()),
    path('coverages', coverages_page.as_view()),
    path('stakeholder', stakeholders_page.as_view()),
    path('issue', IssueCoverage.as_view()),
    path('coverages', coverages_page.as_view()),
    path('page', pages_page.as_view()),
    path('registerUser', register_user_api.as_view()),
    path('scenarios_for_user', scenarios_forapi.as_view())
] 

urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
