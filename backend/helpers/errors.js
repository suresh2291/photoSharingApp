//This handler is used internally for handling error with response status and message.
module.exports = async function errorHandler(req, res, error) {
    await res.status(500).json({
        errors: [{
            msg: error.message,
            code: 500
        }]
    });
};