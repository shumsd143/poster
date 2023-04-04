import { Response } from 'express'
import { ObjectId } from 'mongoose'
import { UserRequest } from '../dtos/dtos/auth_user'
import {
  createCommentReqKeys,
  CreateCommentRequest,
} from '../dtos/requests/create_comment_request'
import { IComment } from '../models/comment.model'
import { CommentService } from '../services/comment.services'
import { PostService } from '../services/post.services'
import {
  createdResponse,
  errorResponse,
  isEmptyFields,
} from '../utils/common.util'
import { DEFAULT_PAGE_LIMIT } from '../utils/constant.utils'

const commentService = new CommentService()
const postService = new PostService()

export class CommentController {
  async createComment(req: UserRequest, res: Response) {
    const postId = req.params['postId'] as unknown as ObjectId
    const comment_request = req.body as CreateCommentRequest
    if (isEmptyFields(comment_request, createCommentReqKeys)) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const post = await postService.getPost(postId)
    if (!post) res.status(500).json(errorResponse('Incorrect post id.'))
    const comment = comment_request as IComment
    comment.createdBy = req?.user?._id
    comment.post = post?.id
    const is_created = await commentService.createComment(comment)
    if (is_created) {
      return res
        .status(201)
        .json(createdResponse('Comment created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async getCommentByPostId(req: UserRequest, res: Response) {
    try {
      const postId = req.params['postId'] as unknown as ObjectId
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const post = await postService.getPost(postId)
      if (!post) res.status(500).json(errorResponse('Incorrect post id.'))
      const response = await commentService.getCommentByPostId(
        postId,
        page,
        limit
      )
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async getCommentByUserId(req: UserRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const response = await commentService.getCommentByUserId(
        req?.user?._id,
        page,
        limit
      )
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async deleteComment(req: UserRequest, res: Response) {
    try {
      const commentId = req.params['commentId'] as unknown as ObjectId
      const comment = await commentService.getCommentById(commentId)
      if (!comment)
        return res.status(400).json(errorResponse('Incorrect comment id.'))
      if (comment.createdBy != req?.user?.id)
        return res.status(400).json(errorResponse('Incorrect access.'))
      await commentService.deleteComment(comment)
      res.status(200).json(createdResponse('Deleted successfully.'))
    } catch (error) {
      console.log(error)
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }
}
