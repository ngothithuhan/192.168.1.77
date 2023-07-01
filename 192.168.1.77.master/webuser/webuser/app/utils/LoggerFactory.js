/**
 * A little logger for this library to use internally.
 * Basically just a wrapper around `console.log` with
 * support for feature-detection.
 *
 * @api private
 * @factory
 */
function LoggerFactory(options) {
    options = options || {
        prefix: true,
        module: ''
    };

    // If `console.log` is not accessible, `log` is a noop.
    if (
        typeof console !== 'object' ||
        typeof console.log !== 'function' ||
        typeof console.log.bind !== 'function'
    ) {
        return function noop() { };
    }

    return function log() {
        var args = Array.prototype.slice.call(arguments);

        // All logs are disabled when `io.sails.environment = 'production'`.
        if (io.sails.environment === 'production') return;

        // Add prefix to log messages (unless disabled)
        var PREFIX = options.module;
        if (options.prefix) {
            args.unshift(PREFIX);
        }

        // Call wrapped logger
        console.log
            .bind(console)
            .apply(this, args);
    };
}//</LoggerFactory>

// Create a private logger instance
var consolog = LoggerFactory();
consolog.noPrefix = LoggerFactory({
    prefix: false
});
module.exports = { LoggerFactory };