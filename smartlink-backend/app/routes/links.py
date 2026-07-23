from flask import request, jsonify
from app import db
from app.models import Link, Lead, LinkView
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import func

@api_bp.route('/links', methods=['GET'])
@jwt_required()
def get_links():
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).order_by(Link.is_pinned.desc(), Link.priority.desc(), Link.order).all()
    
    result = []
    for link in links:
        # Get view count for social proof
        view_count = LinkView.query.filter_by(link_id=link.id).count()
        click_count = link.analytics.count()
        
        result.append({
            'id': link.id,
            'title': link.title,
            'url': link.url,
            'type': link.type,
            'animation': link.animation,
            'thumbnail': link.thumbnail,
            'is_active': link.is_active,
            'order': link.order,
            'is_pinned': link.is_pinned,
            'custom_slug': link.custom_slug,
            'has_password': bool(link.password),
            'click_goal': link.click_goal,
            'show_view_count': link.show_view_count,
            'category': link.category,
            'priority': link.priority,
            'conversion_goal': link.conversion_goal,
            'ab_test_variant': link.ab_test_variant,
            'ab_test_group_id': link.ab_test_group_id,
            'scheduled_start': link.scheduled_start.isoformat() if link.scheduled_start else None,
            'scheduled_end': link.scheduled_end.isoformat() if link.scheduled_end else None,
            'view_count': view_count,
            'click_count': click_count,
            'goal_progress': round((click_count / link.click_goal * 100), 1) if link.click_goal > 0 else 0
        })
    
    return jsonify(result), 200

@api_bp.route('/links', methods=['POST'])
@jwt_required()
def create_link():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('title'):
        return jsonify({'message': 'Missing title'}), 400
        
    link = Link(
        user_id=current_user_id,
        title=data['title'],
        url=data.get('url', ''),
        type=data.get('type', 'link'),
        animation=data.get('animation', ''),
        thumbnail=data.get('thumbnail', ''),
        is_active=data.get('is_active', True),
        order=data.get('order', 0),
        is_pinned=data.get('is_pinned', False),
        custom_slug=data.get('custom_slug'),
        click_goal=data.get('click_goal', 0),
        show_view_count=data.get('show_view_count', False),
        category=data.get('category'),
        priority=data.get('priority', 0),
        conversion_goal=data.get('conversion_goal'),
        ab_test_variant=data.get('ab_test_variant'),
        ab_test_group_id=data.get('ab_test_group_id')
    )
    
    # Handle password protection
    if data.get('password'):
        link.password = generate_password_hash(data['password'])
    
    # Handle scheduling
    if data.get('scheduled_start'):
        link.scheduled_start = datetime.fromisoformat(data['scheduled_start'].replace('Z', '+00:00'))
    if data.get('scheduled_end'):
        link.scheduled_end = datetime.fromisoformat(data['scheduled_end'].replace('Z', '+00:00'))
    
    db.session.add(link)
    db.session.commit()
    
    return jsonify({'message': 'Link created', 'id': link.id}), 201

@api_bp.route('/links/<int:link_id>', methods=['PUT'])
@jwt_required()
def update_link(link_id):
    current_user_id = int(get_jwt_identity())
    link = Link.query.filter_by(id=link_id, user_id=current_user_id).first()
    
    if not link:
        return jsonify({'message': 'Link not found'}), 404
        
    data = request.get_json()
    if 'title' in data: link.title = data['title']
    if 'url' in data: link.url = data['url']
    if 'type' in data: link.type = data['type']
    if 'animation' in data: link.animation = data['animation']
    if 'thumbnail' in data: link.thumbnail = data['thumbnail']
    if 'is_active' in data: link.is_active = data['is_active']
    if 'order' in data: link.order = data['order']
    if 'is_pinned' in data: link.is_pinned = data['is_pinned']
    if 'custom_slug' in data: link.custom_slug = data['custom_slug']
    if 'click_goal' in data: link.click_goal = data['click_goal']
    if 'show_view_count' in data: link.show_view_count = data['show_view_count']
    if 'category' in data: link.category = data['category']
    if 'priority' in data: link.priority = data['priority']
    if 'conversion_goal' in data: link.conversion_goal = data['conversion_goal']
    if 'ab_test_variant' in data: link.ab_test_variant = data['ab_test_variant']
    if 'ab_test_group_id' in data: link.ab_test_group_id = data['ab_test_group_id']
    
    if 'password' in data:
        if data['password']:
            link.password = generate_password_hash(data['password'])
        else:
            link.password = None
    
    if 'scheduled_start' in data:
        link.scheduled_start = datetime.fromisoformat(data['scheduled_start'].replace('Z', '+00:00')) if data['scheduled_start'] else None
    if 'scheduled_end' in data:
        link.scheduled_end = datetime.fromisoformat(data['scheduled_end'].replace('Z', '+00:00')) if data['scheduled_end'] else None
    
    db.session.commit()
    return jsonify({'message': 'Link updated'}), 200

