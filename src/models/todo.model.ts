import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './user.model'

export interface ITodo extends Document {
  title: string
  description: string
  isCompleted: boolean
  createdBy: IUser['_id']
}

const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

TodoSchema.set('timestamps', true)

export const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema)
