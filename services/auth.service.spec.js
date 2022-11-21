const service = require('./auth.service')

describe('JWT', () => {
  // token payload is: { username: 'steeveo', email: 'steeve@gmail.com', userId: '15' }
  const genericToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxNSIsImVtYWlsIjoic3RlZXZlQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic3RlZXZlbyIsImlhdCI6MTYyMTk1NDYzMCwiZXhwIjoxNjI0NTQ2NjMwfQ.7f1hGMmO_Dz-mo6-KPYvPWOCM1tWOsruUscdfAuK-W8'

  it('Should generate a jwt', done => {
    const token = service.generateJwt({
      username: 'steeveo',
      email: 'steeve@gmail.com',
      userId: '15'
    })
  
    const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    expect(token.match(jwtRegex)).toBeTruthy()
  
    done()
  })

  it('Should retrieve jwt payload', done => {
    const tokenPayload = service.getJwtPayload(genericToken)

    expect(tokenPayload).toHaveProperty('username', 'steeveo')
    expect(tokenPayload).toHaveProperty('email', 'steeve@gmail.com')
    expect(tokenPayload).toHaveProperty('userId', '15')

    done()
  })

  it('Should retrieve userId from authorization header', done => {
    const req = {
      request: {
        headers: {
          authorization: `Bearer ${genericToken}`
        }
      }
    }

    const userId = service.getUserId({ req })

    expect(userId).toBe('15')

    done()
  })

  it('Should retrieve userId from token', done => {
    const userId = service.getUserId({ authToken: genericToken })

    expect(userId).toBe('15')

    done()
  })

  it('Should return null on empty header', async done => {
    const req = {
      request : {
        headers: {
          authorization: ''
        }
      }
    }

    const userId = service.getUserId({ req })
    
    expect(userId).toBeNull()

    done()
  })
})

describe('PWD', () => {
  it('Should match passwords', async done => {
    const hashedPwd = await service.hashPassword('plop')
    const matching = await service.matchPasswords('plop', hashedPwd)
  
    expect(matching).toBe(true)
  
    done()
  })
  
  it('Should not match passwords', async done => {
    const hashedPwd = await service.hashPassword('plop')
    const matching = await service.matchPasswords('nope', hashedPwd)
  
    expect(matching).toBe(false)
  
    done()
  })
})
