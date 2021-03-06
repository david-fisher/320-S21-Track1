# Generated by Django 2.2.20 on 2021-06-16 19:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0003_auto_20210607_1953'),
    ]

    operations = [
        migrations.CreateModel(
            name='sessions',
            fields=[
                ('SESSION_ID', models.AutoField(primary_key=True, serialize=False)),
                ('DATE_STARTED', models.DateTimeField()),
                ('DATE_FINISHED', models.DateTimeField(null=True)),
                ('IS_FINISHED', models.BooleanField(default=False)),
                ('MOST_RECENT_ACCESS', models.DateTimeField()),
                ('SCENARIO_ID', models.ForeignKey(db_column='SCENARIO_ID', on_delete=django.db.models.deletion.CASCADE, to='tables.scenarios')),
                ('USER_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.Users')),
            ],
        ),
        migrations.CreateModel(
            name='course_invitations',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ACCESS_KEY', models.IntegerField()),
                ('COURSE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.courses')),
            ],
        ),
        migrations.CreateModel(
            name='course_assignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('SCENARIO_ID', models.IntegerField()),
                ('COURSE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.courses')),
            ],
        ),
        migrations.CreateModel(
            name='takes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COURSE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.courses')),
                ('USER_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.Users')),
            ],
            options={
                'unique_together': {('USER_ID', 'COURSE_ID')},
            },
        ),
        migrations.CreateModel(
            name='session_times',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('MOST_RECENT_ACCESS', models.DateTimeField(null=True)),
                ('START_TIME', models.DateTimeField()),
                ('END_TIME', models.DateTimeField(null=True)),
                ('PAGE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.pages')),
                ('SESSION_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.sessions')),
            ],
            options={
                'unique_together': {('SESSION_ID', 'PAGE_ID')},
            },
        ),
        migrations.CreateModel(
            name='reflections_taken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('REFLECTIONS', models.TextField()),
                ('DATE_TAKEN', models.DateTimeField(auto_now_add=True)),
                ('PAGE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.pages')),
                ('RQ_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.reflection_question')),
                ('SESSION_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.sessions')),
            ],
            options={
                'unique_together': {('SESSION_ID', 'RQ_ID')},
            },
        ),
        migrations.CreateModel(
            name='conversations_had',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DATE_TAKEN', models.DateTimeField(auto_now_add=True)),
                ('SESSION_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.sessions')),
                ('STAKEHOLDER_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.stakeholders')),
            ],
            options={
                'unique_together': {('SESSION_ID', 'STAKEHOLDER_ID')},
            },
        ),
        migrations.CreateModel(
            name='action_page_responses',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DATE_TAKEN', models.DateTimeField(auto_now_add=True)),
                ('APC_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.action_page_choices')),
                ('PAGE_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.pages')),
                ('SESSION_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tables.sessions')),
            ],
            options={
                'unique_together': {('SESSION_ID', 'APC_ID')},
            },
        ),
    ]
