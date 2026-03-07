from django.db import models
from datetime import datetime, time
from decimal import Decimal
from django.utils import timezone
from customer.models import Customer
from product.models import Product

# Create your models here.
class Subscription(models.Model):
    FREQUENCY_ONCE = "once"
    FREQUENCY_WEEKLY = "weekly"
    FREQUENCY_DAILY = "daily"
    FREQUENCY_CHOICES = [
        (FREQUENCY_ONCE, "Once"),
        (FREQUENCY_WEEKLY, "Weekly"),
        (FREQUENCY_DAILY, "Daily"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="subscriptions")
    quantity = models.PositiveIntegerField(default=1)
    start_date = models.DateField(auto_now_add=True)
    pause_date = models.DateTimeField(null=True, blank=True)
    last_activated_at = models.DateTimeField(null=True, blank=True)
    accrued_active_days = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    duration = models.PositiveIntegerField(default=1)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default=FREQUENCY_WEEKLY)
    total_paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_slot = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, default="active")

    def __str__(self):
        return f"{self.customer.name} -> {self.product.name}"

    def _anchor_datetime(self):
        if self.last_activated_at:
            return self.last_activated_at

        return timezone.make_aware(
            datetime.combine(self.start_date, time.min),
            timezone.get_current_timezone(),
        )

    def _inclusive_days_between(self, start_dt, end_dt):
        start_date = timezone.localtime(start_dt).date()
        end_date = timezone.localtime(end_dt).date()
        if end_date < start_date:
            return 0
        return (end_date - start_date).days + 1

    def active_days(self, as_of=None):
        as_of = as_of or timezone.now()
        base_days = int(self.accrued_active_days or 0)
        anchor = self._anchor_datetime()

        if self.status == "active":
            return base_days + self._inclusive_days_between(anchor, as_of)

        if self.status == "paused":
            if base_days > 0:
                return base_days
            if self.pause_date:
                return self._inclusive_days_between(anchor, self.pause_date)

        return base_days

    def daily_rate(self):
        return (Decimal(self.product.price or 0) * Decimal(self.quantity or 0)).quantize(Decimal("0.01"))

    def outstanding_balance(self, as_of=None):
        return (self.daily_rate() * Decimal(self.active_days(as_of))).quantize(Decimal("0.01"))
