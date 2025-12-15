import os
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.core.management import call_command

from products.models import Product, ProductImage


class Command(BaseCommand):
    help = "Bootstrap demo data (admin user + fixtures + optional images). Idempotent."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fixtures",
            action="store_true",
            help="Load fixtures/products.json if no products exist.",
        )
        parser.add_argument(
            "--admin",
            action="store_true",
            help="Create/update demo admin user if env vars are set.",
        )
        parser.add_argument(
            "--images",
            action="store_true",
            help="Attach product images from backend/media/product_images by filename convention.",
        )

    def handle(self, *args, **options):
        do_fixtures = options["fixtures"]
        do_admin = options["admin"]
        do_images = options["images"]

        if do_admin:
            self._bootstrap_admin()

        if do_fixtures:
            self._bootstrap_fixtures()

        if do_images:
            self._bootstrap_images()

    def _bootstrap_admin(self):
        username = os.environ.get("DEMO_ADMIN_USERNAME")
        password = os.environ.get("DEMO_ADMIN_PASSWORD")
        email = os.environ.get("DEMO_ADMIN_EMAIL", "")

        if not username or not password:
            self.stdout.write(self.style.WARNING("DEMO_ADMIN_USERNAME/DEMO_ADMIN_PASSWORD not set; skipping admin bootstrap."))
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(username=username, defaults={"email": email})
        if email and getattr(user, "email", "") != email:
            user.email = email

        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created demo admin user '{username}'."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated demo admin user '{username}'."))

    def _bootstrap_fixtures(self):
        if Product.objects.exists():
            self.stdout.write(self.style.NOTICE("Products already exist; skipping fixture load."))
            return

        fixtures_path = Path(settings.BASE_DIR) / "fixtures" / "products.json"
        if not fixtures_path.exists():
            self.stdout.write(self.style.WARNING(f"Fixture file not found: {fixtures_path}; skipping."))
            return

        call_command("loaddata", str(fixtures_path))
        self.stdout.write(self.style.SUCCESS("Loaded product fixtures."))

    def _bootstrap_images(self):
        media_dir = Path(settings.BASE_DIR) / "media" / "product_images"
        if not media_dir.exists():
            self.stdout.write(self.style.WARNING(f"Media directory not found: {media_dir}; skipping image bootstrap."))
            return

        # Convention: mockimg{product_id}_*.PNG or mockimg{product_id}.png etc.
        # Example: Product pk=9 -> mockimg9_1.PNG, mockimg9_1_2.PNG
        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.NOTICE("No products found; skipping image bootstrap."))
            return

        attached = 0
        for product in products:
            if ProductImage.objects.filter(product=product).exists():
                continue

            patterns = [
                f"mockimg{product.pk}_*.*",
                f"mockimg{product.pk}.*",
            ]

            matches = []
            for pat in patterns:
                matches.extend(sorted(media_dir.glob(pat)))

            # De-dup while preserving order
            seen = set()
            unique_matches = []
            for p in matches:
                if p.name in seen:
                    continue
                seen.add(p.name)
                unique_matches.append(p)

            for path in unique_matches:
                try:
                    with path.open("rb") as fh:
                        # Store using the same name. When CLOUDINARY_URL is set,
                        # this will upload to Cloudinary via DEFAULT_FILE_STORAGE.
                        django_file_name = f"product_images/{path.name}"
                        img = ProductImage(product=product)
                        img.image.save(django_file_name, fh, save=True)
                        attached += 1
                except Exception as exc:
                    self.stdout.write(self.style.WARNING(f"Failed attaching {path.name} to product {product.pk}: {exc}"))

        self.stdout.write(self.style.SUCCESS(f"Attached {attached} product images."))
