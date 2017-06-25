'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
const cf = require('aws-cloudfront-sign')

const DownloadSample = require('../../lib/downloadSample')
const downloadSample = new DownloadSample(cf)

module.exports.handler = (event, context) => {
    console.info(`Invoked sample track: ${event.pathParameters.productId}`)
    downloadSample.signedUrl(event, 'mp3', 'mp3', 'audio/mpeg')
        .then(key => context.succeed({
            statusCode: '307',
            headers: {'location': `${key}`},
            body: '',
        })
        ).catch(err => {
            console.error(`Invoked sample track: ${event.pathParameters.productId} and error: ${err}`)
            context.fail(err)
        })
}
