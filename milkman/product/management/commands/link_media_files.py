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
            # Get all products, not just ones with empty images
            products = Product.objects.all()
            
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
            # Get all categories, not just ones with empty images
            categories = Category.objects.all()
            
            for i, category in enumerate(categories):
                if i < len(category_images):
                    rel_path = f"categories/{category_images[i].name}"
                    category.image = rel_path
                    category.save()
                    self.stdout.write(f"✓ Linked {category.name} → {rel_path}")
        
        self.stdout.write(self.style.SUCCESS("All media files linked successfully!"))
