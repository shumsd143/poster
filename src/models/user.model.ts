import mongoose, { Schema, Document } from 'mongoose'

export enum Gender {
  male = 'male',
  female = 'female',
  undisclosed = 'undisclosed',
}

export enum Role {
  admin = 'admin',
  user = 'user',
}

export interface IUser extends Document {
  email: string
  firstName: string
  lastName: string
  password: string
  gender: Gender
  role: Role
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: Object.values(Gender) },
  role: { type: String, enum: Object.values(Role) },
})

UserSchema.set('timestamps', true)

export const UserModel = mongoose.model<IUser>('User', UserSchema)
