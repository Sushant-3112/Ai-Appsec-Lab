from flask import jsonify, request
from app.routes import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json
from datetime import datetime

# ═══════════════════════════════════════════════════════════
# AI Product Idea Generator - Dual API Support (Gemini + OpenAI)
# ═══════════════════════════════════════════════════════════

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')


def call_gemini(prompt):
    """Generate content using Google Gemini API"""
    try:
        import google.generativeai as genai
        if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_gemini_api_key_here':
            return None
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text = response.text
        # Try to extract JSON
        start = text.find('[')
        end = text.rfind(']') + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        return text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return None


def call_openai(prompt):
    """Generate content using OpenAI API"""
    try:
        if not OPENAI_API_KEY or OPENAI_API_KEY == 'your_openai_api_key_here':
            return None
        import requests
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        data = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': 'You are a creative product and business idea generator. Always respond with valid JSON.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.8,
            'max_tokens': 2000
        }
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data, timeout=30)
        if response.status_code == 200:
            text = response.json()['choices'][0]['message']['content']
            start = text.find('[')
            end = text.rfind(']') + 1
            if start != -1 and end > start:
                return json.loads(text[start:end])
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                return json.loads(text[start:end])
            return text
        return None
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return None


def generate_with_ai(prompt):
    """Try Gemini first, then OpenAI, then fallback"""
    result = call_gemini(prompt)
    if result:
        return result, 'gemini'
    result = call_openai(prompt)
    if result:
        return result, 'openai'
    return None, 'fallback'


