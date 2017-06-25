'use strict'

class Entitlement {

    constructor(dynamoDB, logger) {
        this.dynamoDB = dynamoDB
        this.logger = logger
    }

    getProductEntitlements(event) {
        this.logger.info(event, 'Received get music products entitlements request')
        if (!event.headers || !event.headers['x-user-id']) {
            return Promise.reject('User Id can\'t be null or empty')
        }
        let userId = event.headers['x-user-id']
        let start = 0
        let limit = parseInt(process.env.DEFAULT_PAGINATION_LIMIT)
        if (event.queryStringParameters && event.queryStringParameters.size){
            limit = parseInt(event.queryStringParameters.size)
        }
        if (event.queryStringParameters && event.queryStringParameters.page){
            start = parseInt(event.queryStringParameters.page)*limit
        }

        return this.dynamoDB.getMusicProductEntitlements(userId, start, limit)
    }

    createEntitlement(event) {
        if (!event.userId || !event.productId) {
            return Promise.reject('Product Id or User Id can\'t be null or empty')
        }
        return this.dynamoDB.createMusicEntitlement(event)
    }

    validateMusic(userId, productId) {
        console.info(`Validate music entitlements with user id: ${userId}, product id: ${productId}`)
        if (!userId  || !productId) {
            return Promise.reject('Product Id or User Id can\'t be null or empty')
        }
        return this.dynamoDB.isEntitlement(userId, productId, process.env.DYNAMO_USER_MUSIC_ENTITLEMENT)
        .then (res => {
            if (res === false){
                return this.dynamoDB.isSubscription(userId, process.env.DYNAMO_USER_MUSIC_SUBSCRIPTION)
            } else {
                return res
            }
        }).then (res => {
            if (res === false){
                return Promise.reject('User is not authorized to stream or download this content')
            } else {
                return res
            }
        })
    }

    validateVideo(userId, productId) {
        console.info(`Validate video entitlements with user id: ${userId}, product id: ${productId}`)
        if (!userId  || !productId) {
            return Promise.reject('Product Id or User Id can\'t be null or empty')
        }
        return this.dynamoDB.isEntitlement(userId, productId, process.env.DYNAMO_USER_VIDEO_ENTITLEMENT)
        .then (res => {
            if (res === false){
                return this.dynamoDB.isSubscription(userId, process.env.DYNAMO_USER_VIDEO_SUBSCRIPTION)
            } else {
                return res
            }
        }).then (res => {
            if (res === false){
                return Promise.reject('User is not authorized to stream or download this content')
            } else {
                return res
            }
        })
    }
}

module.exports = Entitlement
