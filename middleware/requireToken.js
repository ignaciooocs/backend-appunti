const jwt = require('jsonwebtoken')

const requireToken = (req, res, next) => {
  try {
    const authorization = req.get('authorization')
    let token = null

    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1]
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId } = decodedToken

    req.userId = userId

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
  }
}
module.exports = requireToken
