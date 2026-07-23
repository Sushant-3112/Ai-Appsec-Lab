from flask import request, jsonify, url_for, current_app
from app import db
from app.models import User, Link, Analytics, LinkView, Product
from datetime import datetime
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename

@api_bp.route('/profile/<username>', methods=['GET'])
def get_public_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'Profile not found'}), 404
        
    now = datetime.utcnow()
    # Filter active links and handle scheduling
    links = Link.query.filter_by(user_id=user.id, is_active=True).all()
    
    filtered_links = []
    for link in links:
        # Check start date
        if link.scheduled_start and link.scheduled_start > now:
            continue
        # Check end date
        if link.scheduled_end and link.scheduled_end < now:
            continue
        filtered_links.append(link)
    
    # Sort by pinned, then priority, then order
    filtered_links.sort(key=lambda x: (x.is_pinned, x.priority, -x.order), reverse=True)
    
    # Get products
    products = Product.query.filter_by(user_id=user.id).all()
    
    return jsonify({
        'username': user.username,
        'full_name': user.full_name,
        'bio': user.bio,
        'avatar': user.avatar,
        'theme_config': user.theme_config,
        'links': [{
            'id': link.id,
            'title': link.title,
            'url': link.url,
            'type': link.type,
            'animation': link.animation,
            'thumbnail': link.thumbnail,
            'is_pinned': link.is_pinned,
            'has_password': bool(link.password),
            'category': link.category,
            'show_view_count': link.show_view_count,
            'view_count': LinkView.query.filter_by(link_id=link.id).count() if link.show_view_count else 0
        } for link in filtered_links],
        'products': [{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'file_url': p.file_url,
            'image_url': p.image_url
        } for p in products]
    }), 200

@api_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    data = request.get_json()
    if 'full_name' in data: user.full_name = data['full_name']
    if 'bio' in data: user.bio = data['bio']
    if 'avatar' in data: user.avatar = data['avatar']
    if 'theme_config' in data: user.theme_config = data['theme_config']
    
    db.session.commit()
    return jsonify({'message': 'Profile updated'}), 200

@api_bp.route('/links/<int:link_id>/click', methods=['POST'])
def track_click(link_id):
    link = Link.query.get(link_id)
    if not link:
        return jsonify({'message': 'Link not found'}), 404
        
    device = request.user_agent.platform or 'unknown'
    ip = request.remote_addr
    
    analytics = Analytics(
        link_id=link.id,
        visitor_ip=ip,
        device=device
    )
    db.session.add(analytics)
    db.session.commit()
    
    return jsonify({'message': 'Click tracked'}), 200

@api_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        original_filename = secure_filename(file.filename)
        ext = os.path.splitext(original_filename)[1]
        if not ext:
            ext = '.png' # default fallback
            
        import uuid
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        
        # Ensure uploads directory exists
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Return the public URL
        file_url = f"{request.host_url}static/uploads/{unique_filename}"
        return jsonify({'url': file_url}), 200
