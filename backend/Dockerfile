# Use an official Python runtime as a parent image
FROM python:3.7

# Install necessary system requirements
RUN apt-get update && apt-get install -y \
    python3-tk 

# Set the working directory in the container
WORKDIR /app

COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
ADD backtesting_data /app/
ADD src /app/
# ADD strategies /app/
ADD main.py /app/

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run main.py when the container launches
# CMD ["python", "-u", "main.py"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
