import { Gender } from '../../models/user.model'

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  gender: Gender
}

export const createUserReqKeys = [
  'email',
  'firstName',
  'lastName',
  'password',
  'gender',
]
