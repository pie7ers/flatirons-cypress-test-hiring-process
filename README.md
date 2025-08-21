# Cypress Test

## Init project

Copy the content of .env.example in a new file .env and add a value for the variables

run:
```shell
yarn install --frozen-lockfile
```

## test pipeline locally

```shell
brew install act #install for testing pipeline locally
act -j test -s ACT=true
```