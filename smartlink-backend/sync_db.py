from app import app, db
from app.models import Product, User, Link, Analytics, LinkView, Lead

with app.app_context():
    db.create_all()
    print("Database tables created/verified.")
