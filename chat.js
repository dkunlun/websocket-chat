const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const convert = require('koa-convert')
const static = require('koa-static')
const app = new Koa()

const staticPath = './view'

app.use(convert(static(
	path.join(__dirname, staticPath)
)))

const Router = require('koa-router')

function render(page) {
	return new Promise((resolve, reject) => {
		let viewUrl = `./view/${page}`
		fs.readFile(viewUrl, "binary", (err, data) => {
			if(err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

async function route(url) {
	let view = '404.html'
	let name = url.substr(6)
	if(name) {
		view = name + '.html'
	} else {
		view = 'index.html'
	}

	let html = await render(view)
	return html
}

let home = new Router()

home.get('/', async(ctx) => {
	let url = ctx.request.url
	let html = await route(url)
	ctx.body = html
})

let page = new Router()

page.get('/404', async (ctx) => {
	let url = ctx.request.url
	let html = await route( url )
	ctx.body = html
}).get('/todo', async (ctx) => {
	let url = ctx.request.url
	let html = await route( url )
	ctx.body = html
}).get('/chat', async (ctx) => {
	let url = ctx.request.url
	let html = await route( url )
	ctx.body = html
})

let router = new Router()

router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

var WebSocket = require('ws'),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port:8181 }),
	speaker = null;

wss.on('connection', function (ws, req) {
	ws.on('message', function incoming(data) {
		wss.clients.forEach(function each(client) {
			if(client.readyState === WebSocket.OPEN) {
				client.send(data)
			}
		})
	})

	// ws.send('{"speaker": "=="}');
})

app.listen(3000)
console.log('[demo] route-simple is starting at port 3000')
