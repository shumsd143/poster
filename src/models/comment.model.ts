import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './user.model'
import { IPost } from './post.model'

export interface IComment extends Document {
  comment: string
  createdBy: IUser['_id']
  post: IPost['_id']
}

const CommentSchema: Schema = new Schema({
  comment: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
})

CommentSchema.set('timestamps', true)

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema)
