const User = require('../../../models/user')
const resolvers = require('./users')
const { setupDB } = require('../test-setup')

setupDB('users')

describe('getUser', () => {
  it('Should save user to database', async done => {
    const newUser = new User({email: 'steeve@gmail.com', username: 'steeveo', password: 'plop'})
    await newUser.save()
  
    const fetchedUser = await resolvers.Query.getUser({}, {id: newUser.id}, { userId: newUser.id })
  
    expect(fetchedUser.id).toBe(newUser.id)
  
    done()
  })
  it('Should throw if not authenticated', async done => {
    const newUser = new User({email: 'steeve@gmail.com', username: 'steeveo', password: 'plop'})
    await newUser.save()

    await expect(resolvers.Query.getUser({}, {id: newUser.id}, {})).rejects.toThrow(/must be authenticated/)
  
    done()
  })
  it('Should throw if not right user', async done => {
    const newUser = new User({email: 'steeve@gmail.com', username: 'steeveo', password: 'plop'})
    await newUser.save()

    await expect(resolvers.Query.getUser({}, {id: newUser.id}, { userId: '123'})).rejects.toThrow(/own datas/)
   
    done()
  })
})
