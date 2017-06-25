const chai = require('chai')
const expect = chai.expect

const Entitlement = require('../lib/entitlement')

describe('Test events', function () {
    function callValidateMusic(userId, productId) {
        const dynamoDB = {
            isEntitlement: () => {
                if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            },
            isSubscription: () => {
                if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            }
        }
        const entitlement = new Entitlement(dynamoDB)

        return entitlement.validateMusic(userId, productId)
    }

    it('should call validation music', function (done) {
        const productId = 'audio'
        const userId = 'userId'
        callValidateMusic(userId, productId).then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal(true)
            done()
        }).catch(err => done(err))
    })

    it('should get User is not authorized to stream or download this content', function (done) {
        const productId = 'audio'
        const userId = 'userId1'
        callValidateMusic(userId, productId)
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('User is not authorized to stream or download this content')
            done()
        })
    })

    it('should get Product Id or User Id can\'t be null or empty', function (done) {
        const productId = ''
        const userId = ''
        callValidateMusic(userId, productId)
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('Product Id or User Id can\'t be null or empty')
            done()
        })
    })

    function callValidateVideo(userId, productId) {
        const dynamoDB = {
            isEntitlement: () => {
                if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            },
            isSubscription: () => {
                if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.resolve(false)
                }
            }
        }
        const entitlement = new Entitlement(dynamoDB)

        return entitlement.validateVideo(userId, productId)
    }

    it('should call validation video', function (done) {
        const productId = 'audio'
        const userId = 'userId'
        callValidateVideo(userId, productId).then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal(true)
            done()
        }).catch(err => done(err))
    })

    it('should get User is not authorized to stream or download this content', function (done) {
        const productId = 'audio'
        const userId = 'userId1'
        callValidateVideo(userId, productId)
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('User is not authorized to stream or download this content')
            done()
        })
    })

    it('should get Product Id or User Id can\'t be null or empty', function (done) {
        const productId = ''
        const userId = ''
        callValidateVideo(userId, productId)
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('Product Id or User Id can\'t be null or empty')
            done()
        })
    })

    function callGetProductEntitlements(event) {
        const dynamoDB = {
            getMusicProductEntitlements: () => {
                const data = [
                    {
                        productId: 'productId1',
                        userId: 'userId',
                        createdDate: '01/01/2017'
                    },
                    {
                        userId: 'userId',
                        productId: 'productId2',
                        createdDate: '02/01/2017'
                    }
                ]
                return Promise.resolve(data)
            }
        }
        const logger = {
            info: () => {
                console.info('info')
            },
            error: () => {
                console.error('error')
            }
        }
        const entitlement = new Entitlement(dynamoDB, logger)

        return entitlement.getProductEntitlements(event)
    }

    it('should call get product entitlements', function (done) {
        const userId = 'userId'
        callGetProductEntitlements({
            queryStringParameters: {
                page: 0,
                size: 3
            },
            headers:{
                'x-user-id': userId,
                'x-partner-id': 'partnerId',
                'x-correlation-id': 'correlationId'
            }
        }).then(res => {
            console.info(`Return value :${res}`)
            expect(res.length).to.equal(2)
            done()
        }).catch(err => done(err))
    })

    it('should call get product entitlements and page=1', function (done) {
        const userId = 'userId'
        callGetProductEntitlements({
            queryStringParameters: {
                page: 1,
                size: 3
            },
            headers:{
                'x-user-id': userId,
                'x-partner-id': 'partnerId',
                'x-correlation-id': 'correlationId'
            }
        }).then(res => {
            console.info(`Return value :${res}`)
            expect(res.length).to.equal(2)
            done()
        }).catch(err => done(err))
    })

    it('should call get product entitlements and get default size and start', function (done) {
        const userId = 'userId'
        callGetProductEntitlements({
            headers:{
                'x-user-id': userId,
                'x-partner-id': 'partnerId',
                'x-correlation-id': 'correlationId'
            }
        }).then(res => {
            console.info(`Return value :${res}`)
            expect(res.length).to.equal(2)
            done()
        }).catch(err => done(err))
    })

    it('should get User Id can\'t be null or empty', function (done) {
        callGetProductEntitlements({
            queryStringParameters: {
                page: 0,
                size: 3
            },
            headers:{
                'x-user-id': '',
                'x-partner-id': 'partnerId',
                'x-correlation-id': 'correlationId'
            }
        }).catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('User Id can\'t be null or empty')
            done()
        })
    })

    function callCreateEntitlement(event) {
        const dynamoDB = {
            createMusicEntitlement: () => {
                return Promise.resolve('success')
            }
        }
        const logger = {
            info: () => {
                console.info('info')
            },
            error: () => {
                console.error('error')
            }
        }
        const entitlement = new Entitlement(dynamoDB, logger)

        return entitlement.createEntitlement(event)
    }

    it('should get Product Id or User Id can\'t be null or empty', function (done) {
        callCreateEntitlement({
            partnerId: 'partnerId',
            correlationId: 'correlationId',
            userId: '',
            productId: 'testproduct1'
        }).catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('Product Id or User Id can\'t be null or empty')
            done()
        })
    })

    it('should get Product Id or User Id can\'t be null or empty', function (done) {
        callCreateEntitlement({
            partnerId: 'partnerId',
            correlationId: 'correlationId',
            userId: 'userId',
            productId: ''
        }).catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('Product Id or User Id can\'t be null or empty')
            done()
        })
    })

    it('should call create entitlement', function (done) {
        callCreateEntitlement({
            partnerId: 'partnerId',
            correlationId: 'correlationId',
            userId: 'userId',
            productId: 'testproduct1'
        }).then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal('success')
            done()
        }).catch(err => done(err))
    })
})