@api_bp.route('/ai/product-ideas', methods=['POST'])
@jwt_required()
def generate_product_ideas():
    """
    Generate AI-powered product ideas for digital creators
    
    Request body:
    {
        "category": "ebook" | "course" | "template" | "art" | "music" | "software" | "general",
        "niche": "tech" | "fashion" | "fitness" | etc.,
        "target_audience": "optional description",
        "price_range": "free" | "low" | "medium" | "premium"
    }
    """
    try:
        data = request.get_json() or {}
        category = data.get('category', 'general')
        niche = data.get('niche', 'general')
        target_audience = data.get('target_audience', 'online creators and enthusiasts')
        price_range = data.get('price_range', 'medium')

        price_map = {
            'free': '₹0 (Free)',
            'low': '₹99 - ₹499',
            'medium': '₹499 - ₹2,999',
            'premium': '₹2,999 - ₹9,999+'
        }

        prompt = f"""Generate 6 creative digital product ideas for a creator.

Category: {category}
Niche: {niche}
Target Audience: {target_audience}
Price Range: {price_map.get(price_range, '₹499 - ₹2,999')}

Requirements:
- Each idea should be unique, actionable and profitable
- Include creative product names
- Suggest realistic pricing in Indian Rupees (₹)
- Give a compelling one-line selling pitch
- Suggest what the product image/cover should look like

Return as JSON array with exactly this format:
[
  {{
    "name": "Product Name",
    "description": "One-line compelling description",
    "category": "{category}",
    "suggested_price": "₹999",
    "difficulty": "Easy/Medium/Hard",
    "time_to_create": "2-3 hours",
    "selling_pitch": "Why someone would buy this",
    "cover_idea": "Description of what the product cover/image should look like",
    "tags": ["tag1", "tag2", "tag3"]
  }}
]
"""

        result, provider = generate_with_ai(prompt)

        if result and isinstance(result, list):
            return jsonify({
                'success': True,
                'provider': provider,
                'ideas': result,
                'generated_at': datetime.utcnow().isoformat()
            }), 200

        # Fallback ideas
        return jsonify({
            'success': True,
            'provider': 'fallback',
            'ideas': get_fallback_product_ideas(category, niche),
            'generated_at': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        print(f"Product Ideas Error: {e}")
        return jsonify({
            'success': True,
            'provider': 'fallback',
            'ideas': get_fallback_product_ideas('general', 'general'),
            'generated_at': datetime.utcnow().isoformat()
        }), 200


@api_bp.route('/ai/product-description', methods=['POST'])
@jwt_required()
def generate_product_description():
    """
    Generate AI product description, title and marketing copy
    
    Request body:
    {
        "product_name": "My E-Book",
        "product_type": "ebook",
        "brief": "A guide to web development"
    }
    """
    try:
        data = request.get_json() or {}
        product_name = data.get('product_name', 'My Product')
        product_type = data.get('product_type', 'digital product')
        brief = data.get('brief', '')

        prompt = f"""Write compelling marketing copy for a digital product.

Product Name: {product_name}
Product Type: {product_type}
Brief: {brief if brief else 'No additional context'}

Generate the following in JSON format:
{{
  "title": "Catchy product title (can be different from name)",
  "tagline": "Short catchy tagline (under 10 words)",
  "description": "A compelling 2-3 sentence product description for the listing page",
  "bullet_points": ["Key benefit 1", "Key benefit 2", "Key benefit 3", "Key benefit 4"],
  "suggested_price_inr": "₹999",
  "target_audience": "Who this product is for"
}}
"""

        result, provider = generate_with_ai(prompt)

        if result and isinstance(result, dict):
            return jsonify({
                'success': True,
                'provider': provider,
                'copy': result,
                'generated_at': datetime.utcnow().isoformat()
            }), 200

        return jsonify({
            'success': True,
            'provider': 'fallback',
            'copy': {
                'title': product_name,
                'tagline': 'Your next essential digital resource',
                'description': f'{product_name} is a premium {product_type} designed to help you level up. Packed with actionable insights and practical knowledge.',
                'bullet_points': [
                    'Comprehensive and beginner-friendly',
                    'Instantly downloadable',
                    'Lifetime access included',
                    'Created by industry experts'
                ],
                'suggested_price_inr': '₹499',
                'target_audience': 'Aspiring creators and professionals'
            },
            'generated_at': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        print(f"Product Description Error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def get_fallback_product_ideas(category, niche):
    """Smart fallback product ideas"""
    ideas = [
        {
            "name": "The Ultimate Creator Toolkit",
            "description": "100+ ready-to-use templates, checklists, and workflows for content creators",
            "category": "template",
            "suggested_price": "₹999",
            "difficulty": "Easy",
            "time_to_create": "4-6 hours",
            "selling_pitch": "Save 50+ hours every month with battle-tested creator templates",
            "cover_idea": "Modern gradient background with floating template mockups and sparkle effects",
            "tags": ["templates", "productivity", "creator"]
        },
        {
            "name": f"{niche.capitalize()} Mastery E-Book",
            "description": f"Complete beginner-to-advanced guide to mastering {niche}",
            "category": "ebook",
            "suggested_price": "₹499",
            "difficulty": "Medium",
            "time_to_create": "2-3 days",
            "selling_pitch": f"Everything you need to know about {niche} in one comprehensive guide",
            "cover_idea": "Clean dark background with bold typography and subtle gradient accents",
            "tags": ["ebook", niche, "guide"]
        },
        {
            "name": "Social Media Growth Playbook",
            "description": "Proven strategies to grow from 0 to 10K followers organically",
            "category": "ebook",
            "suggested_price": "₹699",
            "difficulty": "Easy",
            "time_to_create": "1-2 days",
            "selling_pitch": "Real strategies that actually work — no paid ads needed",
            "cover_idea": "Vibrant coral and teal gradient with growth chart illustration",
            "tags": ["social-media", "growth", "marketing"]
        },
        {
            "name": "Premium Notion Dashboard",
            "description": "All-in-one Notion workspace for project management, habit tracking, and goal setting",
            "category": "template",
            "suggested_price": "₹399",
            "difficulty": "Easy",
            "time_to_create": "3-4 hours",
            "selling_pitch": "The only Notion template you'll ever need to organize your life",
            "cover_idea": "Minimalist white mockup showing Notion interface with purple accent elements",
            "tags": ["notion", "template", "productivity"]
        },
        {
            "name": f"{niche.capitalize()} Video Course",
            "description": f"10-module video course teaching {niche} fundamentals to advanced concepts",
            "category": "course",
            "suggested_price": "₹2,999",
            "difficulty": "Hard",
            "time_to_create": "1-2 weeks",
            "selling_pitch": f"Learn {niche} the right way with hands-on projects and real examples",
            "cover_idea": "Professional dark theme with play button icon and course module previews",
            "tags": ["course", niche, "video"]
        },
        {
            "name": "Digital Art Print Collection",
            "description": "50 high-resolution digital art prints for personal and commercial use",
            "category": "art",
            "suggested_price": "₹799",
            "difficulty": "Medium",
            "time_to_create": "3-5 days",
            "selling_pitch": "Museum-quality digital art ready to print, frame, or use in your projects",
            "cover_idea": "Grid of colorful art previews with elegant gold frame border",
            "tags": ["art", "design", "prints"]
        }
    ]
    return ideas
