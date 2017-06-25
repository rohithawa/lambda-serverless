process.env.KEY_PAIR_ID = 'myrandomkey'
process.env.EXPIRE_MILLISECONDS = 600000
process.env.DOWNLOAD_URL = 'http://sample.cloudfront.net/music/sample'

const chai = require('chai')
const expect = chai.expect

const Download = require('../lib/download')

describe('Test events', function () {
    function callSignedUrl(productId, userId, type, extension, contentType, category) {
        const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'
        const cf = {
            getSignedUrl: (key, options) => {
                expect(key).to.equal(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}`)
                expect(options.keypairId).to.equal(process.env.KEY_PAIR_ID)
                expect(options.privateKeyPath).to.equal(CLOUDFRONT_CERT_LOCATION)
                expect(options.expireTime).to.be.above(process.env.EXPIRE_MILLISECONDS)
                return `${key}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${options.keypairId}`
            }
        }
        const entitlement = {
            validateMusic: () => {
                console.info(`User id and product id :${!userId  || !productId}`)
                if (!userId  || !productId) {
                    return Promise.reject('Product Id or User Id can\'t be null or empty')
                } else if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject('User is not authorized to stream or download this content')
                }
            },
            validateVideo: () => {
                console.info(`User id and product id :${!userId  || !productId}`)
                if (!userId  || !productId) {
                    return Promise.reject('Product Id or User Id can\'t be null or empty')
                } else if (userId === 'userId') {
                    return Promise.resolve(true)
                } else {
                    return Promise.reject('User is not authorized to stream or download this content')
                }
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
        const download = new Download(cf, entitlement, logger)
        if (category === 'music') {
            return download.signedUrlMusic({
                pathParameters: {
                    productId: productId,
                },
                headers: {
                    userId: userId,
                }
            }, type, extension, contentType)
        } else {
            return download.signedUrlVideo({
                pathParameters: {
                    productId: productId,
                },
                headers: {
                    userId: userId,
                }
            }, type, extension, contentType)
        }
    }

    it('should call cf signed url music', function (done) {
        const productId = 'audio'
        const type = 'mp3'
        const extension = 'mp3'
        const contentType = 'audio/mpeg'
        const userId = 'userId'
        console.info(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
        callSignedUrl(productId, userId, type, extension, contentType, 'music').then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
            done()
        }).catch(err => done(err))
    })

    it('should get User is not authorized to stream or download this content', function (done) {
        const productId = 'audio'
        const type = 'mp3'
        const extension = 'mp3'
        const contentType = 'audio/mpeg'
        const userId = 'userId1'
        console.info(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
        callSignedUrl(productId, userId, type, extension, contentType, 'music')
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('User is not authorized to stream or download this content')
            done()
        })
    })

    it('should get Product Id or User Id can\'t be null or empty', function (done) {
        const productId = ''
        const type = 'mp3'
        const extension = 'mp3'
        const contentType = 'audio/mpeg'
        const userId = ''
        console.info(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
        callSignedUrl(productId, userId, type, extension, contentType, 'music')
        .catch(err => {
            console.info(`Error value :${err}`)
            expect(err).to.equal('Product Id or User Id can\'t be null or empty')
            done()
        })
    })

    it('should call cf signed url video', function (done) {
        const productId = 'video'
        const type = 'mp4'
        const extension = 'mp4'
        const contentType = 'video/mp4'
        const userId = 'userId'
        console.info(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
        callSignedUrl(productId, userId, type, extension, contentType, 'video').then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal(`${process.env.DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
            done()
        }).catch(err => done(err))
    })
})
