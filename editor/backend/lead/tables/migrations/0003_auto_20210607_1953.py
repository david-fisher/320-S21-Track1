# Generated by Django 2.2.20 on 2021-06-07 19:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0002_coverage_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coverage',
            name='SUMMARY',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]