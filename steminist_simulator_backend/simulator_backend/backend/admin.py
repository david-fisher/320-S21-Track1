from django.contrib import admin

# Register your models here.
from backend.models import *


admin.site.register(Scenario)
admin.site.register(Course)
admin.site.register(PartOf)
admin.site.register(User)
admin.site.register(Enrolled)
admin.site.register(Page)
admin.site.register(Mcq)
admin.site.register(Question)
admin.site.register(McqOption)
