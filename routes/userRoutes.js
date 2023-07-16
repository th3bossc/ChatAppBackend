const router = require('express').Router();
const { registerHandler, loginHandler, currentHandler, onlineHandler } = require('../controllers/userController');
const validateToken = require('../middlewares/validateTokenHandler');

router.route('/register').post(registerHandler);
router.route('/login').post(loginHandler);
router.route('/current').get(validateToken, currentHandler);
router.route('/online').get(onlineHandler);
module.exports = router;