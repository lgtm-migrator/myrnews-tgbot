import { Server as HttpServer, IncomingMessage, ServerResponse, createServer as createHttpServer } from 'node:http';
import { Server as HttpsServer, createServer as createHttpsServer } from 'node:https';
import { Bot, Context, webhookCallback } from 'grammy';

export type Server = HttpServer | HttpsServer;

export function createServer<C extends Context = Context>(bot: Bot<C>, path: string): HttpServer;
export function createServer<C extends Context = Context>(
    bot: Bot<C>,
    path: string,
    key: string,
    cert: string,
): HttpsServer;
export function createServer<C extends Context = Context>(
    bot: Bot<C>,
    path: string,
    key?: string,
    cert?: string,
): Server {
    const callback = (req: IncomingMessage, res: ServerResponse): unknown => {
        if (req.url && req.headers.host) {
            const url = new URL(req.url, `https://${req.headers.host}`);
            if (url.pathname === path) {
                return webhookCallback(bot, key ? 'https' : 'http')(req, res);
            }
        }

        res.writeHead(404);
        return res.end();
    };

    return key ? createHttpsServer({ key, cert }, callback) : createHttpServer(callback);
}
