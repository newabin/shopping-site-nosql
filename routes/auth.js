const express = require('express')
const authController = require('../controllers/auth')
const { check, body } = require('express-validator/check')
const User = require('../models/user')

const router = express.Router()

router.get('/login', authController.getLogin)

router.post('/login', 
    check('email').isEmail().withMessage('Please enter valid Email').custom((value, { req })=>{
        return User.findOne({ email : value }).then((userDoc)=>{
            if(!userDoc){
                return Promise.reject('Invalid Email Id')
            }
        })
    }).normalizeEmail(),
    body('password', 'Please enter valid password with only number and text and at least 5 character').isLength({ min:5 }).isAlphanumeric().trim()

    ,authController.postLogin)

router.post('/logout', authController.postLogout)

router.get('/signup', authController.getSignup)

router.post('/signup', 
    check('email').isEmail().withMessage('Please enter valid Email').custom((value, { req })=>{
        return User.findOne({ email : value }).then((userDoc)=>{
            if(userDoc){
                return Promise.reject('Email Id already Exist')
            }
        })
    }).normalizeEmail(),
    body('password', 'Please enter valid password with only number and text and at least 5 character').isLength({ min:5 }).isAlphanumeric().trim(),
    body('cpassword').trim().custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Password have to match')
        }
        return true
    })
    ,authController.postSignup)

router.get('/reset-password', authController.getResetPassword)

router.post('/reset-password', authController.postResetPassword)

router.get('/reset-password/:token', authController.getPasswordForm)

router.post('/password-reseted', authController.postPasswordForm)


module.exports = router