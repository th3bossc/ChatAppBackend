const router = require('express').Router();
const validateToken = require('../middlewares/validateTokenHandler');
const { newRoomHandler, joinRoomHandler, getUsersHandler, getRoomsHandler, deleteRoomHandler, getMessagesHandler } = require('../controllers/roomController');

router.use(validateToken);
router.route('/new').post(newRoomHandler);
router.route('/users/:room').get(getUsersHandler);
router.route('/rooms/:username').get(getRoomsHandler);
router.route('/messages/:room').get(getMessagesHandler);
router.route('/:room').get(joinRoomHandler).delete(deleteRoomHandler);
module.exports = router;