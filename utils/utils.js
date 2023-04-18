// IMPORT PACKAGES
const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;

// IMPORT VARIABLES
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('./constants');

// ERRORS HANDLER
module.exports.errorsHandler = (err, res) => {
  if (err instanceof ValidationError) {
    const errorMessage = Object.values(err.errors).map((error) => error.message).join(' ');
    return res.status(BAD_REQUEST_ERROR_CODE).send({
      message: `Переданы некорректные данные. ${errorMessage}`,
    });
  }
  if (err instanceof DocumentNotFoundError) {
    return res.status(NOT_FOUND_ERROR_CODE).send({
      message: 'В базе данных не найден документ с таким ID',
    });
  }
  if (err instanceof CastError) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({
      message: `Передан некорректный ID: ${err.value}`,
    });
  }
  return res.status(DEFAULT_ERROR_CODE).send({
    message: `Произошла неизвестная ошибка ${err.name}: ${err.message}`,
  });
};
