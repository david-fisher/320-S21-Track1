from django.contrib import admin

# Register your models here.
from backend.models import *

admin.site.register(Course)
admin.site.register(Scenario)
admin.site.register(Page)
admin.site.register(Version)
admin.site.register(Change)
admin.site.register(Session)
admin.site.register(SessionTime)
admin.site.register(ScenarioForUser)
admin.site.register(Response)
admin.site.register(Stakeholder)
admin.site.register(ConversationsHad)
admin.site.register(Conversation)
admin.site.register(GenericPage)
admin.site.register(ActionPage)
admin.site.register(Choice)
admin.site.register(Issue)
admin.site.register(StakeholderPage)
admin.site.register(Coverage)
admin.site.register(ReflectionsTaken)
admin.site.register(Asset)
admin.site.register(Invitation)