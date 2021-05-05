const router = require('express').Router();

const { Router } = require('express');
// const { clientlist } = require('../controllers/Controller');
const Controller = require('../controllers/Controller');

router.get('/', Controller.home);
// SIGN up
router.get('/signup',Controller.signup);
router.post('/signup/adduser',Controller.adduser);

// Log in 
router.get('/login',Controller.login);
router.post('/login/in', Controller.loginuser);

// account page
router.get('/account_details', Controller.account_details);
router.get('/account_details/trans_hisrtory', Controller.trans_history);

//add money
router.get('/add',Controller.add);
router.post('/add_money',Controller.add_money);

//subtract money
router.get('/sub',Controller.sub);
router.post('/sub_money',Controller.sub_money);

//transfer
router.get('/transfer',Controller.transfer);
router.post('/transfer_money',Controller.transfer_money);   

//managers
router.get('/login_manager',Controller.login_manager);
router.post('/login/manager_in', Controller.loginManager);
router.get('/manager_details', Controller.manager_details);

router.get('/manager_see_users', Controller.manager_see_users);
router.get('/manager_see_transactions', Controller.manager_see_transactions);

// loans
router.get('/loans', Controller.loans);
router.post('/apply_loan', Controller.apply_loan);

// loan_details
router.get('/loan_details', Controller.loan_details);
router.get('/loan_accept/:loan_id', Controller.loan_accept);
router.get('/loan_reject/:loan_id', Controller.loan_reject);
module.exports = router;

