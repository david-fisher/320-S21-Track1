# Generated by Django 3.1.1 on 2020-11-19 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0006_auto_20201118_0334'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pages',
            name='NEXT_PAGE',
            field=models.IntegerField(null=True),
        ),
    ]
