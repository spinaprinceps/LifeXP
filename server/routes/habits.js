const express = require('express');
const router = express.Router();

// Import controllers
const habitController = require('../controllers/habitController');
const habitLogController = require('../controllers/habitLogController');
const statsController = require('../controllers/statsController');

// Habit CRUD routes
router.post('/create', habitController.createHabit);
router.put('/:id', habitController.editHabit);
router.delete('/:id', habitController.deleteHabit);
router.get('/user/:user_id', habitController.getUserHabits);

// Habit completion routes
router.post('/:id/complete', habitLogController.completeHabit);
router.post('/:id/uncomplete', habitLogController.uncompleteHabit);
router.get('/logs/:user_id', habitLogController.getHabitLogs);

// Stats routes
router.get('/stats/:user_id', statsController.getUserStats);
router.get('/monthly-stats/:user_id/:year/:month', statsController.getMonthlyStats);

module.exports = router;
