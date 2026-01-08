const async_handler = (requestHandler) => {
    return (req, res, next) => {
        promise.resolve(requestHandler(res, req, next)).catch(next(err))
    }
}

















export { async_handler }