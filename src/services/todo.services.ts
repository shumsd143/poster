import { ObjectId } from 'mongoose'
import { TodoResponse } from '../dtos/responses/todos_response'
import { ITodo, TodoModel } from '../models/todo.model'

export class TodoService {
  async createTodo(todo: ITodo): Promise<boolean> {
    try {
      const createdTodo = new TodoModel(todo)
      await createdTodo.save()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async createMultipleTodo(todos: ITodo[]): Promise<boolean> {
    try {
      const createdTodo = await TodoModel.insertMany(todos)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async updateTodo(todo: ITodo): Promise<boolean> {
    try {
      const updatedTodo = await TodoModel.findByIdAndUpdate(todo.id, todo)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async deleteTodo(todo: ITodo): Promise<boolean> {
    try {
      await TodoModel.findByIdAndDelete(todo.id)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async getTodo(id: ObjectId): Promise<ITodo | null> {
    const todo = await TodoModel.findById(id)
    if (!todo) {
      return todo
    }
    return todo
  }
  async getAllTodoByUserId(
    userId: ObjectId,
    page: number,
    limit: number
  ): Promise<TodoResponse> {
    const skip = (page - 1) * limit
    const todos = await TodoModel.find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
    const count = await TodoModel.countDocuments().exec()
    const response: TodoResponse = {
      limit,
      page,
      total: count,
      results: todos,
    }
    return response
  }
}
