# Cypress Test

## Prerequisites
Having installed:
- [Node.js](https://nodejs.org/) 
- [Yarn](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started/) optional, only if you wanto validate [Test pipeline locally](#test-pipeline-locally)

## Init Project

Copy the content of .env.example in a new file .env and add a value for the variables

run:
```shell
yarn install --frozen-lockfile
```

## Test Pipeline Locally

```shell
brew install act #install for testing pipeline locally
act -j test -s ACT=true
```