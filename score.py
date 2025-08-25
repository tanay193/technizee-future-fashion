import json
import logging
import os
import base64
import io
from PIL import Image
import numpy as np

# Your model imports (copy these from run_inference.py)
import sys
import torch
import cv2
from torchvision import transforms
from transformers import CLIPImageProcessor, CLIPTextModel, CLIPTextModelWithProjection, AutoTokenizer, CLIPVisionModelWithProjection, CLIPProcessor, CLIPModel
from diffusers import AutoencoderKL, DDPMScheduler

# Import your custom modules (make sure these are in your Azure environment)
from preprocessors.generate_densepose import load_densepose_model, generate_densepose
from preprocessors.generate_label_map import load_parsing_model, generate_label_map
from preprocessors.generate_keypoints import load_keypoint_model, generate_keypoints
from preprocessors.generate_skeleton import load_skeleton_model, generate_skeleton
from src.unet_hacked_tryon import UNet2DConditionModel
from src.unet_hacked_garmnet import UNet2DConditionModel as UNet2DConditionModel_ref
from src.tryon_pipeline import StableDiffusionXLInpaintPipeline as TryonPipeline

# Copy all your helper functions here (abbreviated for clarity)
from run_inference import (
    load_all_models, run_inference_on_images, MODELS, 
    seed_everything, make_divisible_by_8, resize_and_pad
)

def init():
    """
    This function is called when the container is initialized/started, typically after create/update of the deployment.
    You can write the logic here to perform init operations like caching the model in memory etc.
    """
    global model_loaded
    try:
        # Load all models once during container startup
        print("Loading virtual try-on models...")
        load_all_models()
        model_loaded = True
        print("✅ Models loaded successfully")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        model_loaded = False

def run(raw_data):
    """
    Processes incoming request and performs virtual try-on inference.
    Expects JSON with fields: user_image/model_image, garment_image, category, has_sleeves
    """
    try:
        if not model_loaded:
            return json.dumps({"error": "Models not loaded properly"})
            
        # Parse input data
        data = json.loads(raw_data)
        
        # Handle different input formats
        if "user_image" in data and "garment_image" in data:
            # Virtual Try-On format - user uploaded image
            user_b64 = data["user_image"]
            garment_b64 = data["garment_image"]
        elif "model_image" in data and "garment_image" in data:
            # AI Photoshoot format - model image sent as base64 from frontend
            user_b64 = data["model_image"]  # Use model image as the "user"
            garment_b64 = data["garment_image"]
        else:
            return json.dumps({"error": "Invalid input format. Expected user_image+garment_image or model_image+garment_image"})
        
        # Decode images
        user_pil = base64_to_pil(user_b64)
        garment_pil = base64_to_pil(garment_b64)
        
        # Get parameters
        category = data.get("category", "upper_body")
        has_sleeves = data.get("has_sleeves", None)
        
        # Validate category
        if category not in ["upper_body", "dresses", "lower_body"]:
            return json.dumps({"error": f"Invalid category: {category}"})
        
        # Run inference
        print(f"Running inference for category: {category}")
        result_pil, detected_sleeves = run_inference_on_images(
            user_pil=user_pil,
            cloth_pil=garment_pil, 
            category=category,
            has_sleeves=has_sleeves
        )
        
        if result_pil is None:
            return json.dumps({"error": "Inference failed to generate result"})
        
        # Convert result to base64
        result_b64 = pil_to_base64(result_pil)
        
        # Return response
        response = {
            "success": True,
            "result_image": result_b64,
            "detected_sleeves": detected_sleeves,
            "category": category
        }
        
        return json.dumps(response)
        
    except Exception as e:
        print(f"Error in run(): {e}")
        import traceback
        traceback.print_exc()
        return json.dumps({"error": f"Processing failed: {str(e)}"})

def base64_to_pil(base64_string):
    """Convert base64 string to PIL Image"""
    # Remove data URL prefix if present
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]
    
    image_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    return image

def pil_to_base64(pil_image):
    """Convert PIL Image to base64 string"""
    buffer = io.BytesIO()
    pil_image.save(buffer, format='JPEG', quality=95)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"

# Model image loading function removed - now handled by frontend base64 approach

# Global variable to track model loading status
model_loaded = False