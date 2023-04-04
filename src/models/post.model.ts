import mongoose, { Schema, Document } from 'mongoose'
import { IComment } from './comment.model'
import { IUser } from './user.model'

export interface IPost extends Document {
  post: string
  createdBy: IUser['_id']
  comments: mongoose.Types.ObjectId[] | IComment[]
}

const PostSchema: Schema = new Schema({
  post: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
})

PostSchema.set('timestamps', true)

export const PostModel = mongoose.model<IPost>('Post', PostSchema)
