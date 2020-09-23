// import { HttpError, NotFoundError } from "../error"
const colors = require('colors')
const { NextFunction, Request, Response } = require('express');

function notFound(req, res, next) {
  res.status(404)

  res.send({
    status: 404,
    success: false,
    message: 'Resource not found'
  })
}

function validationError(err, req, res, next) {
  const status = err.status
  let message = err.message

  if (!message) message = 'Validation Error'

  if (!status || status !== 422) {
    return next(err)
  } else {
    res.status(status)
    res.send({ status, message, success: false })
  }
}

function unauthorizedError(err, req, res, next) {
  const status = err.status
  let message = err.message

  if (!message) message = 'Unauthorized'

  if (!status || status !== 401) {
    return next(err)
  } else {
    res.status(status)
    res.send({ status, message, success: false })
  }
}

function forbiddenError(err, req, res, next) {
  const status = err.status
  let message = err.message

  if (!message) message = 'Forbidden'

  if (!status || status !== 403) {
    return next(err)
  } else {
    res.status(status)
    res.send({ status, message, success: false })
  }
}

function serverError(err, req, res, next) {
  console.log(`
  ${colors.blue('✖️  ✖️  ✖️  Something went wrong:  ✖️  ✖️  ✖️')}
  ${colors.bgBlue(err.stack)}
  ${colors.blue('✖️  ✖️  ✖️')}
  `)

  res.status(500)
  res.send('Internal server error')
}

module.exports = {
  notFound,
  serverError,
  forbiddenError,
  validationError,
  unauthorizedError
}
