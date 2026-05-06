from flask import request, jsonify
from app import db
from app.models import User
from app.routes import api_bp
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import requests

@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 400

    user = User(
        email=data['email'],
        username=data['username'],
        full_name=data.get('full_name', '')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': access_token, 
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@api_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def me():
    # In flask_jwt_extended 4.x, get_jwt_identity() returns the identity as it was saved.
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'bio': user.bio,
        'avatar': user.avatar,
        'theme_config': user.theme_config
    }), 200

@api_bp.route('/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')
    if not token:
        return jsonify({'message': 'No token provided'}), 400
        
    try:
        # Verify access token with Google
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )
        if not google_response.ok:
            return jsonify({'message': 'Invalid Google token'}), 401
            
        user_info = google_response.json()
        email = user_info.get('email')
        picture = user_info.get('picture', '')
        
        if not email:
            return jsonify({'message': 'Email not found in Google account'}), 400
            
        # Check if user exists, otherwise create
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                username=email.split('@')[0], # default username
                full_name=user_info.get('name', ''),
                avatar=picture
            )
            # Set a random password for oauth users
            import string
            import random
            random_pass = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
            user.set_password(random_pass)
            
            db.session.add(user)
        else:
            # Update missing info if they login via Google again
            if picture and not user.avatar:
                user.avatar = picture
            if not user.full_name and user_info.get('name'):
                user.full_name = user_info.get('name')
                
        db.session.commit()
            
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token, 
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
