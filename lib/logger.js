'use strict'

class Logger {

    info(event, message) {
        console.info(`[x-partner-id:${event.headers['x-partner-id']}, x-correlation-id:${event.headers['x-correlation-id']}, x-user-id:${event.headers['x-user-id']}] ${message}`)
    }

    error(event, message, error) {
        console.error();(`[x-partner-id:${event.headers['x-partner-id']}, x-correlation-id:${event.headers['x-correlation-id']}, x-user-id:${event.headers['x-user-id']}] ${message} error:${error}`)
    }
}

module.exports = Logger
