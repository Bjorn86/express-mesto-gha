// STATUS CODES
const NOT_FOUND_ERROR_CODE = 404;

// NOT FOUNDED ROUTE
module.exports.notFound = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Указан некорректный путь',
  });
};
