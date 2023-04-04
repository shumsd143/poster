import { Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import { UserRequest } from '../dtos/dtos/auth_user'
import {
  createPostReqKeys,
  CreatePostRequest,
} from '../dtos/requests/create_post_request'
import { IPost } from '../models/post.model'
import { CommentService } from '../services/comment.services'
import { PostService } from '../services/post.services'
import {
  createdResponse,
  errorResponse,
  isEmptyFields,
} from '../utils/common.util'
import { DEFAULT_PAGE_LIMIT } from '../utils/constant.utils'

const postService = new PostService()
const commentService = new CommentService()

export class PostController {
  async createPost(req: UserRequest, res: Response) {
    const post_request = req.body as CreatePostRequest
    if (isEmptyFields(post_request, createPostReqKeys)) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const post = post_request as IPost
    post.createdBy = req?.user?._id
    const is_created = await postService.createPost(post)
    if (is_created) {
      return res.status(201).json(createdResponse('Post created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async getMyPost(req: UserRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const response = await postService.getAllPostByUserId(
        req?.user?.id,
        page,
        limit
      )
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async updatePost(req: UserRequest, res: Response) {
    try {
      const postId = req.query['id'] as unknown as ObjectId
      const post = await postService.getPost(postId)
      if (!post)
        return res.status(400).json(errorResponse('Incorrect post id.'))
      if (post.createdBy != req?.user?.id)
        return res.status(400).json(errorResponse('Incorrect access.'))
      const post_request = req.body as CreatePostRequest
      if (isEmptyFields(post_request, createPostReqKeys)) {
        return res
          .status(400)
          .json(errorResponse('One or more than one fields are empty.'))
      }
      post.post = post_request.post
      await postService.updatePost(post)
      return res.status(200).json(createdResponse('Post updated successfully.'))
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async deletePost(req: UserRequest, res: Response) {
    try {
      const postId = req.params['id'] as unknown as ObjectId
      const post = await postService.getPost(postId)
      if (!post)
        return res.status(400).json(errorResponse('Incorrect post id.'))
      if (post.createdBy != req?.user?.id)
        return res.status(400).json(errorResponse('Incorrect access.'))
      await postService.deletePost(post)
      res.status(200).json(createdResponse('Deleted successfully.'))
    } catch (error) {
      console.log(error)
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async getAllPost(req: UserRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const response = await postService.getAllPost(page, limit)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const postId = req.params['id'] as unknown as ObjectId
      const post = await postService.getPostWithComment(postId)
      if (!post)
        return res.status(400).json(errorResponse('Incorrect post id.'))
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const commentResponse = await commentService.getCommentByPostId(
        post?.id,
        page,
        limit
      )
      return res.status(200).json(commentResponse)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }
}
