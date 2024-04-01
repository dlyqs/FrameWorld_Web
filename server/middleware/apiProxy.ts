import { createProxyMiddleware } from 'http-proxy-middleware'

// @ts-ignore
// 创建一个代理中间件实例
const proxyMiddleware = createProxyMiddleware({
    target: process.env.SERVER_DOMAIN,
    pathFilter: '/api',
});

export default defineEventHandler(async (event) => {
    await new Promise((resolve, reject) => {
        // 使用已创建的代理中间件实例
        proxyMiddleware(event.node.req, event.node.res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
});