function socketAsyncWrapper(fn) {
    return async (...args) => {
        try {
            await fn(...args);
        } catch (error) {
            console.error(error);
        }
    };
}

function ioWrapper (fn, socket) {
    return async (...args) => {
        try {
            await fn(...args);
        } catch (error) {
            console.error(error);
            socket.send({
                error: 'An error occured'
            })
        }
    };
}

module.exports = { socketAsyncWrapper, ioWrapper };
module.exports.default = socketAsyncWrapper;
