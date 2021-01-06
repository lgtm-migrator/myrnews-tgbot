/* istanbul ignore file */

import { EventEmitter } from 'events';
import { OpenTelemetryConfigurator } from '@myrotvorets/opentelemetry-configurator';

if (+(process.env.ENABLE_TRACING || 0)) {
    EventEmitter.defaultMaxListeners += 5;
}

export async function configure(): Promise<void> {
    if (+(process.env.ENABLE_TRACING || 0)) {
        const configurator = new OpenTelemetryConfigurator({
            serviceName: 'bot/myrotvorets.news',
            tracer: {
                plugins: {
                    http: {},
                    https: {},
                    knex: {
                        path: '@myrotvorets/opentelemetry-plugin-knex',
                    },
                },
            },
        });

        await configurator.start();
    }
}