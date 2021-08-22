# Generated by Django 3.2.6 on 2021-08-21 20:29

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0010_delete_newcontractmodel'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewContractModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('addresses', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, default=list, size=1)),
                ('ots', models.PositiveIntegerField()),
                ('campany_start', models.DateTimeField()),
                ('campany_end', models.DateTimeField()),
                ('days_of_week', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), default=list, size=1)),
                ('time_period_start', models.PositiveIntegerField()),
                ('time_period_end', models.PositiveIntegerField()),
            ],
        ),
    ]