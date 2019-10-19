const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

const isAuth = require('../middleware/auth')

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

// // /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

router.get('/edit-product/:id', isAuth, adminController.getEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

router.get('/products', isAuth, adminController.getAdminProducts)

module.exports = router
