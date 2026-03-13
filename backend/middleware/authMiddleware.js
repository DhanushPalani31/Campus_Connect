import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
  try {
    // Read token from cookie OR Authorization header
    let token = req.cookies?.token

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, please login' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, please login' })
  }
}