# Generated by Django 2.2.12 on 2021-04-23 20:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0008_reflectionquestion'),
    ]

    operations = [
        migrations.AddField(
            model_name='reflectionstaken',
            name='rq_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='backend.ReflectionQuestion'),
            preserve_default=False,
        ),
    ]