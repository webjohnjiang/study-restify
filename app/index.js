// 例子。参考自：https://www.smashingmagazine.com/2018/06/nodejs-tools-techniques-performance-servers/
// 备注：这是文章中的 slow 版本

'use strict'

const restify = require('restify')
const { etagger, timestamp, fetchContent } = require('./util')()
const server = restify.createServer()

server.use(etagger(server))

server.get('/seed/v1', function (req, res, next) {
  fetchContent(req.url, (err, content) => {
    if (err) return next(err)
    res.send({data: content, url: req.url, ts: timestamp()})
    next()
  })
})

server.listen(3000)