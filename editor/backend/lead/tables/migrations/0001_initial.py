import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='courses',
            fields=[
                ('COURSE', models.IntegerField(default=None, primary_key=True, serialize=False)),
                ('NAME', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='pages',
            fields=[
                ('PAGE', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('PAGE_TYPE', models.CharField(choices=[('I', 'INTRO'), ('G', 'GENERIC'), ('R', 'REFLECTION'), ('S', 'STAKEHOLDER'), ('A', 'ACTION')], max_length=2)),
                ('PAGE_TITLE', models.CharField(max_length=1000)),
                ('PAGE_BODY', models.TextField()),
                ('X_COORDINATE', models.IntegerField()),
                ('Y_COORDINATE', models.IntegerField()),
                ('NEXT_PAGE', models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='tables.pages')),
            ],
        ),
        migrations.CreateModel(
            name='scenarios',
            fields=[
                ('SCENARIO', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('NAME', models.CharField(max_length=1000)),
                ('PUBLIC', models.BooleanField(default=False)),
                ('IS_FINISHED', models.BooleanField(default=False)),
                ('DATE_CREATED', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserTypes',
            fields=[
                ('user_type_id', models.AutoField(db_column='USER_TYPE_ID', primary_key=True, serialize=False)),
                ('name', models.TextField(blank=True, db_column='NAME', null=True)),
            ],
            options={
                'db_table': 'user_types',
            },
        ),
        migrations.CreateModel(
            name='Versions',
            fields=[
                ('version_id', models.AutoField(db_column='VERSION_ID', editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, db_column='NAME', max_length=1000, null=True)),
                ('num_conversation', models.IntegerField(blank=True, db_column='NUM_CONVERSATION', null=True)),
                ('first_page', models.ForeignKey(blank=True, db_column='FIRST_PAGE', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='tables.pages')),
                ('scenario', models.ForeignKey(blank=True, db_column='SCENARIO_ID', null=True, on_delete=django.db.models.deletion.CASCADE, to='tables.scenarios')),
            ],
            options={
                'db_table': 'versions',
            },
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('user_id', models.AutoField(db_column='USER_ID', primary_key=True, serialize=False)),
                ('access_level', models.IntegerField(blank=True, db_column='ACCESS_LEVEL', null=True)),
                ('user_type', models.ForeignKey(blank=True, db_column='USER_TYPE_ID', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='tables.UserTypes')),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='stakeholders',
            fields=[
                ('STAKEHOLDER', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('NAME', models.CharField(default='default', max_length=1000)),
                ('DESCRIPTION', models.TextField(default='default')),
                ('JOB', models.TextField(default='default')),
                ('INTRODUCTION', models.TextField(default='default')),
                ('PHOTO', models.ImageField(null=True, upload_to='stakeholder_images/')),
                ('SCENARIO', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='stakeholders', to='tables.scenarios')),
                ('VERSION', models.ForeignKey(db_column='VERSION_ID', null=True, on_delete=django.db.models.deletion.CASCADE, to='tables.Versions')),
            ],
            options={
                'unique_together': {('STAKEHOLDER', 'VERSION')},
            },
        ),
        migrations.AddField(
            model_name='scenarios',
            name='user',
            field=models.ForeignKey(db_column='USER_ID', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='scenario_creator2', to='tables.Users'),
        ),
        migrations.CreateModel(
            name='professors_teach',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COURSE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='professors_teach2', to='tables.courses')),
                ('USER_ID', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='professors_teach1', to='tables.Users')),
            ],
        ),
        migrations.AddField(
            model_name='pages',
            name='SCENARIO',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pages', to='tables.scenarios'),
        ),
        migrations.AddField(
            model_name='pages',
            name='VERSION',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tables.Versions'),
        ),
        migrations.CreateModel(
            name='Issues',
            fields=[
                ('ISSUE', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('NAME', models.CharField(max_length=1000)),
                ('IMPORTANCE_SCORE', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('SCENARIO', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='issues', to='tables.scenarios')),
                ('VERSION', models.ForeignKey(db_column='VERSION_ID', null=True, on_delete=django.db.models.deletion.CASCADE, to='tables.Versions')),
            ],
            options={
                'unique_together': {('SCENARIO', 'ISSUE', 'VERSION')},
            },
        ),
        migrations.CreateModel(
            name='stakeholder_page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PAGE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stakeholder_page1', to='tables.pages')),
                ('STAKEHOLDER', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stakeholder_page2', to='tables.stakeholders')),
            ],
            options={
                'unique_together': {('PAGE', 'STAKEHOLDER')},
            },
        ),
        migrations.CreateModel(
            name='scenarios_for',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('VERSION', models.IntegerField(default=1, editable=False, null=True)),
                ('COURSE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='tables.courses')),
                ('SCENARIO', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scenarios_for', to='tables.scenarios')),
            ],
            options={
                'unique_together': {('SCENARIO', 'COURSE', 'VERSION')},
            },
        ),
        migrations.CreateModel(
            name='reflection_question',
            fields=[
                ('REFLECTION_QUESTION', models.TextField()),
                ('RQ_ID', models.AutoField(db_column='RQ_ID', primary_key=True, serialize=False)),
                ('PAGE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reflection_questions', to='tables.pages')),
                ('VERSION', models.ForeignKey(db_column='VERSION_ID', null=True, on_delete=django.db.models.deletion.CASCADE, to='tables.Versions')),
            ],
            options={
                'unique_together': {('PAGE', 'REFLECTION_QUESTION')},
            },
        ),
        migrations.AlterUniqueTogether(
            name='pages',
            unique_together={('PAGE', 'SCENARIO')},
        ),
        migrations.CreateModel(
            name='coverage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COVERAGE_SCORE', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0)])),
                ('ISSUE', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coverage1', to='tables.Issues')),
                ('STAKEHOLDER', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='coverages', to='tables.stakeholders')),
            ],
            options={
                'unique_together': {('STAKEHOLDER', 'ISSUE')},
            },
        ),
        migrations.CreateModel(
            name='conversations',
            fields=[
                ('CONVERSATION', models.AutoField(default=None, primary_key=True, serialize=False)),
                ('QUESTION', models.TextField(default='default')),
                ('RESPONSE', models.TextField(default='default')),
                ('SCENARIO_ID', models.ForeignKey(db_column='SCENARIO_ID', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='stakeholders2', to='tables.scenarios')),
                ('STAKEHOLDER', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='tables.stakeholders')),
            ],
            options={
                'unique_together': {('STAKEHOLDER', 'CONVERSATION')},
            },
        ),
        migrations.CreateModel(
            name='action_page_choices',
            fields=[
                ('CHOICE', models.TextField()),
                ('APC_ID', models.AutoField(db_column='APC_ID', primary_key=True, serialize=False)),
                ('PAGE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='action_page_choices', to='tables.pages')),
                ('RESULT_PAGE', models.ForeignKey(db_column='RESULT_PAGE', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='action_page2', to='tables.pages')),
            ],
            options={
                'unique_together': {('PAGE', 'CHOICE')},
            },
        ),
    ]
