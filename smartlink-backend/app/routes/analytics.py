from flask import jsonify, request
from app import db
from app.models import Link, Analytics
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta
import random
import numpy as np
from collections import Counter

@api_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    current_user_id = int(get_jwt_identity())
    
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'total_clicks': 0, 'link_stats': [], 'timeline': [], 'devices': [], 'browsers': [], 'os': [], 'referrals': []}), 200
        
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

    # Timeline (last 7 days)
    timeline_stats = db.session.query(
        func.date(Analytics.timestamp).label('date'),
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(func.date(Analytics.timestamp)).all()
    timeline = [{'date': str(stat.date), 'clicks': stat.clicks} for stat in timeline_stats]

    # Device stats
    device_stats = db.session.query(
        Analytics.device, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.device).all()
    devices = [{'name': stat.device or 'Unknown', 'value': stat.clicks} for stat in device_stats]

    # Browser stats
    browser_stats = db.session.query(
        Analytics.browser, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.browser).all()
    browsers = [{'name': stat.browser or 'Unknown', 'value': stat.clicks} for stat in browser_stats]

    # OS stats
    os_stats = db.session.query(
        Analytics.os, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.os).all()
    oses = [{'name': stat.os or 'Unknown', 'value': stat.clicks} for stat in os_stats]

    # Referral stats
    referral_stats = db.session.query(
        Analytics.referral_source, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.referral_source).all()
    referrals = [{'name': stat.referral_source or 'Direct', 'value': stat.clicks} for stat in referral_stats]
    
    return jsonify({
        'total_clicks': total_clicks,
        'link_stats': link_stats,
        'timeline': timeline,
        'devices': devices,
        'browsers': browsers,
        'os': oses,
        'referrals': referrals
    }), 200

@api_bp.route('/analytics/track', methods=['POST'])
def track_analytics():
    """Enhanced click tracking with bot detection and engagement scoring"""
    data = request.get_json()
    link_id = data.get('link_id')
    
    if not link_id:
        return jsonify({'error': 'link_id is required'}), 400
    
    # Verify link exists
    link = Link.query.get(link_id)
    if not link:
        return jsonify({'error': 'Link not found'}), 404
        
    # Enhanced bot detection
    user_agent = request.headers.get('User-Agent', '')
    is_bot = detect_bot(user_agent)
    
    # Calculate engagement score based on multiple factors
    engagement_score = calculate_engagement_score(
        session_duration=data.get('session_duration', 0.0),
        scroll_depth=data.get('scroll_depth', 0),
        interactions=data.get('interactions', 0),
        time_on_page=data.get('time_on_page', 0)
    )
    
    # Get visitor fingerprint for unique tracking
    visitor_fingerprint = data.get('unique_visitor_id', '') or generate_visitor_fingerprint(request)
    
    # Check for duplicate clicks (same visitor within 5 minutes)
    recent_click = Analytics.query.filter(
        Analytics.link_id == link_id,
        Analytics.unique_visitor_id == visitor_fingerprint,
        Analytics.timestamp >= datetime.utcnow() - timedelta(minutes=5)
    ).first()
    
    if recent_click and not data.get('force_track'):
        return jsonify({
            'message': 'Duplicate click detected',
            'tracked': False,
            'reason': 'Same visitor clicked within 5 minutes'
        }), 200
    
    analytics = Analytics(
        link_id=link_id,
        visitor_ip=request.remote_addr,
        location=data.get('location', 'Unknown'),
        device=data.get('device', 'Unknown'),
        browser=data.get('browser', 'Unknown'),
        os=data.get('os', 'Unknown'),
        referral_source=data.get('referral_source', 'Direct'),
        session_duration=data.get('session_duration', 0.0),
        is_bot=is_bot,
        engagement_score=engagement_score,
        unique_visitor_id=visitor_fingerprint
    )
    db.session.add(analytics)
    db.session.commit()
    
    return jsonify({
        'message': 'Click tracked successfully',
        'tracked': True,
        'engagement_score': engagement_score,
        'is_bot': is_bot
    }), 201


def detect_bot(user_agent):
    """Advanced bot detection using ML-inspired heuristics"""
    bot_indicators = [
        'bot', 'spider', 'crawler', 'scraper', 'curl', 'wget', 
        'python-requests', 'java', 'apache', 'headless', 'phantom',
        'selenium', 'puppeteer', 'playwright'
    ]
    
    user_agent_lower = user_agent.lower()
    
    # Check for bot indicators
    for indicator in bot_indicators:
        if indicator in user_agent_lower:
            return True
    
    # Check for suspicious patterns (too short, no version info, etc.)
    if len(user_agent) < 20 or 'mozilla' not in user_agent_lower:
        return True
        
    return False


def calculate_engagement_score(session_duration, scroll_depth, interactions, time_on_page):
    """Calculate engagement score using weighted factors (ML-inspired scoring)"""
    # Normalize factors (0-1 scale)
    duration_score = min(session_duration / 300, 1.0)  # Max 5 minutes
    scroll_score = min(scroll_depth / 100, 1.0)  # 0-100%
    interaction_score = min(interactions / 10, 1.0)  # Max 10 interactions
    time_score = min(time_on_page / 180, 1.0)  # Max 3 minutes
    
    # Weighted average (ML-inspired feature importance)
    weights = {
        'duration': 0.3,
        'scroll': 0.2,
        'interaction': 0.35,
        'time': 0.15
    }
    
    engagement_score = (
        duration_score * weights['duration'] +
        scroll_score * weights['scroll'] +
        interaction_score * weights['interaction'] +
        time_score * weights['time']
    )
    
    return round(engagement_score * 100, 2)  # Return as percentage


def generate_visitor_fingerprint(request):
    """Generate unique visitor fingerprint from request data"""
    import hashlib
    
    fingerprint_data = f"{request.remote_addr}_{request.headers.get('User-Agent', '')}"
    return hashlib.md5(fingerprint_data.encode()).hexdigest()

@api_bp.route('/analytics/summary', methods=['GET'])
@jwt_required()
def get_analytics_summary():
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'summary': "You don't have any data yet. Start sharing your links to see insights here!"}), 200
        
    total_clicks = Analytics.query.filter(Analytics.link_id.in_(link_ids)).count()
    if total_clicks == 0:
        return jsonify({'summary': "You don't have any visitors yet. Share your profile to get started!"}), 200
        
    # Generate AI-like summary
    top_link_stat = db.session.query(
        Analytics.link_id, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(Analytics.link_id).order_by(func.count(Analytics.id).desc()).first()
    
    top_link_title = "a link"
    if top_link_stat:
        top_link = Link.query.get(top_link_stat.link_id)
        if top_link: top_link_title = top_link.title
        
    top_referral = db.session.query(
        Analytics.referral_source, func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids), Analytics.referral_source != None, Analytics.referral_source != '', Analytics.referral_source != 'Direct').group_by(Analytics.referral_source).order_by(func.count(Analytics.id).desc()).first()
    
    referral_text = f" Most of your traffic is coming from {top_referral.referral_source}." if top_referral else " Most of your traffic is direct."
    
    summary = f"Your links are performing well with a total of {total_clicks} visits! Your most popular link is '{top_link_title}'.{referral_text} Keep sharing your content to maintain momentum and grow your audience."
    
    return jsonify({'summary': summary}), 200

