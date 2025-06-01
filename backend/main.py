from loguru import logger
from dotenv import load_dotenv
from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from src.routes.backtest import backtest_router
from src.routes.data import data_router

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000", # replace if we namespace the frontend at all
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(backtest_router)
app.include_router(data_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}