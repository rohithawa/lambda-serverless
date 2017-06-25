'use strict'

const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'

class StreamPlayList {

    constructor(s3, cf, entitlement, logger) {
        this.s3 = s3
        this.cf = cf
        this.entitlement = entitlement
        this.logger = logger
    }

    signedUrl(productId, format, quality) {
        console.info(`Received download request with id: ${productId}, format: ${format}, quality: ${quality}`)
        let expireTime = new Date().getTime() + parseInt(process.env.EXPIRE_MILLISECONDS)
        let contentType = 'application/octet-stream'
        let options = {keypairId: process.env.KEY_PAIR_ID, privateKeyPath: CLOUDFRONT_CERT_LOCATION, expireTime: expireTime}
        let key = `${process.env.DOWNLOAD_URL}/${format}/${quality}/${productId}/${productId}.key?response-content-type=${encodeURIComponent(contentType)}`
        let signedUrl
        signedUrl = this.cf.getSignedUrl(key, options)
        return Promise.resolve(signedUrl)
    }

    replaceUrls(productId, data, format, quality) {
        return this.signedUrl(productId, format, quality)
          .then(key => {
              // Replace key with signed URL
              var body = data.Body.toString('utf-8')
              body = body.replace(productId + '.key', key)
              // Replace chunk with public URL
              let playListUrl = `${process.env.PUBLIC_DOWNLOAD_URL}/${format}/${quality}/${productId}/playlist`
              body = body.replace(/playlist/g, playListUrl)
              return Promise.resolve(body)
          })
    }

    processEvent(event) {
        this.logger.info(event, `Received stream request with id: ${event.pathParameters.productId}, format: ${event.pathParameters.format}, quality: ${event.pathParameters.quality}`)
        let productId = event.pathParameters.productId
        let format = event.pathParameters.format
        let quality = event.pathParameters.quality
        let key = `music/${format}/${quality}/${productId}/playlist.m3u8`
        let bucket = process.env.PRIVATE_MUSIC_BUCKET
        let userId = event.headers['x-user-id']
        return this.entitlement.validateMusic(userId, productId)
        .then (() => {
            return this.s3.getObject({Bucket: bucket, Key: key}).promise()
        }).then(data => {
            return this.replaceUrls(productId, data, format, quality)
        })
    }
}

module.exports = StreamPlayList
