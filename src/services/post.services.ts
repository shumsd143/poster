import { ObjectId } from 'mongoose'
import { PostsResponse } from '../dtos/responses/post_responses'
import { IPost, PostModel } from '../models/post.model'

export class PostService {
  async createPost(post: IPost): Promise<boolean> {
    try {
      const createdPost = new PostModel(post)
      await createdPost.save()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async updatePost(post: IPost): Promise<boolean> {
    try {
      const updatedPost = await PostModel.findByIdAndUpdate(post.id, post)
      if (!post) return false
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async deletePost(post: IPost): Promise<boolean> {
    try {
      await PostModel.findByIdAndDelete(post.id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async getPost(id: ObjectId): Promise<IPost | null> {
    const post = await PostModel.findById(id)
    if (!post) {
      return post
    }
    return post
  }

  async getPostWithComment(id: ObjectId): Promise<IPost | null> {
    const post = await PostModel.findById(id)
    if (!post) {
      return post
    }
    return post
  }

  async getAllPost(page: number, limit: number): Promise<PostsResponse> {
    const skip = (page - 1) * limit
    const posts = await PostModel.find({}).skip(skip).limit(limit)
    const count = await PostModel.countDocuments().exec()
    const response: PostsResponse = {
      limit,
      page,
      total: count,
      results: posts,
    }
    return response
  }

  async getAllPostByUserId(
    userId: ObjectId,
    page: number,
    limit: number
  ): Promise<PostsResponse> {
    const skip = (page - 1) * limit
    const posts = await PostModel.find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
    const count = await PostModel.countDocuments().exec()
    const response: PostsResponse = {
      limit,
      page,
      total: count,
      results: posts,
    }
    return response
  }
}
