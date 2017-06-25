'use strict'

const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'

class DownloadSample {

    constructor(cf) {
        this.cf = cf
    }

    signedUrl(event, type, extension, contentType) {
        console.info(`Received sample download request with id: ${event.pathParameters.productId}, type: ${type}, extension: ${extension}, contentType: ${contentType}`)
        let expireTime = new Date().getTime() + parseInt(process.env.EXPIRE_MILLISECONDS)
        let productId = event.pathParameters.productId
        let options = {keypairId: process.env.KEY_PAIR_ID, privateKeyPath: CLOUDFRONT_CERT_LOCATION, expireTime: expireTime}
        let key = `${process.env.SAMPLE_DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}`
        let signedUrl
        signedUrl = this.cf.getSignedUrl(key, options)
        return Promise.resolve(signedUrl)
    }
}

module.exports = DownloadSample
