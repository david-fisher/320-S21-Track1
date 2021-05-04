# Generated by Django 2.2.12 on 2021-04-21 23:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActionPageChoice',
            fields=[
                ('apc_id', models.AutoField(primary_key=True, serialize=False)),
                ('chocie', models.IntegerField(null=True)),
                ('result_page', models.IntegerField(null=True)),
                ('page_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Page')),
            ],
            options={
                'db_table': 'action_page_choices',
            },
        ),
        migrations.RemoveField(
            model_name='choice',
            name='action_page_id',
        ),
        migrations.DeleteModel(
            name='ActionPage',
        ),
        migrations.DeleteModel(
            name='Choice',
        ),
    ]