# Generated by Django 2.2.20 on 2021-06-17 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0004_action_page_responses_conversations_had_course_assignment_course_invitations_reflections_taken_sessi'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='COURSE',
            field=models.CharField(default=None, max_length=10, primary_key=True, serialize=False),
        ),
    ]