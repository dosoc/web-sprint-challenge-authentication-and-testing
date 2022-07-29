const User = require('../api/users/users-model')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
  expect(2).toEqual(2)
  expect(4).not.toEqual(5)
})


test('is NODE_ENV set correctly?', ()=> {
  expect(process.env.NODE_ENV).toBe('testing')
})

beforeAll(async ()=> {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy();
})

beforeEach(async () => {
  await db('users').truncate()
})

describe('test user model', () => {
  test('adds correct user', async () => {
    const result = await User.add({ username: 'aaron', password: '1234' })
    expect(result).toMatchObject({username: 'aaron'})
  })
  test('finds user by username', async () => {
    await User.add({ username: 'aaron', password: '1234' })
    const result = await User.findBy({username: 'aaron'})
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({username: 'aaron'})
  })
  test('finds user by Id', async ()=> {
    await User.add({ username: 'aaron', password: '1234' })
    const result = await User.findById(1)
    expect(result).toMatchObject({username: 'aaron'})
  })
})

const request = require('supertest');
const server = require('./server')

describe('test HTTP endpoints', () => {
  test('POST /auth/register without username and password', async () => {
    let result = await request(server).post('/api/auth/register');
    expect(result.body).toMatchObject({ message: 'username and password required'})
    expect(result.status).toBe(400)
  })

  test(' POST/auth/register with username and password', async () => {
    let result = await request(server).post('/api/auth/register').send({username: 'aaron', password: '1234'});
    expect(result.status).toBe(201)
    result = await User.findById(1)
    expect(result).toMatchObject({username: 'aaron'})
  })
  
  test(' POST /auth/login without valid creditials', async () => {
    let result = await request(server).post('/api/auth/login').send({username: 'aaron', password: 'blahblah'});
    expect(result.body).toMatchObject({ message: 'invalid credentials'});
    expect(result.status).toBe(400);
  })

  test(' POST /auth/login with valid creditials', async () => {
    await request(server).post('/api/auth/register').send({username: 'aaron', password: '1234'});
    let result = await request(server).post('/api/auth/login').send({username: 'aaron', password: '1234'});
    expect(result.body).toMatchObject({message: 'welcome, aaron'})
    expect(result.status).toBe(200);
  })

  test(' GET /jokes without jwt', async () => {
    let result = await request(server).get('/api/jokes')
    expect(result.status).toBe(401)
  })
})