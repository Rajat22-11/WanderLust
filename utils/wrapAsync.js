module.exports = (fn) => {
    return function(req, res, next) {
        fn(req, res, next)
            .catch(next); // Forward any caught errors to Express error handler
    }
}
