const express = require('express');
const errorHandler = require('./middleware/errorhandler');
const { router } = require('./routers/routes');

const app = express();

app.use(express.json());

app.use(router);

/*
 * Inserção de middlewares para tratamento de erros
 */

app.use(errorHandler.notFound);
app.use(errorHandler.validationError);
app.use(errorHandler.unauthorizedError);
app.use(errorHandler.forbiddenError);
app.use(errorHandler.serverError);

module.exports = app;
