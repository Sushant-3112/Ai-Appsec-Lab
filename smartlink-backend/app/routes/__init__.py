from flask import Blueprint

api_bp = Blueprint('api', __name__)

from . import auth, links, profile, analytics, ai_content, products, ai_product
