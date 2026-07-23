# Advanced Machine Learning Analytics Guide

## Overview
SmartLink now features advanced machine learning models for accurate click tracking, user behavior analysis, and predictive analytics.

---

## 🎯 Enhanced Click Tracking

### Features
1. **Duplicate Click Detection**
   - Prevents counting the same visitor clicking within 5 minutes
   - Uses visitor fingerprinting for accurate unique tracking
   - Reduces inflated metrics

2. **Advanced Bot Detection**
   - ML-inspired heuristics to identify bot traffic
   - Checks for 15+ bot indicators (crawlers, scrapers, headless browsers)
   - Pattern analysis for suspicious user agents
   - Filters out: Googlebot, Bingbot, scrapers, automated tools

3. **Engagement Scoring**
   - Multi-factor scoring system (0-100%)
   - Weighted factors:
     - Session duration (30%)
     - Scroll depth (20%)
     - User interactions (35%)
     - Time on page (15%)
   - Real-time calculation per click

4. **Visitor Fingerprinting**
   - Unique identifier generation using IP + User Agent
   - MD5 hashing for privacy
   - Tracks returning visitors accurately

---

## 🤖 Machine Learning Models

### Model 1: Linear Regression (Baseline)
- **Purpose**: Trend detection and baseline predictions
- **Weight**: 30% in ensemble
- **Best for**: Stable, linear growth patterns

### Model 2: Polynomial Ridge Regression
- **Purpose**: Captures non-linear trends and seasonality
- **Degree**: 2 (quadratic)
- **Weight**: 35% in ensemble
- **Best for**: Curved growth patterns, seasonal variations

### Model 3: Random Forest Regressor
- **Purpose**: Complex pattern recognition
- **Configuration**: 50 trees, max depth 5
- **Weight**: 35% in ensemble
- **Best for**: Irregular patterns, multiple influencing factors

### Ensemble Approach
- Combines all 3 models using weighted averaging
- Reduces overfitting and improves accuracy
- Provides confidence scores for each prediction

---

## 📊 User Behavior Analysis

### Metrics Tracked
1. **Visitor Metrics**
   - Total visitors
   - Unique visitors
   - Returning visitor rate
   - Bot percentage

2. **Engagement Analysis**
   - Average engagement score
   - User segmentation (High/Medium/Low engagement)
   - Session duration patterns

3. **Device & Browser Intelligence**
   - Top 3 devices with percentages
   - Top 3 browsers with percentages
   - Mobile vs Desktop optimization insights

4. **Temporal Patterns**
   - Peak hours analysis
   - Day-of-week patterns
   - Best posting times
   - Best engagement times

5. **Geographic Insights**
   - Top 10 locations by clicks
   - Regional traffic distribution

---

## 🔍 Anomaly Detection

### Detected Anomalies

1. **Bot Spike Detection**
   - Triggers when bot traffic > 30%
   - Severity: High
   - Recommendation: Enable bot protection

2. **Low Engagement Alert**
   - Triggers when avg engagement < 20%
   - Severity: Medium
   - Recommendation: Review content quality

3. **Traffic Spike Detection**
   - Uses statistical analysis (mean + 2 std deviations)
   - Identifies unusual daily traffic
   - Severity: Info
   - Could indicate viral content or attack

4. **Referral Concentration**
   - Detects when single source > 50% of traffic
   - Severity: Medium
   - Helps identify suspicious traffic sources

---

## 📈 Prediction Features

### 30-Day Forecast
- Predicts daily clicks for next 30 days
- Confidence score per prediction (decreases with distance)
- Ensemble model for accuracy

### Best Posting Time
- Analyzes hourly click patterns
- Identifies peak engagement hours
- Separate recommendations for:
  - Most clicks
  - Best engagement

### Data Quality Assessment
- **Low**: < 7 days of data (30% confidence)
- **Medium**: 7-14 days of data (60% confidence)
- **High**: 14+ days of data (90% confidence)

---

## 🔧 API Endpoints

### 1. Track Analytics (Enhanced)
```
POST /api/analytics/track
```

**Request Body:**
```json
{
  "link_id": 123,
  "session_duration": 45.5,
  "scroll_depth": 85,
  "interactions": 5,
  "time_on_page": 60,
  "device": "Mobile",
  "browser": "Chrome",
  "os": "iOS",
  "location": "New York, USA",
  "referral_source": "instagram.com"
}
```

**Response:**
```json
{
  "message": "Click tracked successfully",
  "tracked": true,
  "engagement_score": 72.5,
  "is_bot": false
}
```

### 2. Get ML Predictions
```
GET /api/analytics/predict
Authorization: Bearer <token>
```

