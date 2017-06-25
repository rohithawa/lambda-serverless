# lambda-serverless


## Overview
Serverless project to implementation
  - signed cloudfront URLs.
  - cludformation for dynomodb
  - cludformation for cloudfront


## Setup Instructions


In order to build and test this project, run the following command:
```bash
$ npm install && npm run test-all
```


In order to build and test this project, run the following command:
```
$ npm install && npm run deploy
```

#Invoking
##Local
```bash
serverless invoke local --function musicSampleTrack --path functions/sampleTrack/event.json
```

##AWS
```bash
serverless invoke -l --function musicSampleTrack --path functions/sampleTrack/event.json
```
