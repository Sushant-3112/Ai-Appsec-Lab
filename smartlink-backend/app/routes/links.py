from flask import request, jsonify
from app import db
from app.models import Link
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity

@api_bp.route('/links', methods=['GET'])
@jwt_required()
def get_links():
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).order_by(Link.order).all()
    
    return jsonify([{
        'id': link.id,
        'title': link.title,
        'url': link.url,
        'type': link.type,
        'is_active': link.is_active,
        'order': link.order
    } for link in links]), 200

@api_bp.route('/links', methods=['POST'])
@jwt_required()
def create_link():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('url'):
        return jsonify({'message': 'Missing title or url'}), 400
        
    link = Link(
        user_id=current_user_id,
        title=data['title'],
        url=data['url'],
        type=data.get('type', 'link'),
        is_active=data.get('is_active', True),
        order=data.get('order', 0)
    )
    
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
    if 'is_active' in data: link.is_active = data['is_active']
    if 'order' in data: link.order = data['order']
    
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
