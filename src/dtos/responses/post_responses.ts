import { IPost } from '../../models/post.model'
import { PaginationResponse } from './pagination_responses'

export interface PostsResponse extends PaginationResponse {
  results: IPost[]
}
