process.env.KEY_PAIR_ID = 'myrandomkey'
process.env.EXPIRE_MILLISECONDS = 600000
process.env.DOWNLOAD_URL = 'http://download.cloudfront.net/music'
process.env.PRIVATE_MUSIC_BUCKET = 'PRIVATE_MUSIC_BUCKET'
process.env.PUBLIC_DOWNLOAD_URL = 'http://public-download.cloudfront.net/music'

const chai = require('chai')
const expect = chai.expect

const Download = require('../lib/streamPlayList')
const contentType = 'application/octet-stream'

describe('Test events', function () {
    const CLOUDFRONT_CERT_LOCATION = 'cert/cloudfront.pem'
    const productId = '0206360f-d048-45f5-af80-aac37ae586f1'
    const format = 'hls'
    const quality = 'ld'
    const playListData = {Body:'#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:11\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-KEY:METHOD=AES-128,URI="0206360f-d048-45f5-af80-aac37ae586f1.key",IV=0x4d79f97cc7bc9f1dfe7cff7fdb7db704\n#EXTINF:10,\nplaylist000.ts\n#EXTINF:10,\nplaylist001.ts\n#EXT-X-ENDLIST'}
    const cf = {
        getSignedUrl: (key, options) => {
            expect(key).to.equal(`${process.env.DOWNLOAD_URL}/${format}/${quality}/${productId}/${productId}.key?response-content-type=${encodeURIComponent(contentType)}`)
            expect(options.keypairId).to.equal(process.env.KEY_PAIR_ID)
            expect(options.privateKeyPath).to.equal(CLOUDFRONT_CERT_LOCATION)
            expect(options.expireTime).to.be.above(process.env.EXPIRE_MILLISECONDS)
            return `${key}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${options.keypairId}`
        }
    }

    const s3 = {
        getObject: (data) => {
            expect(data.Bucket).to.equal(process.env.PRIVATE_MUSIC_BUCKET)
            expect(data.Key).to.equal(`music/${format}/${quality}/${productId}/playlist.m3u8`)
            return {
                promise: () => Promise.resolve(playListData)
            }
        }
    }

    const entitlement = {
        validateMusic: () => {
            return Promise.resolve(true)
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

    const download = new Download(s3, cf, entitlement, logger)

    function callSignedUrl(productId, format, quality) {
        return download.signedUrl(productId, format, quality)
    }

    it('should call cf signed url', function (done) {
        callSignedUrl(productId, format, quality).then(res => {
            expect(res).to.equal(`${process.env.DOWNLOAD_URL}/${format}/${quality}/${productId}/${productId}.key?response-content-type=${encodeURIComponent(contentType)}&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=${process.env.KEY_PAIR_ID}`)
            done()
        }).catch(err => done(err))
    })

    it('should call process Event', function (done) {
        download.processEvent({
            pathParameters: {
                productId: '0206360f-d048-45f5-af80-aac37ae586f1',
                format: 'hls',
                quality: 'ld'
            },
            headers: {
                'x-user-id': 'userId'
            }
        }).then(res => {
            const expectedValue = '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:11\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-PLAYLIST-TYPE:VOD\n#EXT-X-KEY:METHOD=AES-128,URI="http://download.cloudfront.net/music/hls/ld/0206360f-d048-45f5-af80-aac37ae586f1/0206360f-d048-45f5-af80-aac37ae586f1.key?response-content-type=application%2Foctet-stream&Expires=1497529320&Policy=eyJTdGF0ZW1lbnQiOlt7__&Signature=ZC~3GMlTcfoRw__&Key-Pair-Id=myrandomkey",IV=0x4d79f97cc7bc9f1dfe7cff7fdb7db704\n#EXTINF:10,\nhttp://public-download.cloudfront.net/music/hls/ld/0206360f-d048-45f5-af80-aac37ae586f1/playlist000.ts\n#EXTINF:10,\nhttp://public-download.cloudfront.net/music/hls/ld/0206360f-d048-45f5-af80-aac37ae586f1/playlist001.ts\n#EXT-X-ENDLIST'
            expect(res).to.equal(expectedValue)
            done()
        }).catch(err => done(err))
    })
})
