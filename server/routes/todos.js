const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// Todo CRUD routes
router.post('/', todoController.createTodo);
router.get('/user/:user_id', todoController.getUserTodos);
router.put('/:id', todoController.updateTodo);
router.patch('/:id/complete', todoController.toggleTodoComplete);
router.delete('/:id', todoController.deleteTodo);

// Todo stats
router.get('/stats/:user_id', todoController.getTodoStats);

module.exports = router;
