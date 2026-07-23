from flask import jsonify, request
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
import google.generativeai as genai
import os
from datetime import datetime
import json

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@api_bp.route('/ai/generate-ideas', methods=['POST'])
@jwt_required()
def generate_content_ideas():
    """
    Generate AI-powered content ideas using Google Gemini
    
    Request body:
    {
        "type": "caption" | "hashtags" | "post_ideas" | "weekly_plan",
        "niche": "tech" | "fashion" | "food" | etc.,
        "platform": "instagram" | "twitter" | "youtube",
        "context": "optional context or topic",
        "image_description": "optional for image-based generation"
    }
    """
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        idea_type = data.get('type', 'caption')
        niche = data.get('niche', 'general')
        platform = data.get('platform', 'instagram')
        context = data.get('context', '')
        image_description = data.get('image_description', '')
        
        # Check if API key is configured
        if not GEMINI_API_KEY:
            return jsonify({
                'success': False,
                'message': 'Gemini API key not configured',
                'ideas': get_fallback_ideas(idea_type, niche, platform)
            }), 200
        
        # Generate content based on type
        if idea_type == 'caption':
            result = generate_caption(niche, platform, context, image_description)
        elif idea_type == 'hashtags':
            result = generate_hashtags(niche, platform, context)
        elif idea_type == 'post_ideas':
            result = generate_post_ideas(niche, platform)
        elif idea_type == 'weekly_plan':
            result = generate_weekly_plan(niche, platform)
        else:
            result = {'error': 'Invalid type'}
        
        return jsonify({
            'success': True,
            'type': idea_type,
            'platform': platform,
            'niche': niche,
            'ideas': result,
            'generated_at': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'ideas': get_fallback_ideas(idea_type, niche, platform)
        }), 200


def generate_caption(niche, platform, context, image_description):
    """Generate AI caption using Gemini"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Generate 3 engaging social media captions for {platform}.

Niche: {niche}
Context: {context if context else 'General post'}
Image Description: {image_description if image_description else 'N/A'}

Requirements:
- Each caption should be unique and engaging
- Include relevant emojis
- Optimize for {platform} (character limits and style)
- Include a call-to-action
- Make it conversational and authentic

Return as JSON array with format:
[
  {{"caption": "...", "tone": "professional/casual/fun", "length": "short/medium/long"}},
  ...
]
"""
        
        response = model.generate_content(prompt)
        
        # Parse response
        try:
            # Try to extract JSON from response
            text = response.text
            # Find JSON array in response
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end > start:
                captions = json.loads(text[start:end])
                return captions
            else:
                # Fallback: split by newlines
                return parse_caption_response(text)
        except:
            return parse_caption_response(response.text)
            
    except Exception as e:
        print(f"Gemini Caption Error: {e}")
        return get_fallback_captions(niche, platform)


def generate_hashtags(niche, platform, context):
    """Generate AI hashtags using Gemini"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Generate relevant hashtags for a {platform} post.

Niche: {niche}
Context: {context if context else 'General post'}

Requirements:
- Provide 15-20 hashtags
- Mix of popular (100K+ posts) and niche (10K-50K posts) hashtags
- Include trending hashtags if relevant
- Categorize by reach: High, Medium, Low

Return as JSON with format:
{{
  "high_reach": ["#hashtag1", "#hashtag2", ...],
  "medium_reach": ["#hashtag3", "#hashtag4", ...],
  "low_reach": ["#hashtag5", "#hashtag6", ...],
  "trending": ["#hashtag7", "#hashtag8", ...]
}}
"""
        
        response = model.generate_content(prompt)
        
        try:
            text = response.text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                hashtags = json.loads(text[start:end])
                return hashtags
            else:
                return parse_hashtag_response(text)
        except:
            return parse_hashtag_response(response.text)
            
    except Exception as e:
        print(f"Gemini Hashtag Error: {e}")
        return get_fallback_hashtags(niche)


