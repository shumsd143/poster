import { ITodo } from '../../models/todo.model'
import { PaginationResponse } from './pagination_responses'

export interface TodoResponse extends PaginationResponse {
  results: ITodo[]
}
