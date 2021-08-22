# Generated by Django 3.2.6 on 2021-08-21 20:12

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0002_delete_mmmm'),
    ]

    operations = [
        migrations.CreateModel(
            name='NewContractModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('addresses', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), default=[], size=None)),
                ('ots', models.PositiveIntegerField()),
                ('campany_start', models.DateTimeField()),
                ('campany_end', models.DateTimeField()),
                ('days_of_week', django.contrib.postgres.fields.ArrayField(base_field=models.PositiveIntegerField(), default=[], size=None)),
                ('time_period_start', models.PositiveIntegerField()),
                ('time_period_end', models.PositiveIntegerField()),
            ],
        ),
    ]
