# Budget & Expense Tracker

## Installation

1. Duplicate `.example.env` and name it `.env`. Fill in environment variables as needed.

2. Install API dependencies.

```bash
cd api
yarn
```

3. Build the images and start the app for the first time.

```bash
# From root directory
docker-compose up
```

## Starting/stopping the app

### Start

```bash
docker-compose up
```

### Stop

```bash
docker-compose stop
```

### Remove all containers

```bash
docker-compose down
```
