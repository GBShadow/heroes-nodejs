const Mongoose = require('mongoose')
const ICrud = require('./interfaces/ICrud')
const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
}

class MongoDB extends ICrud {
  constructor() {
    super()
    this._heroes = null
    this._driver = null
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState]

    if (state === 'Conectado') return state
    if (state !== 'Conectando') return state

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return STATUS[this._driver.readyState]
  }

  defineModule() {
    const heroesSchema = Mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      power: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
    })

    this._heroes = Mongoose.model('heroes', heroesSchema)
  }

  connect() {
    Mongoose.connect(
      'mongodb://gbshadow:mongo@localhost:27017/heroes',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err) {
        if (!err) return
        console.log('Falha na conexão', err)
      }
    )

    const connection = Mongoose.connection
    this._driver = connection
    connection.once('open', () => console.log('Database rodando!!!'))
    this.defineModule()
  }

  create(item) {
    return this._heroes.create(item)
  }

  read(item = {}) {
    return this._heroes.find(item)
  }
}

module.exports = MongoDB
