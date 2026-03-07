from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("subscription", "0004_subscription_pause_timeline_and_accrual"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="total_paid_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
