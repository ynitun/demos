# Weather Forecast & Traffic Cam Website  Frontend Template
## Prerequisites

- NodeJS v18 or above must be installed
- eslint and prettier plugins to be installed in your corresponding IDE for code formatting.
  - For VSCode:
    - eslint
    - prettier

## Sourcecode 
- git clone from https://github.com/ynitun/demos


## Quickstart Frontend

1. Run `cd wftc`
2. Run `npm install`
3. Run `npm start-dev`
4. Go to `http://localhost:5173/`


## Quickstart Backend

1. Run `cd wftc-api`
2. Run `npm install`
3. Run `docker compose up wftc -d`
4. Run 'npm i -g prisma'
5. Run `prisma generate`
6. Run `npm run dev`

## Techstack 


ReactJS, Typescript, NestJs, postgres

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)


## Environment Variables

Environment variables are set in .env file.

For the app take them into account, you need to run `npm run dev` at least once (for env-config.js to be created)


Runs a script to prepare create environment configs and start the app in development mode

## Endpoints to try out in postman

WFTC-API.postman_collection.json is included to provide postman information 

##  Unit Test

# Frontend
1. Run `cd wftc`
2. Run `npm run test`

# Backend

1. Run `cd wftc-api`
2. Run `npm test`


