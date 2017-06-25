process.env.KEY_PAIR_ID = 'myrandomkey'
process.env.EXPIRE_MILLISECONDS = 600000
process.env.SAMPLE_DOWNLOAD_URL = 'http://sample.cloudfront.net/music/sample'

const chai = require('chai')
const expect = chai.expect

const Download = require('../lib/downloadSample')

describe('Test events', function () {
    function callSignedUrl(productId, type, extension, contentType) {
        const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'
        const cf = {
            getSignedUrl: (key, options) => {
                expect(key).to.equal(`${process.env.SAMPLE_DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}`)
                expect(options.keypairId).to.equal(process.env.KEY_PAIR_ID)
                expect(options.privateKeyPath).to.equal(CLOUDFRONT_CERT_LOCATION)
                expect(options.expireTime).to.be.above(process.env.EXPIRE_MILLISECONDS)
                return `${key}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${options.keypairId}`
            }
        }

        const download = new Download(cf)

        return download.signedUrl({
            pathParameters: {
                productId: productId,
            }
        }, type, extension, contentType)
    }

    it('should call cf signed url', function (done) {
        const productId = 'audio'
        const type = 'mp3'
        const extension = 'mp3'
        const contentType = 'audio/mpeg'
        console.info(`${process.env.SAMPLE_DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
        callSignedUrl(productId, type, extension, contentType).then(res => {
            console.info(`Return value :${res}`)
            expect(res).to.equal(`${process.env.SAMPLE_DOWNLOAD_URL}/${type}/${productId}.${extension}?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
            done()
        }).catch(err => done(err))
    })
})
