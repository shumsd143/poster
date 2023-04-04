import { Router } from 'express'
import { TodoController } from '../controllers/todo.controllers'
import { authenticate } from '../middlewares/middleware'

const router = Router()
const todoController = new TodoController()

router.post('', authenticate, todoController.createTodo)
router.post('/createMultiple', authenticate, todoController.createMultipleTodo)
router.put('/:id', authenticate, todoController.updateTodo)
router.delete('/:id', authenticate, todoController.deleteTodo)
router.get('/', authenticate, todoController.getMyTodos)
router.get('/user/:userId', todoController.getOtherTodoByUserId)

export default router
