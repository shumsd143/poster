import { createTodoReqKeys, CreateTodoRequest } from './create_todo_request'

export interface UpdateTodoRequest extends CreateTodoRequest {
  isCompleted: false
}

export const updateTodoReqKeys = createTodoReqKeys.concat(['isCompleted'])
