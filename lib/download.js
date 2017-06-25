'use strict'

const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'

class Download {

    constructor(cf, entitlement, logger) {
        this.cf = cf
        this.entitlement = entitlement
        this.logger = logger
    }

    signedUrlMusic(event, type, extension, contentType) {
        this.logger.info(event, `Received download request with id: ${event.pathParameters.productId}, type: ${type}, extension: ${extension}, contentType: ${contentType}`)
        let productId = event.pathParameters.productId
        let userId = event.headers['x-user-id']
        return this.entitlement.validateMusic(userId, productId)
        .then (() => {
            let expireTime = new Date().getTime() + parseInt(process.env.EXPIRE_MILLISECONDS)
            let options = {keypairId: process.env.KEY_PAIR_ID, privateKeyPath: CLOUDFRONT_CERT_LOCATION, expireTime: expireTime}
            let key = `${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}`
            let signedUrl
            signedUrl = this.cf.getSignedUrl(key, options)
            return Promise.resolve(signedUrl)
        })
    }

    signedUrlVideo(event, type, extension, contentType) {
        this.logger.info(event, `Received download request with id: ${event.pathParameters.productId}, type: ${type}, extension: ${extension}, contentType: ${contentType}`)
        let productId = event.pathParameters.productId
        let userId = event.headers['x-user-id']
        return this.entitlement.validateVideo(userId, productId)
        .then (() => {
            let expireTime = new Date().getTime() + parseInt(process.env.EXPIRE_MILLISECONDS)
            let options = {keypairId: process.env.KEY_PAIR_ID, privateKeyPath: CLOUDFRONT_CERT_LOCATION, expireTime: expireTime}
            let key = `${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}`
            let signedUrl
            signedUrl = this.cf.getSignedUrl(key, options)
            return Promise.resolve(signedUrl)
        })
    }
}

module.exports = Download
