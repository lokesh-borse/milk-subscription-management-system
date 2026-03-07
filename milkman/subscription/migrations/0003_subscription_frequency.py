from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("subscription", "0002_subscription_address_subscription_delivery_slot_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="frequency",
            field=models.CharField(
                choices=[("once", "Once"), ("weekly", "Weekly"), ("daily", "Daily")],
                default="weekly",
                max_length=20,
            ),
        ),
    ]
