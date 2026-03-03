from decimal import Decimal

from django.core.management.base import BaseCommand

from category.models import Category
from product.models import Product


def pexels_url(photo_id: int, width: int, sig: int) -> str:
    return (
        f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg"
        f"?auto=compress&cs=tinysrgb&w={width}&sig={sig}"
    )


class Command(BaseCommand):
    help = "Seed milkman categories and products with related unique images"

    def handle(self, *args, **options):
        categories = [
            {
                "name": "Milk",
                "description": "Daily fresh milk options",
                "image": pexels_url(248412, 900, 1001),
            },
            {
                "name": "Curd & Yogurt",
                "description": "Cultured dairy for everyday use",
                "image": pexels_url(4006347, 900, 1002),
            },
            {
                "name": "Paneer & Cheese",
                "description": "Soft paneer and artisan cheese",
                "image": pexels_url(10585061, 900, 1003),
            },
            {
                "name": "Butter & Ghee",
                "description": "Traditional butter and ghee",
                "image": pexels_url(5313343, 900, 1004),
            },
            {
                "name": "Buttermilk & Lassi",
                "description": "Refreshing probiotic drinks",
                "image": pexels_url(6544370, 900, 1005),
            },
            {
                "name": "Flavored Milk & Shakes",
                "description": "Healthy flavored dairy beverages",
                "image": pexels_url(5946633, 900, 1006),
            },
            {
                "name": "Eggs",
                "description": "Farm-fresh eggs",
                "image": pexels_url(162712, 900, 1007),
            },
            {
                "name": "Bread & Bakery",
                "description": "Fresh bakery to pair with dairy",
                "image": pexels_url(1775043, 900, 1008),
            },
        ]

        product_map = {
            "Milk": [
                ("Cow Milk 1L", Decimal("62.00"), "Fresh cow milk for daily delivery", 1251175, 2001),
                ("Buffalo Milk 1L", Decimal("74.00"), "High-fat buffalo milk for tea and sweets", 416978, 2002),
                ("A2 Milk 1L", Decimal("98.00"), "Premium A2 milk from native cows", 248412, 2003),
            ],
            "Curd & Yogurt": [
                ("Fresh Curd 500g", Decimal("48.00"), "Thick set curd prepared daily", 5946688, 2101),
                ("Greek Yogurt 400g", Decimal("85.00"), "Protein-rich greek yogurt", 4669024, 2102),
                ("Probiotic Yogurt 400g", Decimal("92.00"), "Live-culture probiotic yogurt", 704569, 2103),
            ],
            "Paneer & Cheese": [
                ("Fresh Paneer 200g", Decimal("95.00"), "Soft paneer made from fresh milk", 4198019, 2201),
                ("Cheddar Cheese 200g", Decimal("155.00"), "Mature cheddar block", 821365, 2202),
                ("Mozzarella 200g", Decimal("145.00"), "Stretchy mozzarella for cooking", 4109948, 2203),
            ],
            "Butter & Ghee": [
                ("Salted Butter 100g", Decimal("58.00"), "Creamy table butter", 5313343, 2301),
                ("Cow Ghee 500ml", Decimal("365.00"), "Aromatic ghee from cow milk", 7262897, 2302),
                ("Bilona Ghee 500ml", Decimal("520.00"), "Traditional bilona churned ghee", 6660185, 2303),
            ],
            "Buttermilk & Lassi": [
                ("Plain Buttermilk 500ml", Decimal("35.00"), "Cooling salted buttermilk", 5946639, 2401),
                ("Masala Buttermilk 500ml", Decimal("42.00"), "Spiced buttermilk with herbs", 6544370, 2402),
                ("Sweet Lassi 300ml", Decimal("48.00"), "Classic sweet lassi", 337909, 2403),
            ],
            "Flavored Milk & Shakes": [
                ("Chocolate Milk 250ml", Decimal("40.00"), "Chocolate flavored milk", 5946633, 2501),
                ("Badam Milk 250ml", Decimal("45.00"), "Almond saffron flavored milk", 5946082, 2502),
                ("Strawberry Shake 300ml", Decimal("65.00"), "Fruit-rich strawberry shake", 5946973, 2503),
            ],
            "Eggs": [
                ("Farm Eggs (6 pcs)", Decimal("54.00"), "Fresh white eggs from local farm", 162712, 2601),
                ("Brown Eggs (6 pcs)", Decimal("66.00"), "Nutrient-rich brown eggs", 6941036, 2602),
                ("Omega-3 Eggs (6 pcs)", Decimal("82.00"), "Eggs enriched with omega-3", 1759279, 2603),
            ],
            "Bread & Bakery": [
                ("Milk Bread 400g", Decimal("42.00"), "Soft milk bread loaf", 1775043, 2701),
                ("Multigrain Bread 400g", Decimal("56.00"), "Fiber-rich multigrain loaf", 2434, 2702),
                ("Rusk 300g", Decimal("68.00"), "Crunchy tea-time rusk", 2067396, 2703),
            ],
        }

        # Keep one unique, realistic image per product name, including legacy rows.
        product_image_overrides = {
            "Cow-Milk": pexels_url(28424335, 900, 5001),
            "Paneer": pexels_url(10585061, 900, 5002),
            "Yoghurt": pexels_url(4006347, 900, 5003),
            "Cow Milk 1L": pexels_url(1251175, 900, 5101),
            "Buffalo Milk 1L": pexels_url(416978, 900, 5102),
            "A2 Milk 1L": pexels_url(248412, 900, 5103),
            "Fresh Curd 500g": pexels_url(5946688, 900, 5201),
            "Greek Yogurt 400g": pexels_url(4669024, 900, 5202),
            "Probiotic Yogurt 400g": pexels_url(704569, 900, 5203),
            "Fresh Paneer 200g": pexels_url(4198019, 900, 5301),
            "Cheddar Cheese 200g": pexels_url(821365, 900, 5302),
            "Mozzarella 200g": pexels_url(4109948, 900, 5303),
            "Salted Butter 100g": pexels_url(5313343, 900, 5401),
            "Cow Ghee 500ml": pexels_url(7262897, 900, 5402),
            "Bilona Ghee 500ml": pexels_url(6660185, 900, 5403),
            "Plain Buttermilk 500ml": pexels_url(5946639, 900, 5501),
            "Masala Buttermilk 500ml": pexels_url(6544370, 900, 5502),
            "Sweet Lassi 300ml": pexels_url(337909, 900, 5503),
            "Chocolate Milk 250ml": pexels_url(5946633, 900, 5601),
            "Badam Milk 250ml": pexels_url(5946082, 900, 5602),
            "Strawberry Shake 300ml": pexels_url(5946973, 900, 5603),
            "Farm Eggs (6 pcs)": pexels_url(162712, 900, 5701),
            "Brown Eggs (6 pcs)": pexels_url(6941036, 900, 5702),
            "Omega-3 Eggs (6 pcs)": pexels_url(1759279, 900, 5703),
            "Milk Bread 400g": pexels_url(1775043, 900, 5801),
            "Multigrain Bread 400g": pexels_url(2434, 900, 5802),
            "Rusk 300g": pexels_url(2067396, 900, 5803),
        }

        created_categories = 0
        updated_categories = 0
        created_products = 0
        updated_products = 0
        backfilled_categories = 0
        backfilled_products = 0

        for entry in categories:
            category, created = Category.objects.update_or_create(
                name=entry["name"],
                defaults={
                    "description": entry["description"],
                    "image": entry["image"],
                    "is_active": True,
                },
            )
            if created:
                created_categories += 1
            else:
                updated_categories += 1

            for name, price, description, photo_id, sig in product_map[entry["name"]]:
                _, p_created = Product.objects.update_or_create(
                    name=name,
                    category=category,
                    defaults={
                        "price": price,
                        "description": description,
                        "image": pexels_url(photo_id, 900, sig),
                        "is_active": True,
                    },
                )
                if p_created:
                    created_products += 1
                else:
                    updated_products += 1

        # Ensure older records created before this command also have unique images.
        for c in Category.objects.filter(image=""):
            c.image = pexels_url(248412, 900, 3000 + c.id)
            c.save(update_fields=["image"])
            backfilled_categories += 1

        for p in Product.objects.filter(image=""):
            p.image = pexels_url(248412, 900, 4000 + p.id)
            p.save(update_fields=["image"])
            backfilled_products += 1

        # Enforce curated unique product images by name.
        for p in Product.objects.all():
            override_image = product_image_overrides.get(p.name)
            if override_image and p.image != override_image:
                p.image = override_image
                p.save(update_fields=["image"])

        self.stdout.write(
            self.style.SUCCESS(
                "Seed complete | "
                f"categories created: {created_categories}, updated: {updated_categories} | "
                f"products created: {created_products}, updated: {updated_products} | "
                f"backfilled categories: {backfilled_categories}, backfilled products: {backfilled_products}"
            )
        )
