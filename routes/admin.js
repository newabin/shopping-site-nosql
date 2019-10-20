const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/auth')

const { check, body } = require('express-validator/check')

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

// // /admin/add-product => POST
router.post('/add-product',
    check('title').isString().isLength({ min:3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min:5, max:400 }).trim()
    ,isAuth, adminController.postAddProduct)

router.post('/edit-product',
    check('title').isString().isLength({ min:3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min:5, max:400 }).trim()
    ,isAuth, adminController.postEditProduct)

router.get('/edit-product/:id', isAuth, adminController.getEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

router.get('/products', isAuth, adminController.getAdminProducts)

module.exports = router
