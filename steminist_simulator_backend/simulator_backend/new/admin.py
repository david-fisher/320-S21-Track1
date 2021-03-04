from django.contrib import admin

# Register your models here.
from .models import Scenario, Course, PartOf, User, Enrolled, Page

admin.site.register(Scenario)
admin.site.register(Course)
admin.site.register(PartOf)
admin.site.register(User)
admin.site.register(Enrolled)
admin.site.register(Page)


