import os
from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from pathlib import Path
from product.models import Product
from category.models import Category


class Command(BaseCommand):
    help = "Link existing media files to products and categories"

    def handle(self, *args, **options):
        media_root = Path(default_storage.location) if hasattr(default_storage, 'location') else Path('media')
        
        # Link product images
        product_folder = media_root / 'products'
        if product_folder.exists():
            product_images = sorted(list(product_folder.glob('*.jpg')) + list(product_folder.glob('*.jpeg')) + list(product_folder.glob('*.png')))
            products = Product.objects.filter(image__isnull=True) | Product.objects.filter(image='')
            
            for i, product in enumerate(products):
                if i < len(product_images):
                    rel_path = f"products/{product_images[i].name}"
                    product.image = rel_path
                    product.save()
                    self.stdout.write(f"✓ Linked {product.name} → {rel_path}")
        
        # Link category images
        category_folder = media_root / 'categories'
        if category_folder.exists():
            category_images = sorted(list(category_folder.glob('*.jpg')) + list(category_folder.glob('*.jpeg')) + list(category_folder.glob('*.png')))
            categories = Category.objects.filter(image__isnull=True) | Category.objects.filter(image='')
            
            for i, category in enumerate(categories):
                if i < len(category_images):
                    rel_path = f"categories/{category_images[i].name}"
                    category.image = rel_path
                    category.save()
                    self.stdout.write(f"✓ Linked {category.name} → {rel_path}")
        
        self.stdout.write(self.style.SUCCESS("All media files linked successfully!"))
