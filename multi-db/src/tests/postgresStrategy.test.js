const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const Context = require('../db/strategies/base/contextStrategy')
const HeroesSchema = require('../db/strategies/postgres/schemas/heroesSchema')

const MOCK_HERO_REGISTER = {
  name: 'Gavião Negro',
  power: 'Flechas',
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

describe('Postgres strategy', function () {
  this.timeout(Infinity)
  this.beforeAll(async function () {
    const connection = await Postgres.connect()
    const model = await Postgres.defineModel(connection, HeroesSchema)
    context = new Context(new Postgres(connection, model))
    await context.create(MOCK_HERO_UPDATE)
  })
  this.afterAll(async function () {
    await context.delete()
  })

  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected()
    assert.strictEqual(result, true)
  })

  it('Register hero', async function () {
    const result = await context.create(MOCK_HERO_REGISTER)
    delete result.id

    assert.deepStrictEqual(result, MOCK_HERO_REGISTER)
  })

  it('List hero', async function () {
    const [result] = await context.read({ name: MOCK_HERO_REGISTER.name })
    delete result.id

    assert.deepStrictEqual(result, MOCK_HERO_REGISTER)
  })

  it('Update hero', async function () {
    const [result] = await context.read({ name: MOCK_HERO_UPDATE.name })
    const [resultUpdated] = await context.update(result.id, MOCK_HERO_UPDATED)

    const [itemUpdated] = await context.read({ id: result.id })
    delete itemUpdated.id

    assert.deepStrictEqual(resultUpdated, 1)
    assert.deepStrictEqual(itemUpdated, MOCK_HERO_UPDATED)
  })

  it('Delete hero by id', async function () {
    const [item] = await context.read({ name: MOCK_HERO_REGISTER.name })
    const result = await context.delete(item.id)

    assert.deepStrictEqual(result, 1)
  })
})
