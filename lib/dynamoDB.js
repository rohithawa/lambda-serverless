'use strict'

class DynamoDB {

    constructor(dynamo) {
        this.dynamo = dynamo
    }

    getMusicProductEntitlements(userId, start, limit) {
        let params = {
            TableName: process.env.DYNAMO_USER_MUSIC_ENTITLEMENT,
            IndexName: process.env.DYNAMO_USER_MUSIC_ENTITLEMENT_INDEX_CREATEDATE,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames:{
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId':userId
            }
        }
        return this.dynamo.query(params).promise()
        .then(data => {
            let pageData = data.Items.slice(start, start + limit)
            return Promise.resolve(pageData)
        }).catch(err => console.error(err))
    }

    createMusicEntitlement(event) {
        return this.dynamo.put({
            TableName: process.env.DYNAMO_USER_MUSIC_ENTITLEMENT,
            Item: {
                userId: event.userId,
                productId: event.productId,
                createdDate: new Date().toISOString(),
            },
        }).promise()
        .catch(err => console.error(err))
    }

    isEntitlement(userId, productId, tableName) {
        let params = {
            TableName: tableName,
            KeyConditionExpression: '#userId = :userId and #productId = :productId',
            ExpressionAttributeNames:{
                '#userId': 'userId',
                '#productId': 'productId'
            },
            ExpressionAttributeValues: {
                ':userId':userId,
                ':productId':productId
            }
        }
        return this.dynamo.query(params).promise()
        .then(data => {
            if (data.Items && data.Items.length > 0){
                return Promise.resolve(true)
            }else {
                return Promise.resolve(false)
            }
        })
    }

    isSubscription(userId, tableName) {
        let params = {
            TableName: tableName,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames:{
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId':userId
            }
        }
        return this.dynamo.query(params).promise()
        .then(data => {
            if (data.Items && data.Items.length > 0){
                return Promise.resolve(true)
            }else {
                return Promise.resolve(false)
            }
        })
    }
}

module.exports = DynamoDB
