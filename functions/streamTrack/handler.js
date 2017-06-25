'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
const s3 = new AWS.S3()
const cf = require('aws-cloudfront-sign')
var docClient = new AWS.DynamoDB.DocumentClient()

const Logger = require('../../lib/logger')
const logger = new Logger()

const DynamoDB = require('../../lib/dynamoDB')
const dynamoDB = new DynamoDB(docClient)

const Entitlement = require('../../lib/entitlement')
const entitlement = new Entitlement(dynamoDB)

const StreamPlayList = require('../../lib/streamPlayList')
const streamPlayList = new StreamPlayList(s3, cf, entitlement, logger)

module.exports.handler = (event, context) => {
    logger.info(event, 'Invoked stream track')
    streamPlayList.processEvent(event)
        .then(data => context.succeed({
            statusCode: '200',
            body: data,
        })
        ).catch(err => {
            logger.error(event, 'Invoked stream track', err)
            context.fail(err)
        })
}
