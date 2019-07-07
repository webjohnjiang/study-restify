const restify = require('restify')

const server = restify.createServer()

// 无论是否匹配到路由，都会走server.pre
server.pre(function (req, res, next) {
    console.log('pre handler')
    next(new Error('nonono'))
})

// 只有匹配到路由的才会执行use。 否则空路由只会执行server.pre
server.use(function (req, res, next) {
    console.log('post handler')
    if (req.params.name === 'cuiyongjian') {
        res.send('do not use cuiyongjian')
        return
    }
    return next()
})

server.get('/hello/:name', function (req, res, next) {
    res.send('hello ' + req.params.name)
    // next()
})


server.listen(8081, function() {
    console.log('%s is listening at %s', server.name, server.url)
})