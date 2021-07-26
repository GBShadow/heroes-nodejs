const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Mongodb())
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

describe('Mongodb strategy', function () {
  this.beforeAll(async () => {
    await context.connect()
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
      name: MOCK_HERO_REGISTER.name,
    })

    assert.deepStrictEqual({ name, power }, MOCK_HERO_REGISTER)
  })

  // it('Update hero', async function () {
  //   const [result] = await context.read({ name: MOCK_HERO_UPDATE.name })
  //   const [resultUpdated] = await context.update(result.id, MOCK_HERO_UPDATED)

  //   const [itemUpdated] = await context.read({ id: result.id })
  //   delete itemUpdated.id

  //   assert.deepStrictEqual(resultUpdated, 1)
  //   assert.deepStrictEqual(itemUpdated, MOCK_HERO_UPDATED)
  // })

  // it('Delete hero by id', async function () {
  //   const [item] = await context.read({ name: MOCK_HERO_REGISTER.name })
  //   const result = await context.delete(item.id)

  //   assert.deepStrictEqual(result, 1)
  // })
})
