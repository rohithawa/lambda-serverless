'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
const cf = require('aws-cloudfront-sign')
var docClient = new AWS.DynamoDB.DocumentClient()

const Logger = require('../../lib/logger')
const logger = new Logger()

const DynamoDB = require('../../lib/dynamoDB')
const dynamoDB = new DynamoDB(docClient)

const Entitlement = require('../../lib/entitlement')
const entitlement = new Entitlement(dynamoDB)

const Download = require('../../lib/download')
const download = new Download(cf, entitlement, logger)

module.exports.handler = (event, context) => {
    logger.info(event, 'Invoked download track')
    download.signedUrlMusic(event, 'mp3', 'mp3', 'audio/mpeg')
        .then(key => context.succeed({
            statusCode: '307',
            headers: {'location': `${key}`},
            body: '',
        })
        ).catch(err => {
            logger.error(event, 'Invoked download track', err)
            context.fail(err)
        })
}
