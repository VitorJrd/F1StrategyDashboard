from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, LapData, PitStop, init_db
import fastf1
import pandas as pd

app = FastAPI(title="F1 Strategy Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

fastf1.Cache.enable_cache("cache")

@app.on_event("startup")
def startup():
    init_db()  # creates tables if they don't exist

@app.get("/")
def root():
    return {"message": "F1 Dashboard API is running 🏎️"}

@app.get("/schedule/{year}")
def get_schedule(year: int):
    schedule = fastf1.get_event_schedule(year)
    return schedule[["RoundNumber", "EventName", "Country"]].to_dict(orient="records")

@app.get("/race/{year}/{round}/laps")
def get_lap_times(year: int, round: int):
    db = SessionLocal()
    existing = db.query(LapData).filter_by(year=year, round=round).all()

    if existing:
        db.close()
        return [{"Driver": r.driver, "LapNumber": r.lap_number,
                 "LapTime": r.lap_time, "Compound": r.compound} for r in existing]

    # Not in DB, fetch from FastF1
    session = fastf1.get_session(year, round, "R")
    session.load(telemetry=False, weather=False)
    laps = session.laps[["Driver", "LapNumber", "LapTime", "Compound"]].copy()
    laps["LapTime"] = laps["LapTime"].dt.total_seconds()
    laps = laps.dropna()

    for _, row in laps.iterrows():
        db.add(LapData(year=year, round=round, driver=row["Driver"],
                       lap_number=int(row["LapNumber"]), lap_time=row["LapTime"],
                       compound=row["Compound"]))
    db.commit()
    db.close()
    return laps.to_dict(orient="records")

@app.get("/race/{year}/{round}/pitstops")
def get_pit_stops(year: int, round: int):
    db = SessionLocal()
    existing = db.query(PitStop).filter_by(year=year, round=round).all()

    if existing:
        db.close()
        return [{"Driver": r.driver, "LapNumber": r.lap_number,
                 "PitInTime": r.pit_in_time, "Compound": r.compound} for r in existing]

    session = fastf1.get_session(year, round, "R")
    session.load(telemetry=False, weather=False)
    laps = session.laps[["Driver", "LapNumber", "PitInTime", "Compound"]].dropna(subset=["PitInTime"]).copy()
    laps["PitInTime"] = laps["PitInTime"].dt.total_seconds()

    for _, row in laps.iterrows():
        db.add(PitStop(year=year, round=round, driver=row["Driver"],
                       lap_number=int(row["LapNumber"]), pit_in_time=row["PitInTime"],
                       compound=row["Compound"]))
    db.commit()
    db.close()
    return laps.to_dict(orient="records")