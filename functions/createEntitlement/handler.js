'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
var docClient = new AWS.DynamoDB.DocumentClient()

const DynamoDB = require('../../lib/dynamoDB')
const dynamoDB = new DynamoDB(docClient)

const Entitlement = require('../../lib/entitlement')
const entitlement = new Entitlement(dynamoDB)

module.exports.handler = (event, context) => {
    console.info('Invoked create entitlement', event)
    entitlement.createEntitlement(event)
        .then(data => context.succeed({
            statusCode: '200',
            body: data,
        })
    ).catch(err => {
        console.error('Invoked create entitlement error: ${err}', event)
        context.fail(err)
    })
}
