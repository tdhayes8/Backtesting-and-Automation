# local_stack
Main application running against data from interactive broker IB Gateway, Trader Workstation TWS.

# Requirements
Docker Desktop - https://www.docker.com/products/docker-desktop/

# Running the project
```
touch .env
cp .env.example .env

 # add your user specific values

docker compose up --build
```

# Running outside of docker TODO
```
cd backend

# install python3 and create virtual environment
brew install python3
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt

# TEMPORARY - ib package was compiled for python2 or something so I made some manual updates for python3 compatability. I might fork their repo and install from separate fork in the future
cp site-packages-altered-backup/ib .venv/lib/python3.13/site-packages/ib

python3 main.py

```