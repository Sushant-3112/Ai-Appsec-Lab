from flask import jsonify
from app import db
from app.models import Link, Analytics
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

@api_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    current_user_id = int(get_jwt_identity())
    
    # Get all links for user
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'total_clicks': 0, 'link_stats': []}), 200
        
    # Total clicks across all links
    total_clicks = Analytics.query.filter(Analytics.link_id.in_(link_ids)).count()
    
    # Clicks per link
    stats = db.session.query(
        Analytics.link_id, 
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.link_id).all()
    
    stats_dict = {stat.link_id: stat.clicks for stat in stats}
    
    link_stats = [{
        'link_id': link.id,
        'title': link.title,
        'url': link.url,
        'clicks': stats_dict.get(link.id, 0)
    } for link in links]
    
    return jsonify({
        'total_clicks': total_clicks,
        'link_stats': link_stats
    }), 200
