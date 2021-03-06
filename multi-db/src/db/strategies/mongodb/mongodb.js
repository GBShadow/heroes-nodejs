const Mongoose = require('mongoose')
const ICrud = require('../interfaces/ICrud')
const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
}

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super()
    this._schema = schema
    this._connection = connection
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState]

    if (state === 'Conectado') return state
    if (state !== 'Conectando') return state

    await new Promise((resolve) => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]
  }

  static connect() {
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
    connection.once('open', () => console.log('Database rodando!!!'))

    return connection
  }

  create(item) {
    return this._schema.create(item)
  }

  read({ item = {}, skip = 0, limit = 10 }) {
    return this._schema.find(item).skip(skip).limit(limit)
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item })
  }

  delete(id) {
    if (id) {
      return this._schema.deleteOne({ _id: id })
    }

    return this._schema.deleteMany()
  }
}

module.exports = MongoDB
