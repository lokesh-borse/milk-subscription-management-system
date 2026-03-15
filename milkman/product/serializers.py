from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "image",
            "price",
            "category",
            "category_name",
            "is_active",
        ]
    
    def get_image(self, obj):
        if not obj.image:
            return None
        image_value = str(obj.image)
        # If it's a full URL (starts with http), return as-is
        if image_value.startswith(('http://', 'https://')):
            return image_value
        # Otherwise it's a relative path, build absolute URL
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/media/{image_value}')
        return f'/media/{image_value}'
