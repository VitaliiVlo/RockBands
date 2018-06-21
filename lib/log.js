const winston = require('winston'),
    path = require('path');

function getLogger(module) {
    var filePath = path.basename(module.filename);
    return winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.label({ label: filePath }),
            winston.format.timestamp({format: 'HH:mm:ss'}),
            winston.format.printf(info => `[${info.timestamp}] ${info.level}: [${info.label}] ${info.message}`)
        ),
        transports: [
            new winston.transports.Console()
        ]
    });
}

module.exports = getLogger;