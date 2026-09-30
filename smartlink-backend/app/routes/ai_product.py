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
    """Smart fallback product ideas tailored to Creator Category"""
    cat_lower = str(category).lower()
    niche_lower = str(niche).lower()
    
    if 'comed' in cat_lower or 'comed' in niche_lower:
        return [
            {
                "name": "India's Got Latent VIP Front-Row Pass",
                "description": "Exclusive live show access with priority seating & backstage meet & greet",
                "category": "comedian",
                "suggested_price": "₹1,499",
                "difficulty": "Easy",
                "time_to_create": "Instant",
                "selling_pitch": "Give your biggest fans exclusive physical/digital access to live standup tapings",
                "cover_idea": "Neon stage spotlight with mic graphic and golden VIP badge",
                "tags": ["comedy", "pass", "live-show", "vip"]
            },
            {
                "name": "Uncensored Standup Script & Joke Notebook",
                "description": "Raw unreleased joke drafts, crowd-work scripts, and story outlines",
                "category": "comedian",
                "suggested_price": "₹299",
                "difficulty": "Easy",
                "time_to_create": "2 hours",
                "selling_pitch": "Let super-fans read your unreleased material before it hits the stage",
                "cover_idea": "Vintage handwritten notebook style with coffee stain accent",
                "tags": ["script", "jokes", "comedy", "ebook"]
            },
            {
                "name": "Comedian's Crowd-Work Playbook",
                "description": "50+ quick comebacks, audience banter hooks, and stage confidence tips",
                "category": "comedian",
                "suggested_price": "₹499",
                "difficulty": "Medium",
                "time_to_create": "1 day",
                "selling_pitch": "Teach aspiring comedians how to handle hecklers and master crowd work",
                "cover_idea": "Bold yellow & black comic typography with laughter bubble",
                "tags": ["guide", "crowd-work", "stage-presence"]
            },
            {
                "name": "Exclusive Roasted Audio Ringtones Pack",
                "description": "15 funny custom voice roasts, alarm tones & ringtones recorded by you",
                "category": "comedian",
                "suggested_price": "₹199",
                "difficulty": "Easy",
                "time_to_create": "1 hour",
                "selling_pitch": "Fans can hear your legendary roasts every time their alarm rings",
                "cover_idea": "Retro soundwave visual with flame roast icon",
                "tags": ["audio", "roast", "ringtones", "funny"]
            },
            {
                "name": "Standup Special Backstage Bloopers Video Pass",
                "description": "30 minutes of hilarious unedited bloopers, stage fails, and green room moments",
                "category": "comedian",
                "suggested_price": "₹399",
                "difficulty": "Easy",
                "time_to_create": "3 hours",
                "selling_pitch": "Hilarious unreleased behind-the-scenes footage fans can't find on YouTube",
                "cover_idea": "Cinema clapperboard with purple glow effect",
                "tags": ["bloopers", "video", "behind-the-scenes"]
            },
            {
                "name": "Meme & Roast Photoshop Template Pack",
                "description": "20 customizable viral meme formats and thumbnail templates",
                "category": "comedian",
                "suggested_price": "₹249",
                "difficulty": "Easy",
                "time_to_create": "2 hours",
                "selling_pitch": "Empower your fanbase to create viral memes using your signature style",
                "cover_idea": "Pop-art style overlay with laughing emoji graphics",
                "tags": ["memes", "templates", "photoshop"]
            }
        ]

    if 'tech' in cat_lower or 'tech' in niche_lower or 'dev' in cat_lower or 'software' in cat_lower:
        return [
            {
                "name": "Full-Stack SaaS Starter Kit (Next.js + Flask)",
                "description": "Production-ready boilerplate with Auth, Payments, DB models & UI components",
                "category": "tech",
                "suggested_price": "₹2,499",
                "difficulty": "Hard",
                "time_to_create": "1 week",
                "selling_pitch": "Save 100+ hours building your next SaaS startup with battle-tested code",
                "cover_idea": "Dark code editor mockup with glowing gradient matrix syntax",
                "tags": ["saas", "nextjs", "flask", "code"]
            },
            {
                "name": "System Design & Architecture Cheat Sheets",
                "description": "Visual diagrams for scalable microservices, caching, and DB sharding",
                "category": "tech",
                "suggested_price": "₹499",
                "difficulty": "Medium",
                "time_to_create": "2 days",
                "selling_pitch": "Ace senior engineering interviews and design rock-solid backend systems",
                "cover_idea": "Clean blueprint architectural diagram on navy background",
                "tags": ["system-design", "architecture", "interview"]
            },
            {
                "name": "1-on-1 Code Review & Portfolio Audit",
                "description": "30-minute deep dive video review of candidate GitHub projects & resume",
                "category": "tech",
                "suggested_price": "₹1,999",
                "difficulty": "Medium",
                "time_to_create": "30 mins",
                "selling_pitch": "Direct feedback from a senior engineer to help devs land tech jobs",
                "cover_idea": "Sleek terminal window with verified checkmark and code tags",
                "tags": ["mentorship", "code-review", "consulting"]
            },
            {
                "name": "AI AppSec & Cyber Security Playbook",
                "description": "Practical guide to securing LLM APIs, JWT auth, and cloud backend endpoints",
                "category": "tech",
                "suggested_price": "₹699",
                "difficulty": "Medium",
                "time_to_create": "3 days",
                "selling_pitch": "Protect your web apps against modern AI security vulnerabilities",
                "cover_idea": "Cybersecurity shield logo with glowing circuit board pattern",
                "tags": ["security", "appsec", "ai", "ebook"]
            },
            {
                "name": "React & Tailwind CSS UI Component Library",
                "description": "40+ copy-paste glassmorphism components, animated cards, and navbars",
                "category": "tech",
                "suggested_price": "₹899",
                "difficulty": "Easy",
                "time_to_create": "3 days",
                "selling_pitch": "Ship gorgeous modern web UIs instantly without writing CSS from scratch",
                "cover_idea": "Floating 3D UI cards with vibrant purple and indigo neon accents",
                "tags": ["react", "tailwind", "ui-kit", "components"]
            },
            {
                "name": "Dev Resume & Tech Interview Bundle",
                "description": "AT-optimized software engineer resume templates & 100 top coding Q&As",
                "category": "tech",
                "suggested_price": "₹349",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Get noticed by recruiters at top tech firms with proven resumes",
                "cover_idea": "Minimalist document preview with glowing hire button badge",
                "tags": ["resume", "jobs", "career"]
            }
        ]

    if 'fit' in cat_lower or 'fit' in niche_lower or 'health' in cat_lower:
        return [
            {
                "name": "30-Day Shred & Lean Muscle Blueprint",
                "description": "Day-by-day workout split, exercise demo videos, and progression tracker",
                "category": "fitness",
                "suggested_price": "₹499",
                "difficulty": "Medium",
                "time_to_create": "2 days",
                "selling_pitch": "Transform your physique in 4 weeks with science-backed workouts",
                "cover_idea": "Dynamic high-contrast athletic photo with neon orange typography",
                "tags": ["fitness", "workout", "shred", "guide"]
            },
            {
                "name": "Macro & Meal Prep Calculator Sheet",
                "description": "Automated Excel/Google Sheet for calculating calories, protein & meal plans",
                "category": "fitness",
                "suggested_price": "₹299",
                "difficulty": "Easy",
                "time_to_create": "4 hours",
                "selling_pitch": "Hit your fitness goals without guessing what or how much to eat",
                "cover_idea": "Clean green nutrition pie chart mockup with avocado accent",
                "tags": ["nutrition", "meal-prep", "spreadsheet"]
            },
            {
                "name": "High-Energy Workout Music & Beat Pack",
                "description": "10 royalty-free 140+ BPM energetic workout tracks & gym hype audio",
                "category": "fitness",
                "suggested_price": "₹199",
                "difficulty": "Easy",
                "time_to_create": "3 hours",
                "selling_pitch": "Power through heavy lifts with custom energetic beat tracks",
                "cover_idea": "Dumbbell soundwave graphic with electric blue theme",
                "tags": ["music", "workout-beats", "audio"]
            },
            {
                "name": "1-on-1 Virtual Fitness Coaching Call Pass",
                "description": "45-minute live video consultation for custom workout & diet auditing",
                "category": "fitness",
                "suggested_price": "₹1,999",
                "difficulty": "Medium",
                "time_to_create": "45 mins",
                "selling_pitch": "Get personalized expert advice tailored directly to your body type",
                "cover_idea": "Video call frame mockup with certified trainer badge",
                "tags": ["coaching", "consultation", "fitness"]
            },
            {
                "name": "At-Home Dumbbell Workout Challenge E-Book",
                "description": "No-gym-required exercise guide using minimal equipment",
                "category": "fitness",
                "suggested_price": "₹399",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Build strength and burn fat from the comfort of your living room",
                "cover_idea": "Home gym setup illustration with warm minimalist tones",
                "tags": ["home-workout", "dumbbell", "ebook"]
            },
            {
                "name": "High-Protein Recipe Book for Athletes",
                "description": "40 delicious 500-calorie meals cooked in under 20 minutes",
                "category": "fitness",
                "suggested_price": "₹599",
                "difficulty": "Easy",
                "time_to_create": "2 days",
                "selling_pitch": "Healthy meals that taste amazing and help you hit your protein target",
                "cover_idea": "Vibrant food photography mockup with nutritional macros callout",
                "tags": ["recipes", "protein", "cookbook"]
            }
        ]

    if 'art' in cat_lower or 'design' in cat_lower or 'artist' in cat_lower:
        return [
            {
                "name": "Glassmorphism UI Design System (Figma)",
                "description": "100+ auto-layout UI components, icons, and luxury dark mode tokens",
                "category": "artist",
                "suggested_price": "₹999",
                "difficulty": "Medium",
                "time_to_create": "3 days",
                "selling_pitch": "Design high-end mobile and web apps in minutes with Figma design tokens",
                "cover_idea": "Layered frosted glass UI mockups with iridescent rainbow reflections",
                "tags": ["figma", "ui-kit", "design", "templates"]
            },
            {
                "name": "Cinematic Lightroom & VSCO Preset Pack",
                "description": "30 one-click presets for urban, moody, and warm portrait photos",
                "category": "artist",
                "suggested_price": "₹499",
                "difficulty": "Easy",
                "time_to_create": "5 hours",
                "selling_pitch": "Give your Instagram photos professional color grading instantly",
                "cover_idea": "Split before/after photography grid with gold slider accent",
                "tags": ["lightroom", "presets", "photography"]
            },
            {
                "name": "4K Minimalist Aesthetic Wallpaper Collection",
                "description": "25 high-resolution digital art wallpapers for iPhone, iPad & Mac",
                "category": "artist",
                "suggested_price": "₹199",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Customize your devices with exclusive museum-quality digital artwork",
                "cover_idea": "Framed iPhone lockscreen mockups displaying abstract artwork",
                "tags": ["wallpaper", "digital-art", "aesthetic"]
            },
            {
                "name": "Procreate Digital Illustration Brush Bundle",
                "description": "40 custom watercolor, oil paint, and line-art brushes for iPad artists",
                "category": "artist",
                "suggested_price": "₹399",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Paint lifelike textures and illustrations inside Procreate",
                "cover_idea": "Digital paint stroke swooshes with iPad Apple Pencil mockup",
                "tags": ["procreate", "brushes", "ipad", "art"]
            },
            {
                "name": "3D Cyberpunk & Neon Asset Pack",
                "description": "15 Blender 3D objects, textures, and lighting setups",
                "category": "artist",
                "suggested_price": "₹1,299",
                "difficulty": "Hard",
                "time_to_create": "5 days",
                "selling_pitch": "Elevate your 3D renders with realistic metallic textures and glowing neons",
                "cover_idea": "Futuristic 3D helmet render with pink and cyan glow",
                "tags": ["3d", "blender", "cyberpunk", "assets"]
            },
            {
                "name": "Freelance Designer Client Proposal & Invoice Kit",
                "description": "Notion & Canva templates for closing high-ticket design clients",
                "category": "artist",
                "suggested_price": "₹699",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Look professional and land 5-figure design projects with confidence",
                "cover_idea": "Elegant invoice & proposal preview with gold seal stamp",
                "tags": ["proposal", "freelance", "templates"]
            }
        ]

    if 'mus' in cat_lower or 'pod' in cat_lower or 'audio' in cat_lower:
        return [
            {
                "name": "Lo-Fi & Trap Sample Pack + Melody Stems",
                "description": "150+ royalty-free drum loops, 808 bass, and lush synth chords",
                "category": "musician",
                "suggested_price": "₹699",
                "difficulty": "Medium",
                "time_to_create": "3 days",
                "selling_pitch": "Produce radio-ready beats with premium WAV samples and MIDI files",
                "cover_idea": "Retro cassette tape with glowing violet audio wave lines",
                "tags": ["samples", "music-production", "beats", "stems"]
            },
            {
                "name": "FL Studio & Ableton Vocal Mixing Presets",
                "description": "1-click vocal chain presets for crisp, warm, and studio-grade vocals",
                "category": "musician",
                "suggested_price": "₹499",
                "difficulty": "Easy",
                "time_to_create": "4 hours",
                "selling_pitch": "Get professional radio vocals in your bedroom studio without expensive plugins",
                "cover_idea": "Studio microphone with DAW equalizer visualizer",
                "tags": ["vocal-presets", "flstudio", "ableton", "mixing"]
            },
            {
                "name": "Independent Musician's Spotify Pitching Blueprint",
                "description": "Step-by-step guide & curated contact list of 200+ active playlist curators",
                "category": "musician",
                "suggested_price": "₹299",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Get your music featured on editorial Spotify playlists without a record label",
                "cover_idea": "Green Spotify-inspired wave icon with glowing verified checkmark",
                "tags": ["spotify", "pitching", "music-marketing"]
            },
            {
                "name": "Podcast Sponsor Pitch & Rate Card Template",
                "description": "Canva & PDF media kit template for pitching brands for podcast sponsors",
                "category": "musician",
                "suggested_price": "₹499",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Monetize your podcast by pitching brands with high-converting rate cards",
                "cover_idea": "Professional media kit layout preview with microphone icon",
                "tags": ["podcast", "sponsorship", "media-kit"]
            },
            {
                "name": "Unreleased Studio Stems & Acoustic Sessions",
                "description": "FLAC/WAV raw stem files of unreleased songs for remixing & listening",
                "category": "musician",
                "suggested_price": "₹399",
                "difficulty": "Easy",
                "time_to_create": "2 hours",
                "selling_pitch": "Give hardcore fans access to raw vocal stems and unreleased acoustic cuts",
                "cover_idea": "Vinyl record envelope mockup with gold limited-edition foil",
                "tags": ["stems", "remix", "exclusive-music"]
            },
            {
                "name": "Music Producer's Copyright & Licensing Guide",
                "description": "Legal contract templates for split sheets, beat licensing & publishing",
                "category": "musician",
                "suggested_price": "₹599",
                "difficulty": "Medium",
                "time_to_create": "2 days",
                "selling_pitch": "Protect your royalties and sell beat licenses legally without stress",
                "cover_idea": "Legal scale stamp over musical treble clef icon",
                "tags": ["contracts", "music-business", "licensing"]
            }
        ]

    if 'bus' in cat_lower or 'edu' in cat_lower or 'coach' in cat_lower:
        return [
            {
                "name": "All-In-One Creator Business Notion OS",
                "description": "Notion workspace for content calendar, CRM, revenue tracking & project tasks",
                "category": "business",
                "suggested_price": "₹699",
                "difficulty": "Medium",
                "time_to_create": "1 day",
                "selling_pitch": "Run your entire creator business from one streamlined Notion dashboard",
                "cover_idea": "Minimalist black & white Notion desktop interface mockup",
                "tags": ["notion", "productivity", "business-os"]
            },
            {
                "name": "10x Startup Investor Pitch Deck Template",
                "description": "15-slide PowerPoint/Keynote deck designed to raise pre-seed capital",
                "category": "business",
                "suggested_price": "₹1,499",
                "difficulty": "Medium",
                "time_to_create": "2 days",
                "selling_pitch": "Impress VCs and angel investors with a clean, high-converting pitch deck",
                "cover_idea": "Sleek pitch deck presentation slides with growth metrics charts",
                "tags": ["pitch-deck", "fundraising", "startup"]
            },
            {
                "name": "60-Minute 1-on-1 Growth Strategy Call",
                "description": "Private Zoom session to audit your business model, offer, and marketing",
                "category": "business",
                "suggested_price": "₹2,999",
                "difficulty": "Easy",
                "time_to_create": "1 hour",
                "selling_pitch": "Get personalized actionable guidance to scale your revenue to 6-figures",
                "cover_idea": "Calendar booking window mockup with 5-star rating stars",
                "tags": ["coaching", "consulting", "strategy"]
            },
            {
                "name": "Content Creator Monetization Masterclass Slides",
                "description": "Complete slide deck & workbook teaching digital product monetization",
                "category": "business",
                "suggested_price": "₹899",
                "difficulty": "Easy",
                "time_to_create": "2 days",
                "selling_pitch": "Teach your audience how to turn their skills into recurring income",
                "cover_idea": "Masterclass badge with golden certificate seal border",
                "tags": ["course", "masterclass", "monetization"]
            },
            {
                "name": "High-Converting Email Newsletter Playbook",
                "description": "25 subject line templates, welcome sequences & sales launch emails",
                "category": "business",
                "suggested_price": "₹499",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Convert casual followers into paying email subscribers with proven copy",
                "cover_idea": "Envelope icon with floating notification badge and cash sparks",
                "tags": ["email-marketing", "copywriting", "playbook"]
            },
            {
                "name": "Freelance Client Onboarding & Contract Suite",
                "description": "Standard service agreement, audit questionnaire & onboarding checklist",
                "category": "business",
                "suggested_price": "₹599",
                "difficulty": "Easy",
                "time_to_create": "1 day",
                "selling_pitch": "Protect your freelance work and deliver a 5-star client experience",
                "cover_idea": "Professional contract clipboard with pen signing signature line",
                "tags": ["freelance", "contracts", "client-management"]
            }
        ]

    # Default general fallback
    return [
        {
            "name": "The Ultimate Digital Product Creator Kit",
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
            "name": f"{niche_lower.capitalize()} Mastery E-Book",
            "description": f"Complete beginner-to-advanced guide to mastering {niche_lower}",
            "category": "ebook",
            "suggested_price": "₹499",
            "difficulty": "Medium",
            "time_to_create": "2-3 days",
            "selling_pitch": f"Everything you need to know about {niche_lower} in one comprehensive guide",
            "cover_idea": "Clean dark background with bold typography and subtle gradient accents",
            "tags": ["ebook", niche_lower, "guide"]
        },
        {
            "name": "Social Media Growth & Viral Content Playbook",
            "description": "Proven strategies to grow from 0 to 100K followers organically",
            "category": "ebook",
            "suggested_price": "₹699",
            "difficulty": "Easy",
            "time_to_create": "1-2 days",
            "selling_pitch": "Real strategies that actually work — no paid ads needed",
            "cover_idea": "Vibrant coral and teal gradient with growth chart illustration",
            "tags": ["social-media", "growth", "marketing"]
        },
        {
            "name": "Premium All-in-One Notion Dashboard",
            "description": "Workspace for project management, habit tracking, and goal setting",
            "category": "template",
            "suggested_price": "₹399",
            "difficulty": "Easy",
            "time_to_create": "3-4 hours",
            "selling_pitch": "The only Notion template you'll ever need to organize your life",
            "cover_idea": "Minimalist white mockup showing Notion interface with purple accent elements",
            "tags": ["notion", "template", "productivity"]
        },
        {
            "name": f"{niche_lower.capitalize()} Video Masterclass Series",
            "description": f"10-module video course teaching {niche_lower} fundamentals to advanced concepts",
            "category": "course",
            "suggested_price": "₹2,999",
            "difficulty": "Hard",
            "time_to_create": "1-2 weeks",
            "selling_pitch": f"Learn {niche_lower} the right way with hands-on projects and real examples",
            "cover_idea": "Professional dark theme with play button icon and course module previews",
            "tags": ["course", niche_lower, "video"]
        },
        {
            "name": "High-Res Digital Art & Wallpaper Pack",
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
