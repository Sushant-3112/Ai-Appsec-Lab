from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    full_name = db.Column(db.String(120))
    bio = db.Column(db.String(256))
    avatar = db.Column(db.String(256))
    role = db.Column(db.String(20), default='user')
    theme_config = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    links = db.relationship('Link', backref='owner', lazy='dynamic')
    products = db.relationship('Product', backref='seller', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    url = db.Column(db.String(500))
    type = db.Column(db.String(20), default='link') # link, video, image, pdf, email_collect
    animation = db.Column(db.String(20)) # bounce, pulse, wobble
    thumbnail = db.Column(db.String(256)) 
    is_active = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)
    scheduled_start = db.Column(db.DateTime)
    scheduled_end = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # New LinkDrip-inspired features
    is_pinned = db.Column(db.Boolean, default=False)
    custom_slug = db.Column(db.String(64))
    password = db.Column(db.String(256))  # hashed password for protected links
    click_goal = db.Column(db.Integer, default=0)  # target clicks
    show_view_count = db.Column(db.Boolean, default=False)  # social proof
    category = db.Column(db.String(64))  # folder/category
    priority = db.Column(db.Integer, default=0)  # higher = more prominent
    conversion_goal = db.Column(db.String(128))  # what action you want users to take
    ab_test_variant = db.Column(db.String(10))  # A or B for A/B testing
    ab_test_group_id = db.Column(db.String(64))  # group multiple variants together

    analytics = db.relationship('Analytics', backref='link', lazy='dynamic')
    leads = db.relationship('Lead', backref='link', lazy='dynamic')

class Analytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=False)
    visitor_ip = db.Column(db.String(64))
    location = db.Column(db.String(120))
    device = db.Column(db.String(64))
    browser = db.Column(db.String(64))
    os = db.Column(db.String(64))
    referral_source = db.Column(db.String(256))
    session_duration = db.Column(db.Float, default=0.0)
    is_bot = db.Column(db.Boolean, default=False)
    engagement_score = db.Column(db.Float, default=0.0)
    unique_visitor_id = db.Column(db.String(128))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    file_url = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Lead(db.Model):
    """Email leads collected from link interactions"""
    id = db.Column(db.Integer, primary_key=True)
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    message = db.Column(db.Text)
    source = db.Column(db.String(128))  # where they came from
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class LinkView(db.Model):
    """Track unique views for social proof"""
    id = db.Column(db.Integer, primary_key=True)
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=False)
    visitor_id = db.Column(db.String(128))  # unique visitor identifier
    viewed_at = db.Column(db.DateTime, default=datetime.utcnow)
