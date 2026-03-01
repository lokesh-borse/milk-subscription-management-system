from django.db import models
from customer.models import Customer
from product.models import Product

# Create your models here.
class Subscription(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="subscriptions")
    quantity = models.PositiveIntegerField(default=1)
    start_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    duration = models.PositiveIntegerField(default=1)
    delivery_slot = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, default="active")

    def __str__(self):
        return f"{self.customer.name} -> {self.product.name}"
