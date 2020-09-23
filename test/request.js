const app = require('../index')

const port = process.env.PORT || 8000

module.exports = app.listen(port)