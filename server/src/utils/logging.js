import winston from 'winston'

const transports = []

if (process.env.NODE_ENV === 'production') {
	transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
	transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

const logger = winston.createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: winston.format.json(),
	transports,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple(),
	}));
}

export default logger
