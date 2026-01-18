from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
import database
from schemas import AssessmentInput, AssessmentResult
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RTRWH Backend API", version="1.0.0")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB on startup
@app.on_event("startup")
async def startup_event():
    try:
        database.init_db()
        logger.info("Database initialized successfully")
        # Log static directory status
        if os.path.exists("static"):
            logger.info("Static directory found")
            if os.path.exists("static/index.html"):
                logger.info("index.html found in static directory")
            else:
                logger.error("index.html NOT found in static directory")
        else:
            logger.error("Static directory NOT found")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

# API Routes
@app.get("/api")
def api_root():
    return {
        "message": "RTRWH Assessment API - Production", 
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "RTRWH API", "timestamp": "2026-01-18"}

@app.post("/api/assess", response_model=AssessmentResult)
async def assess_rooftop(data: AssessmentInput):
    try:
        logger.info(f"Processing assessment for roof area: {data.roof_area}")
        
        # Hardcoded groundwater depth
        groundwater_depth = 10.0  # meters

        # Fetch rainfall from Open-Meteo API
        lat = data.lat or 28.6139  # default to Delhi if not provided
        lng = data.lng or 77.2090

        # Open-Meteo API for annual rainfall (sum of daily precipitation over year)
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lng,
            "start_date": "2024-01-01",
            "end_date": "2024-12-31",
            "daily": "precipitation_sum",
            "timezone": "Asia/Kolkata"
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            rainfall_data = response.json()
        except Exception as e:
            logger.error(f"Weather API error: {e}")
            # Use default rainfall if API fails
            rainfall_data = {"daily": {"precipitation_sum": [2.5] * 365}}

        # Calculate annual rainfall (sum of daily precipitation)
        daily_precipitation = rainfall_data.get("daily", {}).get("precipitation_sum", [])
        annual_rainfall_mm = sum([p for p in daily_precipitation if p is not None])
        annual_rainfall_m = annual_rainfall_mm / 1000  # convert mm to meters

        # Calculate captured volume
        runoff_coefficient = 0.85
        captured_volume_litres = data.roof_area * annual_rainfall_mm * runoff_coefficient

        # Rule engine for structure recommendation
        if data.roof_area < 50:
            structure_type = "Small Pit"
            dimensions = "1.5m × 1.5m × 1.5m"
            cost = 15000
        elif data.roof_area <= 200:
            structure_type = "Medium Pit"
            dimensions = "2m × 4m × 4m"
            cost = 25000
        else:
            structure_type = "Trench/Shaft"
            dimensions = "3m × 6m × 2m"
            cost = 40000

        # Save to DB
        result_data = {
            "roof_area": data.roof_area,
            "dwellers": data.dwellers,
            "open_space": data.open_space,
            "roof_type": data.roof_type,
            "lat": lat,
            "lng": lng,
            "annual_rainfall": annual_rainfall_mm,
            "captured_volume": captured_volume_litres,
            "structure_type": structure_type,
            "cost": cost
        }
        
        try:
            database.save_assessment(result_data)
            logger.info("Assessment saved to database")
        except Exception as e:
            logger.error(f"Database save error: {e}")

        return {
            "captured_volume": round(captured_volume_litres, 2),
            "structure_type": structure_type,
            "dimensions": dimensions,
            "cost": cost,
            "annual_rainfall": annual_rainfall_mm
        }
        
    except Exception as e:
        logger.error(f"Assessment error: {e}")
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

@app.get("/api/stats")
def get_statistics():
    try:
        return database.get_stats()
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return {"total_assessments": 0, "total_litres": 0}

# Mount static files for CSS, JS, images
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Root route - serve React app
@app.get("/")
async def serve_root():
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    else:
        return {
            "message": "RTRWH Assessment API - Production", 
            "status": "online",
            "version": "1.0.0",
            "frontend": "not available - static/index.html not found",
            "api_docs": "/docs"
        }

# Catch-all route for React Router (must be last)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Don't serve SPA for API routes
    if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("health"):
        raise HTTPException(status_code=404, detail="Not found")
    
    # For React Router, always serve index.html
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    else:
        raise HTTPException(status_code=404, detail="Frontend not available")