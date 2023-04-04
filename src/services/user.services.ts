import { ObjectId } from 'mongoose'
import { IUser, Role, UserModel } from '../models/user.model'
import {
  createAuthToken,
  encryptPassword,
  matchPassword,
} from '../utils/login.util'

export class UsersService {
  async createUser(user: IUser, role: Role): Promise<boolean> {
    try {
      user.role = role
      user.password = await encryptPassword(user.password)
      const createdUser = new UserModel(user)
      await createdUser.save()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        return null
      }
      const isValid = await matchPassword(password, user ? user.password : '')
      if (isValid) return createAuthToken(user.email)
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }
  async updatePassword(
    userId: ObjectId,
    newPassword: string
  ): Promise<boolean> {
    try {
      const user = await UserModel.findById(userId)
      if (!user) return false
      user.password = await encryptPassword(newPassword)
      await UserModel.findByIdAndUpdate(user.id, user, { new: true })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  async getUser(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return null
    }
    return user
  }
}
