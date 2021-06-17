from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from django.conf import settings
from .views import *
from django.conf.urls import url
from django.conf.urls.static import static
from . import views

router = routers.DefaultRouter()
router.register('api/users', usersViewSet, 'Users')
router.register('api/courses', coursesViewSet, 'courses')
router.register('api/takes', takesViewSet, 'takes')
router.register('api/course_invitations', course_invitationsViewSet, 'course_invitations')
router.register('api/course_assignment', course_assignmentViewSet, 'course_assignment')
router.register('api/sessions', sessionsViewSet, 'sessions')
router.register('api/session_times', session_timesViewSet, 'session_times')
router.register('api/reflections_taken', reflections_takenViewSet, 'reflections_taken')
router.register('api/action_page_choices', action_page_responsesViewSet, 'action_page_choices')
router.register('api/conversations_had', conversations_hadViewSet, 'conversations_had')

urlpatterns = [
    path('shib/attributes', views.readAttributes, name='readAttributes'),
    path('multi_reflection', multi_reflection.as_view()),
    path('scenarios/session/start', views.startSession, name="startSession"),
    path('scenarios/session/end', views.endSession, name="endSession"),
    path('scenarios/sessiontimes/start', views.startSessionTimes, name="startSessionTimes"),
    path('scenarios/sessiontimes/end', views.endSessionTimes, name="endSessionTimes"),
    path('dashboard', courses_for_user.as_view())
]

urlpatterns += router.urls

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)