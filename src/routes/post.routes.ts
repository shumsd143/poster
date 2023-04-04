import { Router } from 'express'
import { PostController } from '../controllers/post.controllers'
import { authenticate } from '../middlewares/middleware'

const router = Router()
const postController = new PostController()

router.get('', postController.getAllPost)
router.post('', authenticate, postController.createPost)
router.put('/:id', authenticate, postController.updatePost)
router.delete('/:id', authenticate, postController.deletePost)
router.get('/getMyPost', authenticate, postController.getMyPost)
router.get('/:id/comments', postController.getComments)

export default router
