from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.CharField(source="product.image", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "quantity",
            "start_date",
            "is_active",
            "duration",
            "delivery_slot",
            "address",
            "status",
        ]
