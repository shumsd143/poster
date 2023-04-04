import { IComment } from '../../models/comment.model'
import { PaginationResponse } from './pagination_responses'

export interface CommentsResponse extends PaginationResponse {
  results: IComment[]
}