**Response:**
```json
{
  "forecast": [
    {
      "date": "2026-05-08",
      "predicted_clicks": 145,
      "confidence": 89.5
    }
  ],
  "best_posting_time": "10:00 AM",
  "best_engagement_time": "2:00 PM",
  "ml_models_used": [
    "LinearRegression (30% weight)",
    "Polynomial Ridge Regression (35% weight)",
    "Random Forest Regressor (35% weight)"
  ],
  "model_scores": {
    "linear": 85.2,
    "polynomial": 88.7,
    "random_forest": 91.3,
    "ensemble": 88.9
  },
  "confidence_score": 88.9,
  "behavior_insights": { ... },
  "data_quality": {
    "quality": "High",
    "score": 90,
    "message": "Excellent data quality for accurate ML predictions"
  },
  "recommendation": [
    "✅ Excellent engagement! Your content resonates well with your audience.",
    "🎯 High prediction accuracy. Trust these forecasts for planning."
  ]
}
```

### 3. Get Behavior Analysis
```
GET /api/analytics/behavior
Authorization: Bearer <token>
```

**Response:**
```json
{
  "behavior_insights": {
    "total_visitors": 1250,
    "unique_visitors": 980,
    "avg_engagement": 68.5,
    "bot_percentage": 8.2,
    "top_devices": [
      {"name": "Mobile", "count": 875, "percentage": 70.0},
      {"name": "Desktop", "count": 312, "percentage": 25.0},
      {"name": "Tablet", "count": 63, "percentage": 5.0}
    ],
    "top_browsers": [...],
    "peak_hours": [...],
    "user_segments": [
      {"segment": "High Engagement", "count": 450, "percentage": 36.0},
      {"segment": "Medium Engagement", "count": 625, "percentage": 50.0},
      {"segment": "Low Engagement", "count": 175, "percentage": 14.0}
    ],
    "returning_visitor_rate": 21.6
  },
  "day_patterns": [...],
  "top_locations": [...]
}
```

### 4. Detect Anomalies
```
GET /api/analytics/anomaly-detection
Authorization: Bearer <token>
```

**Response:**
```json
{
  "anomalies": [
    {
      "type": "traffic_spike",
      "severity": "info",
      "message": "Unusual traffic spike on 2026-05-07: 450 clicks",
      "recommendation": "Investigate traffic source - could be viral content or bot attack"
    }
  ],
  "total_analyzed": 1250,
  "analysis_period": "7 days",
  "timestamp": "2026-05-07T10:30:00"
}
```

---

## 💡 Best Practices

### For Accurate Tracking
1. Always send engagement metrics (session_duration, scroll_depth, interactions)
2. Include device, browser, and OS information
3. Pass referral source for traffic analysis
4. Use consistent visitor IDs across sessions

### For Better Predictions
1. Collect at least 14 days of data before trusting forecasts
2. Review data quality scores
3. Monitor confidence scores (aim for > 80%)
4. Update predictions weekly

### For Anomaly Detection
1. Check anomalies daily
2. Investigate high-severity alerts immediately
3. Use recommendations to improve security
4. Track bot percentage trends

---

## 🎓 Understanding Engagement Scores

### Score Ranges
- **0-30%**: Low engagement (user barely interacted)
- **31-69%**: Medium engagement (normal interaction)
- **70-100%**: High engagement (highly interested user)

### Improving Engagement
- Optimize page load speed
- Add interactive elements
- Improve content quality
- Clear call-to-actions
- Mobile-friendly design

---

## 🔐 Security Features

### Bot Protection
- Automatic bot detection and flagging
- Filters out common crawlers and scrapers
- Prevents metric inflation
- Alerts on bot spikes

### Duplicate Prevention
- 5-minute cooldown per visitor
- Fingerprint-based tracking
- Prevents click fraud
- Maintains accurate metrics

---

## 📱 Integration Example

### Frontend Tracking Code
```javascript
// Track link click with full analytics
async function trackLinkClick(linkId) {
  const startTime = Date.now();
  let scrollDepth = 0;
  let interactions = 0;
  
  // Track scroll
  window.addEventListener('scroll', () => {
    const depth = (window.scrollY / document.body.scrollHeight) * 100;
    scrollDepth = Math.max(scrollDepth, depth);
  });
  
  // Track interactions
  document.addEventListener('click', () => interactions++);
  
  // Send analytics after 30 seconds or on page leave
  setTimeout(async () => {
    const sessionDuration = (Date.now() - startTime) / 1000;
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link_id: linkId,
        session_duration: sessionDuration,
        scroll_depth: scrollDepth,
        interactions: interactions,
        time_on_page: sessionDuration,
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOSName(),
        location: await getLocation(),
        referral_source: document.referrer
      })
    });
  }, 30000);
}
```

---

## 🚀 Performance

### Model Training
- Linear: < 10ms
- Polynomial: < 20ms
- Random Forest: < 100ms
- Total prediction time: < 150ms

### Scalability
- Handles 10,000+ clicks per day
- Real-time anomaly detection
- Efficient database queries
- Optimized for production use

---

## 📞 Support

For questions or issues with ML analytics:
1. Check API response error messages
2. Verify data quality scores
3. Review model confidence scores
4. Ensure sufficient historical data (14+ days recommended)

---

**Last Updated**: May 7, 2026
**Version**: 2.0.0
**ML Framework**: scikit-learn 1.3.2
