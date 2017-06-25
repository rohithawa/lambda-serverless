'use strict'

const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)
const cf = require('aws-cloudfront-sign')

const DownloadSample = require('../../lib/downloadSample')
const downloadSample = new DownloadSample(cf)

module.exports.handler = (event, context) => {
    console.info(`Invoked sample video: ${event.pathParameters.productId}`)
    downloadSample.signedUrl(event, 'mp4', 'mp4', 'video/mp4')
        .then(key => context.succeed({
            statusCode: '307',
            headers: {'location': `${key}`},
            body: '',
        })
        ).catch(err => {
            console.error(`Invoked sample video: ${event.pathParameters.productId} and error: ${err}`)
            context.fail(err)
        })
}
