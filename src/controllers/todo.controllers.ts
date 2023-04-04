import { Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import { UserRequest } from '../dtos/dtos/auth_user'
import {
  createTodoReqKeys,
  CreateTodoRequest,
} from '../dtos/requests/create_todo_request'
import {
  updateTodoReqKeys,
  UpdateTodoRequest,
} from '../dtos/requests/update_todo_request'
import { ITodo } from '../models/todo.model'
import { TodoService } from '../services/todo.services'
import {
  createdResponse,
  errorResponse,
  isEmptyFields,
} from '../utils/common.util'
import { DEFAULT_PAGE_LIMIT } from '../utils/constant.utils'

const todoService = new TodoService()

export class TodoController {
  async createTodo(req: UserRequest, res: Response) {
    const todo_request = req.body as CreateTodoRequest
    if (isEmptyFields(todo_request, createTodoReqKeys)) {
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    }
    const todo = todo_request as ITodo
    todo.isCompleted = false
    todo.createdBy = req?.user?._id
    const is_created = await todoService.createTodo(todo)
    if (is_created) {
      return res.status(201).json(createdResponse('Todo created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async createMultipleTodo(req: UserRequest, res: Response) {
    const todos_request = req.body as CreateTodoRequest[]
    const todos = [] as ITodo[]
    let error = false
    todos_request.forEach((todo_request) => {
      if (isEmptyFields(todo_request, createTodoReqKeys)) {
        error = true
      } else {
        const todo = todo_request as ITodo
        todo.isCompleted = false
        todo.createdBy = req?.user?._id
        todos.push(todo)
      }
    })
    if (error)
      return res
        .status(400)
        .json(errorResponse('One or more than one fields are empty.'))
    const is_created = await todoService.createMultipleTodo(todos)
    if (is_created) {
      return res.status(201).json(createdResponse('Todo created successfully.'))
    }
    return res.status(500).json(errorResponse('Something went wrong.'))
  }

  async getMyTodos(req: UserRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const response = await todoService.getAllTodoByUserId(
        req?.user?.id,
        page,
        limit
      )
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async getOtherTodoByUserId(req: Request, res: Response) {
    try {
      const userId = req.params['userId'] as unknown as ObjectId
      const page = parseInt(req.query['page'] as string) || 1
      const limit = parseInt(req.query['limit'] as string) || DEFAULT_PAGE_LIMIT
      const response = await todoService.getAllTodoByUserId(userId, page, limit)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }

  async updateTodo(req: UserRequest, res: Response) {
    try {
      const todoId = req.params['id'] as unknown as ObjectId
      const todo = await todoService.getTodo(todoId)
      if (!todo)
        return res.status(400).json(errorResponse('Incorrect todo id.'))
      if (todo.createdBy != req?.user?.id)
        return res.status(400).json(errorResponse('Incorrect access.'))
      const todo_request = req.body as UpdateTodoRequest
      if (isEmptyFields(todo_request, updateTodoReqKeys)) {
        return res
          .status(400)
          .json(errorResponse('One or more than one fields are empty.'))
      }
      todo.title = todo_request.title
      todo.description = todo_request.description
      todo.isCompleted = todo_request.isCompleted
      await todoService.updateTodo(todo)
      return res.status(200).json(createdResponse('Todo updated successfully.'))
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }
  async deleteTodo(req: UserRequest, res: Response) {
    try {
      const todoId = req.params['id'] as unknown as ObjectId
      const todo = await todoService.getTodo(todoId)
      if (!todo)
        return res.status(400).json(errorResponse('Incorrect todo id.'))
      if (todo.createdBy != req?.user?.id)
        return res.status(400).json(errorResponse('Incorrect access.'))
      await todoService.deleteTodo(todo)
      res.status(200).json(createdResponse('Deleted successfully.'))
    } catch (error) {
      return res.status(500).json(errorResponse('Something went wrong.'))
    }
  }
}
