 
module.exports = async function errorHandler(req, res, error) {
    await res.status(500).json({
        errors: [{
            msg: error.message,
            code: 500
        }]
    });
};