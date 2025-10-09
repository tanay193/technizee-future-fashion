import json
import logging
import os
import base64
import io
from PIL import Image
import traceback

# Import your Gemini-based functions
from gemini_test import (
    generate_ai_photoshoot,
    generate_virtual_tryon,
    base64_to_pil,
    pil_to_base64,
    pil_to_bytes
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global flag to track initialization
model_loaded = False

def init():
    """
    This function is called when the container is initialized/started.
    With Gemini API, no heavy models need to be loaded into memory.
    We just verify the API key is set.
    """
    global model_loaded
    try:
        logger.info("Initializing Gemini-based virtual try-on service...")
        
        # Check if GEMINI_API_KEY is set
        gemini_key = os.getenv("GEMINI_API_KEY")
        mock_mode = os.getenv("MOCK_MODE", "0") == "1"
        
        if not mock_mode and not gemini_key:
            logger.error("❌ GEMINI_API_KEY not set")
            model_loaded = False
            raise RuntimeError("GEMINI_API_KEY environment variable is required")
        
        logger.info("✅ Service initialized successfully")
        model_loaded = True
        
    except Exception as e:
        logger.error(f"❌ Error during initialization: {e}")
        traceback.print_exc()
        model_loaded = False

def run(raw_data):
    """
    Processes incoming request and performs AI photoshoot or virtual try-on.
    
    Expected JSON formats:
    
    1. AI Photoshoot:
    {
        "service": "ai_photoshoot",
        "garment_image": "base64_string",
        "model_type": "Indian Female",
        "background_style": "Studio",
        "category": "upper_body",
        "extra_prompt": "optional"
    }
    
    2. Virtual Try-On:
    {
        "service": "virtual_tryon",
        "user_image": "base64_string",
        "garment_image": "base64_string",
        "category": "upper_body",
        "garment_type": "shirt",
        "garment_orientation": "flatlay",
        "extra_prompt": "optional"
    }
    
    Legacy format (auto-detected as virtual_tryon):
    {
        "user_image": "base64_string",
        "garment_image": "base64_string",
        "category": "upper_body"
    }
    """
    try:
        if not model_loaded:
            return json.dumps({
                "error": "Service not initialized properly. Check GEMINI_API_KEY.",
                "success": False
            })
        
        # Parse input data
        data = json.loads(raw_data)
        logger.info(f"Received request with keys: {list(data.keys())}")
        
        # Determine service type
        service = data.get("service", "virtual_tryon")
        
        # Auto-detect legacy format (no "service" field, has user_image or model_image)
        if "service" not in data:
            if "model_image" in data:
                service = "ai_photoshoot"
            elif "user_image" in data:
                service = "virtual_tryon"
        
        logger.info(f"Processing service: {service}")
        
        # ============= AI PHOTOSHOOT =============
        if service == "ai_photoshoot":
            return handle_ai_photoshoot(data)
        
        # ============= VIRTUAL TRY-ON =============
        elif service == "virtual_tryon":
            return handle_virtual_tryon(data)
        
        else:
            return json.dumps({
                "error": f"Unknown service type: {service}",
                "success": False
            })
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        return json.dumps({
            "error": "Invalid JSON format",
            "success": False
        })
    
    except Exception as e:
        logger.error(f"Error in run(): {e}")
        traceback.print_exc()
        return json.dumps({
            "error": f"Processing failed: {str(e)}",
            "success": False
        })

def handle_ai_photoshoot(data):
    """Handle AI Photoshoot requests"""
    try:
        # Extract parameters
        garment_b64 = data.get("garment_image") or data.get("model_image")
        if not garment_b64:
            return json.dumps({
                "error": "Missing garment_image",
                "success": False
            })
        
        model_type = data.get("model_type", "Indian Female")
        background_style = data.get("background_style", "Studio")
        category = data.get("category", "upper_body")
        extra_prompt = data.get("extra_prompt")
        
        # Map category to readable format
        category_map = {
            "upper_body": "Upper Body",
            "lower_body": "Lower Body",
            "dresses": "Dresses"
        }
        garment_category = category_map.get(category, "Upper Body")
        
        logger.info(f"AI Photoshoot - Model: {model_type}, Background: {background_style}, Category: {garment_category}")
        
        # Convert base64 to PIL Image
        garment_pil = base64_to_pil(garment_b64)
        
        # Save temporarily to pass to gemini_test function
        temp_garment_path = "/tmp/temp_garment.png"
        garment_pil.save(temp_garment_path)
        
        # Call gemini_test function
        out_path, result_b64 = generate_ai_photoshoot(
            garment_path=temp_garment_path,
            model_type=model_type,
            background_style=background_style,
            garment_category=garment_category,
            extra_prompt=extra_prompt,
            out_path="/tmp/ai_photoshoot_result.png"
        )
        
        # Clean up temp file
        if os.path.exists(temp_garment_path):
            os.remove(temp_garment_path)
        
        # Return response with data URI format
        response = {
            "success": True,
            "result_image": f"data:image/png;base64,{result_b64}",
            "service": "ai_photoshoot",
            "model_type": model_type,
            "background_style": background_style,
            "category": category
        }
        
        logger.info("✅ AI Photoshoot completed successfully")
        return json.dumps(response)
        
    except Exception as e:
        logger.error(f"AI Photoshoot error: {e}")
        traceback.print_exc()
        return json.dumps({
            "error": f"AI Photoshoot failed: {str(e)}",
            "success": False
        })

def handle_virtual_tryon(data):
    """Handle Virtual Try-On requests"""
    try:
        # Extract parameters
        user_b64 = data.get("user_image")
        garment_b64 = data.get("garment_image")
        
        if not user_b64 or not garment_b64:
            return json.dumps({
                "error": "Missing user_image or garment_image",
                "success": False
            })
        
        category = data.get("category", "upper_body")
        garment_type = data.get("garment_type")
        garment_orientation = data.get("garment_orientation")
        extra_prompt = data.get("extra_prompt")
        
        logger.info(f"Virtual Try-On - Category: {category}, Type: {garment_type}, Orientation: {garment_orientation}")
        
        # Convert base64 to PIL Images
        user_pil = base64_to_pil(user_b64)
        garment_pil = base64_to_pil(garment_b64)
        
        # Save temporarily to pass to gemini_test function
        temp_user_path = "/tmp/temp_user.png"
        temp_garment_path = "/tmp/temp_garment.png"
        user_pil.save(temp_user_path)
        garment_pil.save(temp_garment_path)
        
        # Call gemini_test function
        out_path, result_b64 = generate_virtual_tryon(
            garment_path=temp_garment_path,
            person_path=temp_user_path,
            garment_type=garment_type,
            garment_orientation=garment_orientation,
            extra_prompt=extra_prompt,
            out_path="/tmp/virtual_tryon_result.png"
        )
        
        # Clean up temp files
        if os.path.exists(temp_user_path):
            os.remove(temp_user_path)
        if os.path.exists(temp_garment_path):
            os.remove(temp_garment_path)
        
        # Return response with data URI format
        response = {
            "success": True,
            "result_image": f"data:image/png;base64,{result_b64}",
            "service": "virtual_tryon",
            "category": category,
            "detected_sleeves": "auto"  # Legacy compatibility
        }
        
        logger.info("✅ Virtual Try-On completed successfully")
        return json.dumps(response)
        
    except Exception as e:
        logger.error(f"Virtual Try-On error: {e}")
        traceback.print_exc()
        return json.dumps({
            "error": f"Virtual Try-On failed: {str(e)}",
            "success": False
        })

# Global variable to track model loading status
model_loaded = False
