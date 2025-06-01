import backtrader as bt

class StockStrategy(bt.Strategy):

    def __init__(self):
        print("initializing strategy")
        self.data_ready = False
        self.highest = bt.ind.Highest(self.data.high, period=5)
        self.lowest = bt.ind.Lowest(self.data.low, period=5)

    # toggle based on live data feed
    # def notify_data(self, data, status):
    #     print('Data Status =>', data._getstatusname(status))
    #     if status == data.LIVE:
    #         self.data_ready = True

    def log_data(self):
        ohlcv = []
        ohlcv.append(str(self.data.datetime.datetime()))
        ohlcv.append(str(self.data.open[0]))
        ohlcv.append(str(self.data.high[0]))
        ohlcv.append(str(self.data.low[0]))
        ohlcv.append(str(self.data.close[0]))
        ohlcv.append(str(self.data.volume[0]))
        print(",".join(ohlcv))
    
    def next(self):
        self.log_data()
        # this should be toggled based on if data is live
        # if not self.data_ready:
        #     return

        print("current highest high", self.highest[0])
        print("current lowest low", self.lowest[0])
        print("previous highest high", self.highest[-1])
        print("previous lowest low", self.lowest[-1])

        previous_highest_high = self.highest[-1]
        if self.data.close[0] > (previous_highest_high - 0.50):
            print(f"closed at {self.data.close[0]}, which is above previous high of {previous_highest_high}, let's buy!")
            # 
            # self.buy_bracket(limitprice=self.data.close[0]+1.00, price=self.data.close[0], stopprice=self.data.close[0]-0.50)

