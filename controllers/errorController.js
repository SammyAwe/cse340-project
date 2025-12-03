const errorController = {}

errorController.throwError = function (req, res, next) {
  const err = new Error("Intentional server error triggered for testing")
  err.status = 500
  next(err)
}

module.exports = errorController
