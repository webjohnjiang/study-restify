'use strict'

require('events').defaultMaxListeners = Infinity
const crypto = require('crypto')

module.exports = () => {
  const content = crypto.rng(5000).toString('hex')
  const ONE_MINUTE = 60000
  var last = Date.now()

  function timestamp () {
    var now = Date.now()
    // if (now - last >= ONE_MINUTE) last = now
    return now
  }

  function etagger (server) {
    var cache = {}
    server.on('after', (req, res) => {
        if (res.statusCode !== 200) return
        if (!res._body) return
        const key = crypto.createHash('sha512')
          .update(req.url)
          .digest()
          .toString('hex')
        console.log('计算body hash', res._body)
        const etag = crypto.createHash('sha512')
          .update(JSON.stringify(res._body))
          .digest()
          .toString('hex')
        console.log('etag', etag)
        if (cache[key] !== etag) cache[key] = etag
      })

    return function (req, res, next) {
      const key = crypto.createHash('sha512')
        .update(req.url)
        .digest()
        .toString('hex')
      if (key in cache) res.set('Etag', cache[key])
      res.set('Cache-Control', 'public, max-age=120')
      next()
    }
  }

  function fetchContent (url, cb) {
    setImmediate(() => {
      if (url !== '/seed/v1') cb(Object.assign(Error('Not Found'), {statusCode: 404}))
      else cb(null, content)
    })
  }

  return { timestamp, etagger, fetchContent }

}