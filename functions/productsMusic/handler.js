'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
var docClient = new AWS.DynamoDB.DocumentClient()

const Logger = require('../../lib/logger')
const logger = new Logger()

const DynamoDB = require('../../lib/dynamoDB')
const dynamoDB = new DynamoDB(docClient)

const Entitlement = require('../../lib/entitlement')
const entitlement = new Entitlement(dynamoDB, logger)

module.exports.handler = (event, context) => {
    logger.info(event, 'Invoked products music')
    entitlement.getProductEntitlements(event)
        .then(data => context.succeed({
            statusCode: '200',
            body: data,
        })
    ).catch(err => {
        logger.error(event, 'Invoked products music', err)
        context.fail(err)
    })
}