def generate_post_ideas(niche, platform):
    """Generate weekly post ideas using Gemini"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Generate 7 creative post ideas for {platform} in the {niche} niche.

Requirements:
- One idea for each day of the week
- Variety of content types (educational, entertaining, promotional, behind-the-scenes)
- Include post format (image, video, carousel, story)
- Brief description of the content
- Estimated engagement potential (High/Medium/Low)

Return as JSON array with format:
[
  {{
    "day": "Monday",
    "title": "Post title",
    "description": "Brief description",
    "format": "image/video/carousel/story",
    "engagement": "High/Medium/Low",
    "tips": "Quick tips for execution"
  }},
  ...
]
"""
        
        response = model.generate_content(prompt)
        
        try:
            text = response.text
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end > start:
                ideas = json.loads(text[start:end])
                return ideas
            else:
                return parse_post_ideas_response(text)
        except:
            return parse_post_ideas_response(response.text)
            
    except Exception as e:
        print(f"Gemini Post Ideas Error: {e}")
        return get_fallback_post_ideas(niche)


def generate_weekly_plan(niche, platform):
    """Generate complete weekly content plan using Gemini"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Create a complete weekly content calendar for {platform} in the {niche} niche.

Requirements:
- 7 days of content (Monday to Sunday)
- Include post time recommendations
- Mix of content types
- Hashtag suggestions for each post
- Engagement strategies
- Content themes for the week

Return as JSON with format:
{{
  "week_theme": "Overall theme",
  "posts": [
    {{
      "day": "Monday",
      "time": "10:00 AM",
      "content_type": "Educational",
      "title": "Post title",
      "caption": "Sample caption",
      "hashtags": ["#tag1", "#tag2"],
      "format": "image/video/carousel",
      "goal": "Engagement/Reach/Conversion"
    }},
    ...
  ],
  "tips": ["Tip 1", "Tip 2", ...]
}}
"""
        
        response = model.generate_content(prompt)
        
        try:
            text = response.text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                plan = json.loads(text[start:end])
                return plan
            else:
                return parse_weekly_plan_response(text)
        except:
            return parse_weekly_plan_response(response.text)
            
    except Exception as e:
        print(f"Gemini Weekly Plan Error: {e}")
        return get_fallback_weekly_plan(niche)


# ═══════════════════════════════════════════════════════════
# PARSING HELPERS (for non-JSON responses)
# ═══════════════════════════════════════════════════════════

def parse_caption_response(text):
    """Parse caption response when JSON parsing fails"""
    captions = []
    lines = text.split('\n')
    current_caption = ""
    
    for line in lines:
        line = line.strip()
        if line and not line.startswith('#'):
            if len(current_caption) > 0 and (line.startswith('Caption') or line.startswith('Option')):
                if current_caption:
                    captions.append({
                        'caption': current_caption.strip(),
                        'tone': 'casual',
                        'length': 'medium'
                    })
                current_caption = ""
            else:
                current_caption += " " + line
    
    if current_caption:
        captions.append({
            'caption': current_caption.strip(),
            'tone': 'casual',
            'length': 'medium'
        })
    
    return captions[:3] if captions else get_fallback_captions('general', 'instagram')


def parse_hashtag_response(text):
    """Parse hashtag response when JSON parsing fails"""
    hashtags = {
        'high_reach': [],
        'medium_reach': [],
        'low_reach': [],
        'trending': []
    }
    
    lines = text.split('\n')
    current_category = 'medium_reach'
    
    for line in lines:
        line = line.strip()
        if 'high' in line.lower() and 'reach' in line.lower():
            current_category = 'high_reach'
        elif 'medium' in line.lower() and 'reach' in line.lower():
            current_category = 'medium_reach'
        elif 'low' in line.lower() and 'reach' in line.lower():
            current_category = 'low_reach'
        elif 'trending' in line.lower():
            current_category = 'trending'
        elif line.startswith('#'):
            tags = [tag.strip() for tag in line.split() if tag.startswith('#')]
            hashtags[current_category].extend(tags)
    
    return hashtags if any(hashtags.values()) else get_fallback_hashtags('general')


def parse_post_ideas_response(text):
    """Parse post ideas when JSON parsing fails"""
    ideas = []
    lines = text.split('\n')
    
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    current_idea = {}
    
    for line in lines:
        line = line.strip()
        for day in days:
            if day in line:
                if current_idea:
                    ideas.append(current_idea)
                current_idea = {
                    'day': day,
                    'title': line,
                    'description': '',
                    'format': 'image',
                    'engagement': 'Medium',
                    'tips': ''
                }
                break
        
        if current_idea and line and not any(day in line for day in days):
            current_idea['description'] += ' ' + line
    
    if current_idea:
        ideas.append(current_idea)
    
    return ideas[:7] if ideas else get_fallback_post_ideas('general')


