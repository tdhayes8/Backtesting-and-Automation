from fastapi import APIRouter
from loguru import logger
import pandas as pd
from ..utils import run_app

backtest_router = APIRouter()

#Returns backtest_data by run_backtest() -> run_app() -> run_backtest() -> run_es_algo. 
#Each returns a dictionary of the necessary data from the completed instance of the strategy/algo.
@backtest_router.get("/backtest/{algorithm_name}")
def run_backtest(algorithm_name: str):
    # Logic to retrieve user data
    logger.debug(f"RUNNING BACKEST ON {algorithm_name}")
    return run_app()

