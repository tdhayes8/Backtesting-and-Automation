# OOS Data Backtesting and Automated Trading w/ Frontend UI for Manual Trading or Visualization
Main application running against data from interactive broker IB Gateway, Trader Workstation TWS.

Backtesting data needs to be imported. Examples found in backend/backtesting_data. Extracted using the yfinance library.

Barchart and other sources can be used to get extensive data between 2010 and 2025 for free or a small cost.

Currently missing our proprietary algorithms, and will need a sample one created, and import statements throughout the application to be updated.

# Requirements
Docker Desktop - https://www.docker.com/products/docker-desktop/

# Running the project
```
docker compose up --build
```

Various API endpoints exist in the frontend and backend sections of the app for web based execution of backtesting, live trading and charting.