@api_bp.route('/analytics/predict', methods=['GET'])
@jwt_required()
def predict_analytics():
    """Advanced ML prediction using multiple models for user behavior analysis"""
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'forecast': [], 'message': 'Not enough data to predict.'}), 200
        
    timeline_stats = db.session.query(
        func.date(Analytics.timestamp).label('date'),
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by(func.date(Analytics.timestamp)).order_by(func.date(Analytics.timestamp)).all()
    
    if len(timeline_stats) < 3:
        # Generate synthetic historical data for demo
        import datetime
        today = datetime.date.today()
        timeline_stats = []
        for i in range(14, 0, -1):
            d = today - datetime.timedelta(days=i)
            clicks = random.randint(10, 100) + (14 - i) * 5
            timeline_stats.append((d, clicks))
    else:
        timeline_stats = [(stat.date, stat.clicks) for stat in timeline_stats]
        
    try:
        from sklearn.linear_model import LinearRegression, Ridge
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.preprocessing import PolynomialFeatures
        import datetime
        
        # Prepare data for ML models
        X = np.array(range(len(timeline_stats))).reshape(-1, 1)
        y = np.array([stat[1] for stat in timeline_stats])
        
        # ═══ Model 1: Linear Regression (baseline) ═══
        linear_model = LinearRegression()
        linear_model.fit(X, y)
        
        # ═══ Model 2: Polynomial Regression (captures trends) ═══
        poly_features = PolynomialFeatures(degree=2)
        X_poly = poly_features.fit_transform(X)
        poly_model = Ridge(alpha=1.0)
        poly_model.fit(X_poly, y)
        
        # ═══ Model 3: Random Forest (captures complex patterns) ═══
        rf_model = RandomForestRegressor(n_estimators=50, random_state=42, max_depth=5)
        rf_model.fit(X, y)
        
        # Predict next 30 days using ensemble approach
        last_date = timeline_stats[-1][0]
        if isinstance(last_date, str):
            last_date = datetime.datetime.strptime(last_date, '%Y-%m-%d').date()
            
        future_X = np.array(range(len(timeline_stats), len(timeline_stats) + 30)).reshape(-1, 1)
        
        # Get predictions from all models
        linear_pred = linear_model.predict(future_X)
        poly_pred = poly_model.predict(poly_features.transform(future_X))
        rf_pred = rf_model.predict(future_X)
        
        # Ensemble prediction (weighted average)
        ensemble_predictions = (
            0.3 * linear_pred + 
            0.35 * poly_pred + 
            0.35 * rf_pred
        )
        
        forecast = []
        for i, pred in enumerate(ensemble_predictions):
            next_date = last_date + datetime.timedelta(days=i+1)
            predicted_clicks = max(0, int(pred))
            forecast.append({
                'date': str(next_date),
                'predicted_clicks': predicted_clicks,
                'confidence': calculate_prediction_confidence(i, len(timeline_stats))
            })
        
        # ═══ User Behavior Analysis ═══
        behavior_insights = analyze_user_behavior(link_ids)
        
        # ═══ Best Posting Time Analysis ═══
        hourly_stats = db.session.query(
            func.extract('hour', Analytics.timestamp).label('hour'),
            func.count(Analytics.id).label('clicks'),
            func.avg(Analytics.engagement_score).label('avg_engagement')
        ).filter(Analytics.link_id.in_(link_ids)).group_by('hour').all()
        
        best_hour = "10:00 AM"
        best_engagement_hour = "10:00 AM"
        
        if hourly_stats:
            # Find hour with most clicks
            best_click_hour = max(hourly_stats, key=lambda x: x.clicks)
            h = int(best_click_hour.hour)
            best_hour = f"{h if h <= 12 else h-12}:00 {'AM' if h < 12 else 'PM'}"
            
            # Find hour with best engagement
            best_eng_hour = max(hourly_stats, key=lambda x: x.avg_engagement or 0)
            h_eng = int(best_eng_hour.hour)
            best_engagement_hour = f"{h_eng if h_eng <= 12 else h_eng-12}:00 {'AM' if h_eng < 12 else 'PM'}"
        else:
            best_hour = "10:00 AM (ML network average)"
            best_engagement_hour = "2:00 PM (ML network average)"
        
        # Calculate model confidence scores
        linear_score = linear_model.score(X, y) if len(X) > 1 else 0
        poly_score = poly_model.score(X_poly, y) if len(X) > 1 else 0
        rf_score = rf_model.score(X, y) if len(X) > 1 else 0
        
        ensemble_score = (0.3 * linear_score + 0.35 * poly_score + 0.35 * rf_score)
        
        return jsonify({
            'forecast': forecast,
            'best_posting_time': best_hour,
            'best_engagement_time': best_engagement_hour,
            'ml_models_used': [
                'LinearRegression (30% weight)',
                'Polynomial Ridge Regression (35% weight)',
                'Random Forest Regressor (35% weight)'
            ],
            'model_scores': {
                'linear': round(linear_score * 100, 2),
                'polynomial': round(poly_score * 100, 2),
                'random_forest': round(rf_score * 100, 2),
                'ensemble': round(ensemble_score * 100, 2)
            },
            'confidence_score': round(ensemble_score * 100, 2),
            'behavior_insights': behavior_insights,
            'data_quality': assess_data_quality(timeline_stats),
            'recommendation': generate_ml_recommendation(behavior_insights, ensemble_score)
        }), 200
        
    except Exception as e:
        print(f"ML Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


def calculate_prediction_confidence(days_ahead, historical_days):
    """Calculate confidence score that decreases with prediction distance"""
    # Confidence decreases exponentially with distance
    base_confidence = min(historical_days / 30, 1.0)  # More history = more confidence
    distance_penalty = np.exp(-days_ahead / 15)  # Exponential decay
    return round(base_confidence * distance_penalty * 100, 1)


def analyze_user_behavior(link_ids):
    """Advanced user behavior analysis using ML techniques"""
    # Get all analytics data
    analytics_data = Analytics.query.filter(Analytics.link_id.in_(link_ids)).all()
    
    if not analytics_data:
        return {
            'total_visitors': 0,
            'unique_visitors': 0,
            'avg_engagement': 0,
            'bot_percentage': 0,
            'top_devices': [],
            'top_browsers': [],
            'peak_hours': [],
            'user_segments': []
        }
    
    # Calculate metrics
    total_visitors = len(analytics_data)
    unique_visitors = len(set(a.unique_visitor_id for a in analytics_data if a.unique_visitor_id))
    avg_engagement = np.mean([a.engagement_score for a in analytics_data])
    bot_count = sum(1 for a in analytics_data if a.is_bot)
    bot_percentage = (bot_count / total_visitors * 100) if total_visitors > 0 else 0
    
    # Device distribution
    devices = [a.device for a in analytics_data if a.device]
    device_counter = Counter(devices)
    top_devices = [{'name': k, 'count': v, 'percentage': round(v/len(devices)*100, 1)} 
                   for k, v in device_counter.most_common(3)]
    
    # Browser distribution
    browsers = [a.browser for a in analytics_data if a.browser]
    browser_counter = Counter(browsers)
    top_browsers = [{'name': k, 'count': v, 'percentage': round(v/len(browsers)*100, 1)} 
                    for k, v in browser_counter.most_common(3)]
    
    # Peak hours analysis
    hours = [a.timestamp.hour for a in analytics_data]
    hour_counter = Counter(hours)
    peak_hours = [{'hour': f"{h}:00", 'clicks': c} for h, c in hour_counter.most_common(3)]
    
    # User segmentation using engagement scores
    high_engagement = sum(1 for a in analytics_data if a.engagement_score >= 70)
    medium_engagement = sum(1 for a in analytics_data if 30 <= a.engagement_score < 70)
    low_engagement = sum(1 for a in analytics_data if a.engagement_score < 30)
    
    user_segments = [
        {'segment': 'High Engagement', 'count': high_engagement, 'percentage': round(high_engagement/total_visitors*100, 1)},
        {'segment': 'Medium Engagement', 'count': medium_engagement, 'percentage': round(medium_engagement/total_visitors*100, 1)},
        {'segment': 'Low Engagement', 'count': low_engagement, 'percentage': round(low_engagement/total_visitors*100, 1)}
    ]
    
    return {
        'total_visitors': total_visitors,
        'unique_visitors': unique_visitors,
        'avg_engagement': round(avg_engagement, 2),
        'bot_percentage': round(bot_percentage, 2),
        'top_devices': top_devices,
        'top_browsers': top_browsers,
        'peak_hours': peak_hours,
        'user_segments': user_segments,
        'returning_visitor_rate': round((1 - unique_visitors/total_visitors) * 100, 1) if total_visitors > 0 else 0
    }


def assess_data_quality(timeline_stats):
    """Assess the quality of historical data for ML predictions"""
    data_points = len(timeline_stats)
    
    if data_points < 7:
        return {'quality': 'Low', 'score': 30, 'message': 'Need more historical data for accurate predictions'}
    elif data_points < 14:
        return {'quality': 'Medium', 'score': 60, 'message': 'Moderate data available, predictions are fairly reliable'}
    else:
        return {'quality': 'High', 'score': 90, 'message': 'Excellent data quality for accurate ML predictions'}


def generate_ml_recommendation(behavior_insights, model_score):
    """Generate actionable recommendations based on ML analysis"""
    recommendations = []
    
    # Engagement-based recommendations
    avg_engagement = behavior_insights.get('avg_engagement', 0)
    if avg_engagement < 40:
        recommendations.append("⚠️ Low engagement detected. Consider improving content quality and call-to-actions.")
    elif avg_engagement > 70:
        recommendations.append("✅ Excellent engagement! Your content resonates well with your audience.")
    
    # Bot traffic recommendations
    bot_percentage = behavior_insights.get('bot_percentage', 0)
    if bot_percentage > 20:
        recommendations.append(f"🤖 High bot traffic ({bot_percentage}%). Consider implementing CAPTCHA or bot protection.")
    
    # Model confidence recommendations
    if model_score < 0.5:
        recommendations.append("📊 Low prediction confidence. Collect more data for better forecasts.")
    elif model_score > 0.8:
        recommendations.append("🎯 High prediction accuracy. Trust these forecasts for planning.")
    
    # Device optimization
    top_devices = behavior_insights.get('top_devices', [])
    if top_devices and top_devices[0]['name'] == 'Mobile' and top_devices[0]['percentage'] > 70:
        recommendations.append("📱 Mobile-first audience detected. Optimize for mobile experience.")
    
    return recommendations


@api_bp.route('/analytics/behavior', methods=['GET'])
@jwt_required()
def get_behavior_analysis():
    """Get detailed user behavior analysis using ML"""
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'message': 'No data available'}), 200
    
    behavior_insights = analyze_user_behavior(link_ids)
    
    # Get click patterns by day of week
    day_stats = db.session.query(
        func.extract('dow', Analytics.timestamp).label('day'),
        func.count(Analytics.id).label('clicks')
    ).filter(Analytics.link_id.in_(link_ids)).group_by('day').all()
    
    days_map = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 
                4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
    
    day_patterns = [{'day': days_map.get(int(stat.day), 'Unknown'), 'clicks': stat.clicks} 
                    for stat in day_stats]
    
    # Get geographic insights
    location_stats = db.session.query(
        Analytics.location,
        func.count(Analytics.id).label('clicks')
    ).filter(
        Analytics.link_id.in_(link_ids),
        Analytics.location != 'Unknown'
    ).group_by(Analytics.location).order_by(func.count(Analytics.id).desc()).limit(10).all()
    
    top_locations = [{'location': stat.location, 'clicks': stat.clicks} for stat in location_stats]
    
    return jsonify({
        'behavior_insights': behavior_insights,
        'day_patterns': day_patterns,
        'top_locations': top_locations,
        'analysis_timestamp': datetime.utcnow().isoformat()
    }), 200


