# Generated by Django 2.2.12 on 2021-06-04 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0003_auto_20210604_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action_page_choices',
            name='DATE_TAKEN',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='conversations_had',
            name='DATE_TAKEN',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='reflections_taken',
            name='DATE_TAKEN',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='session_times',
            name='END_TIME',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='session_times',
            name='START_TIME',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='sessions',
            name='DATE_FINISHED',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='sessions',
            name='DATE_STARTED',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='sessions',
            name='MOST_RECENT_ACCESS',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]