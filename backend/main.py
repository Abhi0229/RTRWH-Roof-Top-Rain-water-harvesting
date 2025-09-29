from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import database
from schemas import AssessmentInput, AssessmentResult

app = FastAPI(title="RTRWH Backend API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB
database.init_db()

@app.get("/")
def read_root():
    return {"message": "RTRWH Assessment API - Beta"}

@app.post("/assess", response_model=AssessmentResult)
async def assess_rooftop(data: AssessmentInput):
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
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()  # raise if non-200
    rainfall_data = response.json()

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
    database.save_assessment(result_data)

    return {
        "captured_volume": round(captured_volume_litres, 2),
        "structure_type": structure_type,
        "dimensions": dimensions,
        "cost": cost,
        "annual_rainfall": annual_rainfall_mm
    }

@app.get("/stats")
def get_statistics():
    return database.get_stats()