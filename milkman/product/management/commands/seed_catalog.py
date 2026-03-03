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

        self.stdout.write(
            self.style.SUCCESS(
                "Seed complete | "
                f"categories created: {created_categories}, updated: {updated_categories} | "
                f"products created: {created_products}, updated: {updated_products} | "
                f"backfilled categories: {backfilled_categories}, backfilled products: {backfilled_products}"
            )
        )