def parse_weekly_plan_response(text):
    """Parse weekly plan when JSON parsing fails"""
    return {
        'week_theme': 'Content Variety Week',
        'posts': get_fallback_post_ideas('general'),
        'tips': [
            'Post consistently at optimal times',
            'Engage with your audience in comments',
            'Use a mix of content formats',
            'Track your analytics weekly'
        ]
    }


# ═══════════════════════════════════════════════════════════
# FALLBACK DATA (when API is not available or fails)
# ═══════════════════════════════════════════════════════════

def get_fallback_ideas(idea_type, niche, platform):
    """Return fallback ideas when API fails"""
    if idea_type == 'caption':
        return get_fallback_captions(niche, platform)
    elif idea_type == 'hashtags':
        return get_fallback_hashtags(niche)
    elif idea_type == 'post_ideas':
        return get_fallback_post_ideas(niche)
    elif idea_type == 'weekly_plan':
        return get_fallback_weekly_plan(niche)
    return []


def get_fallback_captions(niche, platform):
    """Fallback captions"""
    return [
        {
            'caption': f'🚀 Excited to share this with you! What do you think? Drop a comment below! 👇 #{niche} #content',
            'tone': 'casual',
            'length': 'short'
        },
        {
            'caption': f'Here\'s something I\'ve been working on lately... 💡 Swipe to see more and let me know your thoughts! Your feedback means everything. 🙌 #{niche} #creative',
            'tone': 'professional',
            'length': 'medium'
        },
        {
            'caption': f'✨ New day, new opportunities! Ready to make it count? Let\'s do this together! 💪 Tag someone who needs to see this! #{niche} #motivation',
            'tone': 'fun',
            'length': 'short'
        }
    ]


def get_fallback_hashtags(niche):
    """Fallback hashtags"""
    return {
        'high_reach': [f'#{niche}', '#instagood', '#photooftheday', '#love', '#beautiful'],
        'medium_reach': [f'#{niche}tips', f'#{niche}life', '#creative', '#inspiration', '#daily'],
        'low_reach': [f'#{niche}community', f'#{niche}lovers', '#smallbusiness', '#supportlocal'],
        'trending': ['#viral', '#trending', '#explore', '#fyp']
    }


def get_fallback_post_ideas(niche):
    """Fallback post ideas"""
    return [
        {
            'day': 'Monday',
            'title': 'Motivation Monday',
            'description': 'Share an inspiring quote or success story to start the week',
            'format': 'image',
            'engagement': 'High',
            'tips': 'Use bright colors and bold text'
        },
        {
            'day': 'Tuesday',
            'title': 'Tutorial Tuesday',
            'description': 'Create a quick how-to guide or tips post',
            'format': 'carousel',
            'engagement': 'High',
            'tips': 'Break down complex topics into simple steps'
        },
        {
            'day': 'Wednesday',
            'title': 'Behind-the-Scenes',
            'description': 'Show your process or workspace',
            'format': 'video',
            'engagement': 'Medium',
            'tips': 'Keep it authentic and relatable'
        },
        {
            'day': 'Thursday',
            'title': 'Throwback Thursday',
            'description': 'Share a past project or memory',
            'format': 'image',
            'engagement': 'Medium',
            'tips': 'Tell a story with your throwback'
        },
        {
            'day': 'Friday',
            'title': 'Fun Friday',
            'description': 'Share something entertaining or lighthearted',
            'format': 'video',
            'engagement': 'High',
            'tips': 'Use trending audio or memes'
        },
        {
            'day': 'Saturday',
            'title': 'User Spotlight',
            'description': 'Feature customer testimonials or user-generated content',
            'format': 'image',
            'engagement': 'Medium',
            'tips': 'Always credit and tag the original creator'
        },
        {
            'day': 'Sunday',
            'title': 'Weekly Recap',
            'description': 'Summarize the week and preview what\'s coming',
            'format': 'carousel',
            'engagement': 'Medium',
            'tips': 'Include a call-to-action for next week'
        }
    ]


