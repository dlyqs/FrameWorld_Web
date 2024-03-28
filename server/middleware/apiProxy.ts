import { createProxyMiddleware } from 'http-proxy-middleware'
import { EventEmitter } from 'events';

// @ts-ignore
export default defineEventHandler(async (event) => {
    await new Promise((resolve, reject) => {
        createProxyMiddleware({
            target: process.env.SERVER_DOMAIN,
            pathFilter: '/api',
        })(event.node.req, event.node.res, (err) => {
            if (err)
                reject(err)
            else
                resolve(true)
        })
    })
})
