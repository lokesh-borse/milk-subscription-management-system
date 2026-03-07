from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("subscription", "0003_subscription_frequency"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="accrued_active_days",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="subscription",
            name="last_activated_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="subscription",
            name="pause_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
