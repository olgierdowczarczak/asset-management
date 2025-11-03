import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;
const logFormat = printf(({ level, message, timestamp, prefix }) => `[${timestamp}] [${level}]${prefix ? ` [${prefix}]` : ''} ${message}`);
const getLogger = prefix => {
    return createLogger({
        level: 'silly',
        format: combine(
            format(info => {
                info.prefix = prefix;
                return info;
            })(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            colorize(),
            logFormat
        ),
        transports: [new transports.Console()]
    });
};

export default getLogger;
