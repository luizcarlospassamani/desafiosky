const express = require('express')

//const bodyParser = require('body-parser')
//app.use(bodyParser.json({limit: '5mb'}))

const errorHandler = require('./middleware/errorhandler')
const { router } = require('./routers/routes')

const app = express()
//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'views'))
//app.set('view engine', 'ejs')
app.use(express.json())

app.use(router)

app.use(errorHandler.notFound)
app.use(errorHandler.validationError)
app.use(errorHandler.unauthorizedError)
app.use(errorHandler.forbiddenError)
app.use(errorHandler.serverError)

module.exports = app

/**
 * 200 Sucesso
 * 300 Redirecionamento
 * 400 Erro de requisição
 * 500 Erro no servidor
 */
