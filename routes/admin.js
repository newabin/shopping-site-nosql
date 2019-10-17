const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct)

router.post('/edit-product', adminController.postEditProduct)

router.get('/edit-product/:id', adminController.getEditProduct)

router.post('/delete-product', adminController.postDeleteProduct)

router.get('/products', adminController.getAdminProducts)

module.exports = router
