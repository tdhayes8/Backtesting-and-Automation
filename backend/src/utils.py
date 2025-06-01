import redis
import time
import os
import backtrader as bt
from retrying import retry
from loguru import logger

from .strategies.es_algo import run_es_algo
from .strategies.algo2 import run_algo_2, run_algo_2_live

tws_host = os.environ['TWS_HOST']
tws_port = os.environ['TWS_PORT']

# try connecting to store every 2 seconds up to 60 times
@retry(wait_fixed=2000, stop_max_attempt_number=60) 
def connect_data_store(testing=True, debug=True, tws_host='host.docker.internal', tws_port=7496):
    logger.info("Connecting to data store")

    store = bt.stores.IBStore(host=tws_host, port=int(tws_port), _debug=debug) # port 4001 for live, TODO ANDY configure env var to toggle this
    return store

def run_app():
    #backtesting = os.environ['BACKTEST_MODE']
    backtesting = False
    if (backtesting):
        # run_backtest_es('backtesting_data/ES_DATA_10-07_10-11.csv') 
        # backtesting_data_path = 'backtesting_data/NQ_DATA_11-04_11-08.csv'
        # backtesting_data_path2 = 'backtesting_data/ES_DATA_11-04_11-08.csv'
        start_date = "2024-11-4"
        end_date = "2024-11-9" #Last day included is (end_date - 1).
        return run_backtest(start_date, end_date)
    else:
        start_date = "2024-11-4"
        end_date = "2024-11-9"
        return run_live(start_date, end_date)
        #print("SERVER IS CURRENTLY ONLY CONFIGURED FOR BACKTESTING MODE, PLEASE UPDATE ENV VARS AND RESTART")
        # logger.debug("Starting backtrader") 

        # cerebro = bt.Cerebro()
        # store = connect_data_store(True, True, tws_host, tws_port)
        # data = store.getdata(dataname='ES', exchange='NYSENAT')
        # cerebro.resampledata(data, timeframe=bt.TimeFrame.Seconds, compression=1)

        # cerebro.addstrategy(MainAlgo)
        # cerebro.run()
    

def run_backtest(start_date, end_date):
    #return run_es_algo(data_file_path, data_file_path2)
    return run_algo_2(start_date, end_date)

def run_live(start, end):
    #params here are just for testing with simulated live data.
    return run_algo_2_live(start, end)
    #return run_algo_2_live
    