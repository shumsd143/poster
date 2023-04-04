import { Request, Response } from 'express'
import {
  createUserReqKeys,
  CreateUserRequest,
} from '../dtos/requests/create_user_request'
import { LoginRequest } from '../dtos/requests/login_requests'
import { LoginResponse } from '../dtos/responses/login_response'
import { IUser, Role } from '../models/user.model'
import { UsersService } from '../services/user.services'
import {
  createdResponse,
  errorResponse,
  isEmptyFields,
} from '../utils/common.util'

const userService = new UsersService()

export class UsersController {
  async createUser(req: Request, res: Response) {
    const user_request = req.body as CreateUserRequest
    if (
      !user_request.email ||
      !user_request.firstName ||
      !user_request.lastName ||
      !user_request.password ||
      !user_request.gender
    ) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const user = user_request as IUser
    const is_created = await userService.createUser(user, Role.user)
    if (is_created) {
      return res.status(201).json(createdResponse('User created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async createAdmin(req: Request, res: Response) {
    const user_request = req.body as CreateUserRequest
    if (isEmptyFields(user_request, createUserReqKeys)) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const user = user_request as IUser
    const is_created = await userService.createUser(user, Role.admin)
    if (is_created) {
      return res
        .status(201)
        .json(createdResponse('Admin created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async loginUser(req: Request, res: Response) {
    const login_request = req.body as LoginRequest
    if (!login_request.email || !login_request.password) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const token = await userService.loginUser(
      login_request.email,
      login_request.password
    )
    if (token) {
      const loginResponse: LoginResponse = {
        success: true,
        authToken: token,
      }
      return res.status(200).json(loginResponse)
    }
    return res.status(400).json(errorResponse('Invalid Request.'))
  }
}