@api_bp.route('/links/<int:link_id>', methods=['DELETE'])
@jwt_required()
def delete_link(link_id):
    current_user_id = int(get_jwt_identity())
    link = Link.query.filter_by(id=link_id, user_id=current_user_id).first()
    
    if not link:
        return jsonify({'message': 'Link not found'}), 404
        
    db.session.delete(link)
    db.session.commit()
    return jsonify({'message': 'Link deleted'}), 200

@api_bp.route('/links/<int:link_id>/verify-password', methods=['POST'])
def verify_link_password(link_id):
    """Verify password for protected link"""
    link = Link.query.get(link_id)
    if not link or not link.password:
        return jsonify({'valid': True}), 200
    
    data = request.get_json()
    password = data.get('password', '')
    
    if check_password_hash(link.password, password):
        return jsonify({'valid': True}), 200
    return jsonify({'valid': False}), 401

@api_bp.route('/links/<int:link_id>/view', methods=['POST'])
def track_link_view(link_id):
    """Track link view for social proof"""
    link = Link.query.get(link_id)
    if not link:
        return jsonify({'error': 'Link not found'}), 404
    
    data = request.get_json()
    visitor_id = data.get('visitor_id', '')
    
    # Check if this visitor already viewed this link recently (within 24 hours)
    from datetime import timedelta
    recent_view = LinkView.query.filter_by(
        link_id=link_id,
        visitor_id=visitor_id
    ).filter(
        LinkView.viewed_at >= datetime.utcnow() - timedelta(hours=24)
    ).first()
    
    if not recent_view:
        view = LinkView(link_id=link_id, visitor_id=visitor_id)
        db.session.add(view)
        db.session.commit()
    
    view_count = LinkView.query.filter_by(link_id=link_id).count()
    return jsonify({'view_count': view_count}), 200

@api_bp.route('/links/<int:link_id>/leads', methods=['POST'])
def collect_lead(link_id):
    """Collect email lead from link interaction"""
    link = Link.query.get(link_id)
    if not link:
        return jsonify({'error': 'Link not found'}), 404
    
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    lead = Lead(
        link_id=link_id,
        user_id=link.user_id,
        email=email,
        name=data.get('name'),
        phone=data.get('phone'),
        message=data.get('message'),
        source=data.get('source', 'link')
    )
    
    db.session.add(lead)
    db.session.commit()
    
    return jsonify({'message': 'Lead collected successfully'}), 201

@api_bp.route('/leads', methods=['GET'])
@jwt_required()
def get_leads():
    """Get all leads for current user"""
    current_user_id = int(get_jwt_identity())
    leads = Lead.query.filter_by(user_id=current_user_id).order_by(Lead.created_at.desc()).all()
    
    return jsonify([{
        'id': lead.id,
        'link_id': lead.link_id,
        'email': lead.email,
        'name': lead.name,
        'phone': lead.phone,
        'message': lead.message,
        'source': lead.source,
        'created_at': lead.created_at.isoformat()
    } for lead in leads]), 200

@api_bp.route('/links/categories', methods=['GET'])
@jwt_required()
def get_link_categories():
    """Get all unique categories for current user's links"""
    current_user_id = int(get_jwt_identity())
    categories = db.session.query(Link.category).filter(
        Link.user_id == current_user_id,
        Link.category != None,
        Link.category != ''
    ).distinct().all()
    
    return jsonify([cat[0] for cat in categories]), 200
