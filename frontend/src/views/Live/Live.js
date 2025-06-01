import React, { useEffect, useRef, useState } from "react";
import convertCandleData, {convertBackTestData} from "../../utils/utils"
import axios from 'axios';
import { createChart, CrosshairMode } from "lightweight-charts";
import './live.css';

function App() {
  const chartContainerRef = useRef();
  const chart = useRef();
  // const resizeObserver = useRef();
  const [data, setData] = useState([]);
  const [backData, setBackData] = useState(
    {
      avgTrade: 0.00,
      signals: [],
      totalProfit: 0.00,
      tradeCount: 0
    }
  )
  const [refresh, setDataRefresh] = useState(false);
  const candleSeries = useRef();

  const fetchData = async () => {
    try {
      // figure this function out, only displaying down candles but the data seems the same??
      // const t = await axios.get('http://localhost:8000/backtest_data/2024-10-21/2024-10-25/NQ=F');
      const response = await axios.get('http://localhost:8000/backtest_data/NQ_DATA_10-21_10-25.csv');
      //Change these calls to not be hardcoded. Pull this into helper function and handle it all there
      const arr = convertCandleData(response.data);
      // console.log("converted t.data: ")
      // console.log(convertCandleData(t.data))
      setData(arr);
      // console.log("converted res data")
      // console.log(arr)
      const backTestDataResponse = await axios.get('http://localhost:8000/backtest/es_algo');
      const backDict = convertBackTestData(backTestDataResponse.data);
      setBackData(backDict);
      console.log(backDict)
      setDataRefresh(!refresh)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 


   // Initialize the chart only once
  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: "#253248",
        textColor: "#83A869"
      },
      grid: {
        vertLines: { color: "#334158" },
        horzLines: { color: "#334158" }
      },
      crosshair: { mode: CrosshairMode.Magnet },
      priceScale: { borderColor: "#485c7b" },
      timeScale: { borderColor: "#485c7b" }
    });

    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1"
    });
  }, []);

  // Set data when fetched
  useEffect(() => {
    if (data.length > 0) {
      candleSeries.current.setData(data);
    }
  }, [data]);

  // Set markers when backData changes
  useEffect(() => {
    if (backData.signals.length > 0) {
      const markers = backData.signals.map((signal) => ({
        time: signal.time,
        position: 'aboveBar',
        color: signal.signal === 'BUY LONG' || signal.signal === 'BUY SHORT' ? 'green' : 'red',
        shape: signal.signal === 'BUY LONG' || signal.signal === 'SELL LONG' ? 'arrowUp' : 'arrowDown',
        text: `${signal.signal} @ ${signal.price}`
      }));
      candleSeries.current.setMarkers(markers);
    }
  }, [backData]);

  return (
    <div className="App">
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}

export default App;
