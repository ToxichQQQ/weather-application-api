const {Router} = require('express')
const router = new Router()
const controller = require('../controllers/authController')
const {check} = require('express-validator')
router.post('/registration', [
    check('username', 'Name is required').notEmpty(),
    check('password', 'Password id required').notEmpty()
], controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)
router.put('/cities', controller.getAllCities)
router.put('/cities/add',controller.addNewCity)
router.put('/cities/delete',controller.deleteCity)

module.exports = router