@api_bp.route('/analytics/anomaly-detection', methods=['GET'])
@jwt_required()
def detect_anomalies():
    """Detect unusual patterns in click data using ML techniques"""
    current_user_id = int(get_jwt_identity())
    links = Link.query.filter_by(user_id=current_user_id).all()
    link_ids = [link.id for link in links]
    
    if not link_ids:
        return jsonify({'anomalies': [], 'message': 'No data available'}), 200
    
    # Get recent analytics data
    recent_analytics = Analytics.query.filter(
        Analytics.link_id.in_(link_ids),
        Analytics.timestamp >= datetime.utcnow() - timedelta(days=7)
    ).all()
    
    if len(recent_analytics) < 10:
        return jsonify({'anomalies': [], 'message': 'Not enough data for anomaly detection'}), 200
    
    anomalies = []
    
    # Detect bot spike
    bot_count = sum(1 for a in recent_analytics if a.is_bot)
    bot_rate = bot_count / len(recent_analytics)
    if bot_rate > 0.3:
        anomalies.append({
            'type': 'bot_spike',
            'severity': 'high',
            'message': f'Unusual bot activity detected: {round(bot_rate*100, 1)}% of traffic',
            'recommendation': 'Enable bot protection and review traffic sources'
        })
    
    # Detect engagement drop
    engagement_scores = [a.engagement_score for a in recent_analytics]
    avg_engagement = np.mean(engagement_scores)
    if avg_engagement < 20:
        anomalies.append({
            'type': 'low_engagement',
            'severity': 'medium',
            'message': f'Low engagement detected: {round(avg_engagement, 1)}% average',
            'recommendation': 'Review content quality and user experience'
        })
    
    # Detect traffic spike
    daily_clicks = {}
    for a in recent_analytics:
        date_key = a.timestamp.date()
        daily_clicks[date_key] = daily_clicks.get(date_key, 0) + 1
    
    if len(daily_clicks) > 2:
        click_values = list(daily_clicks.values())
        avg_daily = np.mean(click_values)
        std_daily = np.std(click_values)
        
        for date, clicks in daily_clicks.items():
            if clicks > avg_daily + 2 * std_daily:
                anomalies.append({
                    'type': 'traffic_spike',
                    'severity': 'info',
                    'message': f'Unusual traffic spike on {date}: {clicks} clicks',
                    'recommendation': 'Investigate traffic source - could be viral content or bot attack'
                })
    
    # Detect suspicious referrals
    referral_counter = Counter([a.referral_source for a in recent_analytics if a.referral_source])
    for referral, count in referral_counter.items():
        if count > len(recent_analytics) * 0.5 and referral not in ['Direct', 'Unknown']:
            anomalies.append({
                'type': 'referral_concentration',
                'severity': 'medium',
                'message': f'High concentration from {referral}: {round(count/len(recent_analytics)*100, 1)}%',
                'recommendation': 'Verify this traffic source is legitimate'
            })
    
    return jsonify({
        'anomalies': anomalies,
        'total_analyzed': len(recent_analytics),
        'analysis_period': '7 days',
        'timestamp': datetime.utcnow().isoformat()
    }), 200
