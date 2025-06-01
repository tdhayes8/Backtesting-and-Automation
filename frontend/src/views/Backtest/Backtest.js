// core components
import React, { useEffect, useRef, useState } from "react";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Menu from '@material-ui/core/Menu';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

import convertCandleData, {convertBackTestData} from "../../utils/utils"
import axios from 'axios';
import { createChart, CrosshairMode } from "lightweight-charts";
import { makeStyles } from "@material-ui/core/styles";
import './backtest.css';

const styles = {
    container: {
        padding: '30px 15px',
        // marginTop: '10px',
        minHeight: 'calc(100vh - 123px)'
    },
    formControl: {
        minWidth: '200'
    }
};

const useStyles = makeStyles(styles);

function App() {
  const classes = useStyles();
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
  const [startValue, setStartValue] = React.useState(dayjs('2024-11-04'));
  const [endValue, setEndValue] = React.useState(dayjs('2024-11-09'));
  const [refresh, setDataRefresh] = useState(false);
  const [algo, setAlgo] = useState('Select Algo');
  const [tr, setTR] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (e) => {
    setAlgo(e.target.value)
    setAnchorEl(null);
  };

  const candleSeries = useRef();

  const executeAlgo = async (algoName, startDate, endDate) => {
    showNotification('tr')
    const backtestDataResponse =  await axios.get(`http://localhost:8000/backtest_data/${startValue.format('YYYY-MM-DD')}/${endValue.format('YYYY-MM-DD')}/NQ=F`);
    //const backTestResponse = await axios.get('http://localhost:8000/backtest/es_algo');
    const backTestResponse = await axios.get('http://localhost:8000/backtest/algo2');
    console.log(backtestDataResponse)
    console.log(backTestResponse)
    // check for errors and display error notification
    // else display updated results?
    setData(convertCandleData(backtestDataResponse.data));
    setBackData(convertBackTestData(backTestResponse.data));
  }

  const fetchData = async () => {
    try {
      // figure this function out, only displaying down candles but the data seems the same??
      
      const response2 = await axios.get(`http://localhost:8000/backtest_data/${startValue.format('YYYY-MM-DD')}/${endValue.format('YYYY-MM-DD')}/NQ=F`);
      const response = await axios.get('http://localhost:8000/backtest_data/NQ_DATA_11-04_11-08.csv');
      console.log("response 1")
      console.log(response)
      console.log("response 2")
      console.log(response2)
      //Change these calls to not be hardcoded. Pull this into helper function and handle it all there
      const arr = convertCandleData(response.data);

      setData(arr);

      const backTestDataResponse = await axios.get('http://localhost:8000/backtest/algo2');
      const backDict = convertBackTestData(backTestDataResponse.data);
      setBackData(backDict);
      console.log(backDict)
    //   setDataRefresh(!refresh)
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

  const showNotification = (place) => {
    switch (place) {
      case "tr":
        if (!tr) {
          setTR(true);
          setTimeout(function () {
            setTR(false);
          }, 6000);
          fetchData()
        }
        break;
    }
  };

  return (
    <div>
    <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10} lg={8}>
            <GridContainer>
              <GridItem xs={3} sm={3} md={3}>
                <Button
                  fullWidth
                  color="primary"
                  onClick={() => executeAlgo(algo, startValue, endValue)}
                >
                  Run Backtest
                </Button>
                <Snackbar
                  place="tr"
                  color="info"
                  icon={AddAlert}
                  message="Running Backtest."
                  open={tr}
                  closeNotification={() => setTR(false)}
                  close
                />
              </GridItem>
              <GridItem xs={3} sm={3} md={3} >
              <FormControl sx={{ m: 4, minWidth: 500 }} className={classes.formControl}> 
                <InputLabel id="demo-simple-select-label">Algo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={algo}
                        label="Algo Select"
                        xs={12} sm={12} md={12}
                        onChange={(value) => handleChange(value)}
                        className={classes.formControl}
                    >
                        <MenuItem value={'ES'}>es_algo</MenuItem>
                        <MenuItem value={'ALGO2'}>algo_2</MenuItem>
                        <MenuItem value={'ANOTHER'}>other</MenuItem>
                    </Select>
              </FormControl>
              </GridItem>
              <GridItem xs={3} sm={3} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start date"
                        value={startValue}
                        onChange={(newValue) => setStartValue(dayjs(newValue))}
                    />
                </LocalizationProvider>
              </GridItem>
              <GridItem xs={3} sm={3} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End date"
                        value={endValue}
                        onChange={(newValue) => setEndValue(dayjs(newValue))}
                    />
                </LocalizationProvider>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
    <div ref={chartContainerRef} id='test-chart-container' className={classes.container}/>
    </div>
  );
}

export default App;