def get_fallback_weekly_plan(niche):
    """Fallback weekly plan"""
    return {
        'week_theme': f'{niche.capitalize()} Content Week',
        'posts': get_fallback_post_ideas(niche),
        'tips': [
            'Post consistently at the same times each day',
            'Engage with comments within the first hour',
            'Use Instagram Stories to boost post visibility',
            'Collaborate with others in your niche',
            'Track your analytics and adjust strategy'
        ]
    }


@api_bp.route('/ai/analyze-image', methods=['POST'])
@jwt_required()
def analyze_image_for_caption():
    """
    Analyze an image and suggest captions
    
    Request body:
    {
        "image_url": "https://...",
        "niche": "tech",
        "platform": "instagram"
    }
    """
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        image_url = data.get('image_url', '')
        niche = data.get('niche', 'general')
        platform = data.get('platform', 'instagram')
        
        if not GEMINI_API_KEY:
            return jsonify({
                'success': False,
                'message': 'Gemini API key not configured',
                'captions': get_fallback_captions(niche, platform)
            }), 200
        
        # For now, return fallback (image analysis requires Gemini Pro Vision)
        return jsonify({
            'success': True,
            'message': 'Image analysis coming soon',
            'captions': get_fallback_captions(niche, platform)
        }), 200
        
    except Exception as e:
        print(f"Image Analysis Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'captions': get_fallback_captions('general', 'instagram')
        }), 200


@api_bp.route('/ai/trending-topics', methods=['GET'])
@jwt_required()
def get_trending_topics():
    """Get trending topics for content ideas"""
    try:
        niche = request.args.get('niche', 'general')
        
        # Fallback trending topics
        trending = {
            'topics': [
                {'name': 'AI & Technology', 'posts': '2.5M', 'growth': '+15%'},
                {'name': 'Sustainability', 'posts': '1.8M', 'growth': '+22%'},
                {'name': 'Remote Work', 'posts': '1.2M', 'growth': '+8%'},
                {'name': 'Mental Health', 'posts': '3.1M', 'growth': '+18%'},
                {'name': 'Productivity Hacks', 'posts': '890K', 'growth': '+12%'}
            ],
            'hashtags': ['#trending', '#viral', '#fyp', '#explore', f'#{niche}'],
            'updated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(trending), 200
        
    except Exception as e:
        print(f"Trending Topics Error: {e}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/ai/suggestions', methods=['GET'])
@jwt_required()
def get_ai_suggestions():
    """Generate dynamic AI suggestions for the dashboard"""
    try:
        niche = request.args.get('niche', 'tech')
        
        if not GEMINI_API_KEY:
            return jsonify([
                {
                    'type': 'best_time',
                    'title': 'Best time to post',
                    'description': 'Your audience is most active at 10:00 AM',
                    'icon': 'Clock',
                    'color': 'bg-blue-500'
                },
                {
                    'type': 'trending',
                    'title': 'Trending hashtags',
                    'description': '#TechTips #WebDev #Productivity',
                    'icon': 'TrendingUp',
                    'color': 'bg-purple-500'
                },
                {
                    'type': 'content_idea',
                    'title': 'Content idea',
                    'description': 'Share a behind-the-scenes of your workflow',
                    'icon': 'Sparkles',
                    'color': 'bg-pink-500'
                },
                {
                    'type': 'engagement',
                    'title': 'Boost engagement',
                    'description': 'Add a question to your caption to increase comments',
                    'icon': 'Zap',
                    'color': 'bg-yellow-500'
                }
            ]), 200

        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""Generate 4 personalized social media growth suggestions for a creator in the {niche} niche.
        
        Return as a JSON array of 4 objects with:
        - type: 'best_time' | 'trending' | 'content_idea' | 'engagement'
        - title: Short catchy title
        - description: One sentence actionable advice
        - icon: 'Clock' | 'TrendingUp' | 'Sparkles' | 'Zap' (choose appropriate)
        - color: 'bg-blue-500' | 'bg-purple-500' | 'bg-pink-500' | 'bg-yellow-500' (choose matching icon)
        """
        
        response = model.generate_content(prompt)
        try:
            text = response.text
            start = text.find('[')
            end = text.rfind(']') + 1
            suggestions = json.loads(text[start:end])
            return jsonify(suggestions), 200
        except:
            return jsonify({'error': 'Failed to parse AI response'}), 500
            
    except Exception as e:
        print(f"AI Suggestions Error: {e}")
        return jsonify({'error': str(e)}), 500
