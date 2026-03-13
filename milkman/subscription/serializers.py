from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_category = serializers.CharField(source="product.category.name", read_only=True)
    product_image = serializers.CharField(source="product.image", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    active_days = serializers.SerializerMethodField()
    daily_rate = serializers.SerializerMethodField()
    outstanding_balance = serializers.SerializerMethodField()

    def get_active_days(self, obj):
        return obj.active_days()

    def get_daily_rate(self, obj):
        return str(obj.daily_rate())

    def get_outstanding_balance(self, obj):
        return str(obj.outstanding_balance())

    def validate_duration(self, value):
        duration = int(value)
        if duration < 1 or duration > 4:
            raise serializers.ValidationError("Duration must be between 1 and 4 months.")
        return duration

    class Meta:
        model = Subscription
        fields = [
            "id",
            "customer",
            "product",
            "product_name",
            "product_category",
            "product_image",
            "product_price",
            "quantity",
            "start_date",
            "is_active",
            "duration",
            "frequency",
            "pause_date",
            "last_activated_at",
            "accrued_active_days",
            "active_days",
            "daily_rate",
            "outstanding_balance",
            "total_paid_amount",
            "delivery_slot",
            "address",
            "status",
        ]
