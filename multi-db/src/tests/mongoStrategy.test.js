const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb/mongodb')
const Context = require('../db/strategies/base/contextStrategy')
const HeroesSchema = require('../db/strategies/mongodb/schemas/heroesShema')

const MOCK_HERO_REGISTER = {
  name: 'Gavião Negro',
  power: 'Flechas',
}

const MOCK_HERO_DEFAULT = {
  name: `Spiderman-${Date.now()}`,
  power: 'Super teias',
}

const MOCK_HERO_UPDATE = {
  name: 'Aquaman',
  power: 'Respirar em baixo da água',
}

const MOCK_HERO_UPDATED = {
  name: 'Mulher Maravilha',
  power: 'Super força',
}

let context = {}

describe('Mongodb strategy', function () {
  this.beforeAll(async () => {
    const connection = Mongodb.connect()
    context = new Context(new Mongodb(connection, HeroesSchema))
    await context.create(MOCK_HERO_DEFAULT)
    await context.create(MOCK_HERO_UPDATE)
  })
  this.afterAll(async () => {
    await context.delete()
  })

  it('Mongodb Connection', async function () {
    const result = await context.isConnected()
    assert.deepStrictEqual(result, 'Conectado')
  })

  it('Register hero', async function () {
    const { name, power } = await context.create(MOCK_HERO_REGISTER)

    assert.deepStrictEqual({ name, power }, MOCK_HERO_REGISTER)
  })

  it('List hero', async function () {
    const [{ name, power }] = await context.read({
      item: { name: MOCK_HERO_DEFAULT.name },
    })

    assert.deepStrictEqual({ name, power }, MOCK_HERO_DEFAULT)
  })

  it('Update hero', async function () {
    const [result] = await context.read({
      item: { name: MOCK_HERO_UPDATE.name },
    })
    const resultUpdated = await context.update(result._id, MOCK_HERO_UPDATED)

    assert.deepStrictEqual(resultUpdated.nModified, 1)
  })

  it('Delete hero by id', async function () {
    const [item] = await context.read({
      item: { name: MOCK_HERO_DEFAULT.name },
    })
    const result = await context.delete(item._id)

    assert.deepStrictEqual(result.n, 1)
  })
})
