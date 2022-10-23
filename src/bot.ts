/* istanbul ignore file */

import crypto from 'node:crypto';
import { Bot } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import Bugsnag from '@bugsnag/js';
import { getEnvironment } from './lib/environment';
import { lifecycle } from './controllers/lifecycle';
import { startBugsnag } from './lib/bugsnag';
import { createServer } from './lib/server';

function fatal(err: Error): void {
    console.error(err);
    Bugsnag.notify(err);
    process.exit(1);
}

(async (): Promise<void> => {
    const env = getEnvironment();
    await startBugsnag(env);

    try {
        const bot = new Bot(env.BOT_TOKEN);
        bot.api.config.use(autoRetry({ maxRetryAttempts: 10, maxDelaySeconds: 60, retryOnInternalServerErrors: true }));

        if (env.WEBHOOK_DOMAIN && env.WEBHOOK_PORT) {
            const random = crypto.randomBytes(32).toString('hex');
            const hookPath = env.PATH_PREFIX ? `/${env.PATH_PREFIX}/${random}` : `/${random}`;
            const server = createServer(bot, hookPath);
            server.on('error', fatal);
            server.listen(env.WEBHOOK_PORT, env.LISTEN_HOST, () => {
                bot.api.setWebhook(`https://${env.WEBHOOK_DOMAIN}${hookPath}`).catch(fatal);
            });

            process.on('SIGTERM', (): void => {
                bot.api.setWebhook('').finally(() => {
                    server.close(() => process.exit(0));
                });
            });
        } else {
            bot.start().catch(fatal);
            process.on('SIGTERM', () => {
                bot.stop().finally(() => process.exit(0));
            });
        }

        process.on('SIGINT', () => process.kill(process.pid, 'SIGTERM'));

        lifecycle(env, bot);
    } catch (e) {
        fatal(e as Error);
    }
})().catch(fatal);
