from sqlalchemy import create_engine, Column, Integer, Float, String, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://f1user:f1pass@localhost:5432/f1db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class LapData(Base):
    __tablename__ = "lap_data"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer)
    round = Column(Integer)
    driver = Column(String)
    lap_number = Column(Integer)
    lap_time = Column(Float)
    compound = Column(String)
    __table_args__ = (
        UniqueConstraint("year", "round", "driver", "lap_number", name="uq_lap"),
    )

class PitStop(Base):
    __tablename__ = "pit_stops"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer)
    round = Column(Integer)
    driver = Column(String)
    lap_number = Column(Integer)
    pit_in_time = Column(Float)
    compound = Column(String)
    __table_args__ = (
        UniqueConstraint("year", "round", "driver", "lap_number", name="uq_pit"),
    )

def init_db():
    Base.metadata.create_all(bind=engine)