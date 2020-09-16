# Walmart Challenge API

This is a Koa 2 Project

## Requirements
- Node JS 12.8.3
- Docker (for deployment)

## Run for development

First, install dependencies:

```bash
npm install
```

Create an `.env` file with Mongo URI. Example:

```
MONGO_URI=mongodb://127.0.0.1:27018/promotions?
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:3000) with your browser to see the healthcheck response.

## Testing

Just run:

```bash
npm run test
```

## Run with Docker

Build the image:

```bash
npm run docker-build
```

The image `walmart-challenge` would be ready to be deployed. You can also run the container locally by entering:
(You need the .env file put in place)

```bash
npm run docker-start
```

## Live demo in Heroku

https://stormy-dusk-87264.herokuapp.com/
