import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    
    print(f"Starting RTRWH API server on {host}:{port}")
    
    uvicorn.run(
        "main:app", 
        host=host, 
        port=port, 
        reload=False,
        access_log=True,
        log_level="info"
    )