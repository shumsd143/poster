import { NextFunction, Request, Response } from 'express'
import { UserRequest } from '../dtos/dtos/auth_user'
import { Role } from '../models/user.model'
import { UsersService } from '../services/user.services'
import { errorResponse } from '../utils/common.util'
import { getEmailFromAuthToken, verifyAuthToken } from '../utils/login.util'

const userService = new UsersService()

export async function authenticate(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = req.headers.authorization
    if (!bearerToken) {
      return res.status(401).json(errorResponse('Authorization header missing'))
    }
    const token = bearerToken.split(' ')[1]
    const isValidToken = verifyAuthToken(token)
    if (isValidToken) {
      const email = getEmailFromAuthToken(token)
      const userInfo = await userService.getUser(email)
      if (!userInfo) return res.status(401).json(errorResponse('Invalid User'))
      req.user = userInfo
      next()
    } else return res.status(401).json(errorResponse('Invalid token'))
  } catch (error) {
    return res.status(401).json(errorResponse('Something went wrong'))
  }
}
