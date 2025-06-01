from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from fastapi import APIRouter
from loguru import logger
import pandas as pd
import csv
import yfinance
import os
import tempfile
import json
from src.strategies.algo2 import Algo2
import asyncio
from datetime import datetime


data_router = APIRouter()

# @data_router.get("/backtest_data/{data_file_name}")
# def get_data(data_file_name: str):
#     logger.info("TESTESTEST")
#     logger.info(f"READING FILE {data_file_name}")
#     with open(f"backtesting_data/{data_file_name}", newline='') as file:
#         # returns list of dicts instead of str
#         reader = csv.DictReader(file, fieldnames='date open high low close adj_close volume'.split())
#         return list(reader)

@data_router.get("/backtest_data/{start_date}/{end_date}/{ticker}")
def get_data(start_date: str, end_date: str, ticker: str):
    with tempfile.TemporaryDirectory() as td:
        f_name = os.path.join(td, 'tmpfile')
        data = yfinance.download(ticker, start=start_date, end=end_date, interval="1m", back_adjust=False)
        logger.debug(data)
        data.to_csv(f_name)
        with open(f_name, newline='') as file:
            # returns list of dicts instead of str
            # Skip the first 2 rows
            reader = csv.DictReader(file, fieldnames='date open high low close adj_close volume'.split())

            for _ in range(3):
                next(reader)
            return list(reader)

async def get_live_data():
    while True:
        returnData = Algo2.get_data_reader(Algo2)
        for signal in returnData["signals"]:
            if(signal["time"] is not None and isinstance(signal["time"], datetime)):
                signal["time"] = signal["time"].isoformat()
            else:
                continue
        yield "data: " + json.dumps(returnData) + "\n\n"
        await asyncio.sleep(2)

@data_router.get("/live_data_stream")
async def get_data_live_test():
    logger.debug("TEST")
    return StreamingResponse(get_live_data(), media_type='text/event-stream')
