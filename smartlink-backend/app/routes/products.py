from flask import request, jsonify
from app import db
from app.models import Product
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity

@api_bp.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    current_user_id = int(get_jwt_identity())
    products = Product.query.filter_by(user_id=current_user_id).order_by(Product.created_at.desc()).all()
    
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'file_url': p.file_url,
        'image_url': p.image_url,
        'created_at': p.created_at.isoformat()
    } for p in products]), 200

@api_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'message': 'Missing name or price'}), 400
        
    product = Product(
        user_id=current_user_id,
        name=data['name'],
        description=data.get('description', ''),
        price=float(data['price']),
        file_url=data.get('file_url', ''),
        image_url=data.get('image_url', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({'message': 'Product created', 'id': product.id}), 201

@api_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user_id = int(get_jwt_identity())
    product = Product.query.filter_by(id=product_id, user_id=current_user_id).first()
    
    if not product:
        return jsonify({'message': 'Product not found'}), 404
        
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200
