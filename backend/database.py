import sqlite3
import os

DATABASE_PATH = "rtrwh.db"

def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roof_area REAL NOT NULL,
            dwellers INTEGER,
            open_space REAL,
            roof_type TEXT,
            lat REAL,
            lng REAL,
            annual_rainfall REAL,
            captured_volume REAL,
            structure_type TEXT,
            cost REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_assessment(data):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO assessments 
        (roof_area, dwellers, open_space, roof_type, lat, lng, annual_rainfall, captured_volume, structure_type, cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['roof_area'], data.get('dwellers'), data.get('open_space'), data.get('roof_type'),
        data.get('lat'), data.get('lng'), data['annual_rainfall'], data['captured_volume'],
        data['structure_type'], data['cost']
    ))
    conn.commit()
    assessment_id = cursor.lastrowid
    conn.close()
    return assessment_id

def get_stats():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total_assessments, SUM(captured_volume) as total_litres FROM assessments")
    row = cursor.fetchone()
    conn.close()
    return {
        "total_assessments": row[0] or 0,
        "total_litres": row[1] or 0
    }