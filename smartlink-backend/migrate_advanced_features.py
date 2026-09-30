"""
Migration script to add advanced LinkDrip-inspired features
"""
from app import create_app, db
from app.models import Link, Lead, LinkView

app = create_app()

with app.app_context():
    # Create all new tables and columns
    db.create_all()
    print("✓ Database migrated successfully!")
    print("✓ Added new columns to Link model")
    print("✓ Created Lead model for email collection")
    print("✓ Created LinkView model for social proof")
    print("\nNew features available:")
    print("  - Link scheduling")
    print("  - Link pinning/priority")
    print("  - Password-protected links")
    print("  - Click goals & conversion tracking")
    print("  - Social proof (view counters)")
    print("  - Email lead collection")
    print("  - A/B testing")
    print("  - Link categories")
    print("  - Custom slugs")
