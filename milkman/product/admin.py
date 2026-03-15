from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_active', 'has_image')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    fields = ('name', 'description', 'image', 'price', 'category', 'is_active')
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Has Image'
