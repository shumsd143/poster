import { Router } from 'express'
import { CommentController } from '../controllers/comment.controllers'
import { authenticate } from '../middlewares/middleware'

const router = Router()
const commentController = new CommentController()

router.post('/:postId', authenticate, commentController.createComment)
router.get('/:postId', authenticate, commentController.getCommentByPostId)
router.get('', authenticate, commentController.getCommentByUserId)
router.delete('/:commentId', authenticate, commentController.deleteComment)

export default router
