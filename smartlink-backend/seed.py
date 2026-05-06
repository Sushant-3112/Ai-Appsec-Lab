from app import create_app, db
from app.models import User, Link, Analytics
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create dummy user
    user1 = User(email="alex@example.com", username="alex", full_name="Alex Creator", bio="Digital creator & developer. Here are my top resources.")
    user1.set_password("password123")
    
    user2 = User(email="sarah@example.com", username="sarah", full_name="Sarah Designs", bio="Freelance graphic designer. Let's work together!")
    user2.set_password("password123")
    
    db.session.add_all([user1, user2])
    db.session.commit()

    # Create links
    links = [
        Link(user_id=user1.id, title="My Personal Website", url="https://example.com", is_active=True, order=1),
        Link(user_id=user1.id, title="Follow me on Twitter", url="https://twitter.com", is_active=True, order=2),
        Link(user_id=user1.id, title="My Latest YouTube Video", url="https://youtube.com", type="video", is_active=True, order=3),
        Link(user_id=user1.id, title="Buy my Notion Template", url="https://example.com/template", type="product", is_active=True, order=4),
        
        Link(user_id=user2.id, title="Portfolio", url="https://dribbble.com", is_active=True, order=1),
        Link(user_id=user2.id, title="Book a Consultation (Calendly)", url="https://calendly.com", is_active=True, order=2),
    ]

    db.session.add_all(links)
    db.session.commit()

    # Add dummy analytics
    platforms = ['windows', 'mac', 'iphone', 'android']
    locations = ['US', 'UK', 'IN', 'CA', 'AU']
    
    for link in links:
        num_clicks = random.randint(10, 150)
        for _ in range(num_clicks):
            click = Analytics(
                link_id=link.id,
                visitor_ip=f"192.168.1.{random.randint(1, 255)}",
                location=random.choice(locations),
                device=random.choice(platforms),
                timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 24))
            )
            db.session.add(click)
            
    db.session.commit()
    print("Database seeded successfully with dummy users:")
    print("- alex@example.com (pw: password123)")
    print("- sarah@example.com (pw: password123)")
