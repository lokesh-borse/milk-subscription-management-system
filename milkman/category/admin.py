from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'has_image')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    fields = ('name', 'description', 'image', 'is_active')
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Has Image'
