const { Router } = require("express");
const appController =require('../controllers/appController');
const verifyAuth=require('../middleware/verifyAuth')
const router=Router();

//define all routes
//user-routes
router.post('/register',appController.register);
router.post('/login',appController.login);
router.post('/logout',appController.logout);
router.get('/profile',appController.profile);

/**
 * /:username/expense->POST to create expense
 * /:username/expense->GET to get all task
 * /:username/expense/delete->DELETE to delete a task
 */

//expense-routes
router.post('/expense',verifyAuth,appController.expense_post);
router.get('/expense',verifyAuth,appController.expense_get);
router.delete('/expense/:id',verifyAuth,appController.expense_delete);

module.exports =router;