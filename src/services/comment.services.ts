import { ObjectId } from 'mongoose'
import { CommentsResponse } from '../dtos/responses/comment_responses'
import { CommentModel, IComment } from '../models/comment.model'

export class CommentService {
  async createComment(comment: IComment): Promise<boolean> {
    try {
      const createdComment = new CommentModel(comment)
      await createdComment.save()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  async getCommentByPostId(
    commentId: ObjectId,
    page: number,
    limit: number
  ): Promise<CommentsResponse> {
    const skip = (page - 1) * limit
    const comments = await CommentModel.find({ post: commentId })
      .populate({ path: 'createdBy', select: 'firstName lastName email' })
      .skip(skip)
      .limit(limit)
    const count = await CommentModel.countDocuments().exec()
    const response: CommentsResponse = {
      limit,
      page,
      total: count,
      results: comments,
    }
    return response
  }

  async getCommentByUserId(
    userId: ObjectId,
    page: number,
    limit: number
  ): Promise<CommentsResponse> {
    const skip = (page - 1) * limit
    const comments = await CommentModel.find({ createdBy: userId })
      .populate('post')
      .skip(skip)
      .limit(limit)
    const count = await CommentModel.countDocuments().exec()
    const response: CommentsResponse = {
      limit,
      page,
      total: count,
      results: comments,
    }
    return response
  }

  async deleteComment(comment: IComment): Promise<boolean> {
    try {
      await CommentModel.findByIdAndDelete(comment.id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async getCommentById(id: ObjectId): Promise<IComment | null> {
    const comment = await CommentModel.findById(id)
    if (!comment) {
      return comment
    }
    return comment
  }
}
