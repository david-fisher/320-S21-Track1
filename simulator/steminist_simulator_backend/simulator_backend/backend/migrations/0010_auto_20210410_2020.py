# Generated by Django 2.2.12 on 2021-04-10 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0009_auto_20210410_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actionpage',
            name='chosen_choice',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='actionpage',
            name='result_page',
            field=models.IntegerField(null=True),
        ),
    ]
