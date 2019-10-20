const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

const transpoter = nodemailer.createTransport(sendGridTransport({
  auth : {
    api_key : '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'
  }
}))

exports.getLogin = (req,res,next)=>{
//    const isLoggedIn =  req.get('Cookie').trim().split('=')[1] === 'true'
    let msg = req.flash('error')
    if(msg.length >0){
      msg = msg[0]
    }else{
      msg = null
    }
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/auth/login',
      isAuthenticated : req.session.isLoggedIn,
      errorMsg : msg,
      oldInput : { email : '', password : '' },
      validationError : []
    })  
}

exports.postLogin = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)
  if(!errors.isEmpty()){
//    console.log(errors.array())
    return res.status(422).render('auth/login',{
      pageTitle: 'Login',
      path: '/auth/login',
      isAuthenticated : req.session.isLoggedIn,
      errorMsg : errors.array()[0].msg,
      oldInput : { email : email, password : password },
      validationError : errors.array()
    })
  }

  User.findOne({ email : email }).then((user)=>{
    if(!user){
      return res.status(422).render('auth/login',{
        pageTitle: 'Login',
        path: '/auth/login',
        isAuthenticated : req.session.isLoggedIn,
        errorMsg : 'Invalid Email Id',
        oldInput : { email : email, password : password },
        validationError : [{ param : 'email' }]
      })
    }
    bcrypt.compare(password, user.password).then((match)=>{
      if(match){
          req.session.isLoggedIn = true
          req.session.user = user
          return req.session.save(()=>{
              res.redirect('/')
            })
        }
        return res.status(422).render('auth/login',{
          pageTitle: 'Login',
          path: '/auth/login',
          isAuthenticated : req.session.isLoggedIn,
          errorMsg : 'Invalid Password',
          oldInput : { email : email, password : password },
          validationError : [{ param : 'password' }]
        })
    }).catch((err)=>{
      res.redirect('/login')
    })
  })
}

exports.postLogout = (req,res,next)=>{
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })
}

exports.getSignup = (req,res,next)=>{
    let msg = req.flash('error')
    if(msg.length >0){
      msg = msg[0]
    }else{
      msg = null
    }

    res.render('auth/signup', {
      pageTitle: 'SignUp',
      path: '/auth/signup',
      isAuthenticated : req.session.isLoggedIn,
      errorMsg : msg,
      oldInput : { email : "", password : "", cpassword : "" },
      validationError : []
    })  
}

exports.postSignup = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  const cpassword = req.body.cpassword
  const errors = validationResult(req)
  if(!errors.isEmpty()){
//    console.log(errors.array())
    return res.status(422).render('auth/signup',{
      pageTitle: 'SignUp',
      path: '/auth/signup',
      isAuthenticated : req.session.isLoggedIn,
      errorMsg : errors.array()[0].msg,
      oldInput : { email : email, password : password, cpassword : cpassword },
      validationError : errors.array()
    })
  }

    bcrypt.hash(password, 8).then((hashPassword)=>{
        const user = new User({
          email : email,
          password : hashPassword,
          cart : { items: [] }
        })
        user.save().then(()=>{
        console.log('User Created')
        res.redirect('/login')
        return transpoter.sendMail({
          to : email,
          from : 'no-reply@newa-shop.com',
          subject : 'Sign Up Succeeded!',
          html : '<h1>You succesfully signed up!</h1>'
        })
        
      }).catch((err)=>{
        console.log(err)
      })
    }).catch()
}

exports.getResetPassword = (req,res,next)=>{
    let msg = req.flash('error')
    if(msg.length >0){
      msg = msg[0]
    }else{
      msg = null
    }
    res.render('auth/reset', {
      pageTitle: 'Reset Password',
      path: '/auth/login',
      isAuthenticated : req.session.isLoggedIn,
      errorMsg : msg
    })  
}

exports.postResetPassword = (req,res,next)=>{
  const email = req.body.email
    crypto.randomBytes(32, (err, buffer)=>{
      if(err){
        console.log(err)
        return res.redirect('/reset-password')
      }
      const token = buffer.toString('hex')  
      User.findOne({ email : email }).then((user)=>{
        if(!user){
          req.flash('error','Invalid Email Id')
          return res.redirect('/reset-password')
          }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save() 
        }).then((result)=>{
          res.redirect('/')
          transpoter.sendMail({
          to : email,
          from : 'no-reply@newa-shop.com',
          subject : 'Password Reset',
          html : `
            <p>Your password reset link is given below.</p>
            <p>Click the <a href="http://localhost:4444/reset-password/${token}">link</a> to set a new password</p>`
        })
    }).catch((err)=>{
    console.log(err)
  })
})
}

exports.getPasswordForm = (req,res,next)=>{

  const token = req.params.token
  User.findOne({ resetToken : token, resetTokenExpiration : { $gt : Date.now() } }).then((user)=>{
      let msg = req.flash('error')
      if(msg.length >0){
        msg = msg[0]
      }else{
        msg = null
      }
      res.render('auth/newpass', {
        pageTitle: 'Reset Password',
        path: '/auth/signup',
        isAuthenticated : req.session.isLoggedIn,
        errorMsg : msg,
        userId : user._id.toString(),
        passwordToken : token
      })  
  }).catch()
}

exports.postPasswordForm = (req,res,next)=>{
  const newpassword = req.body.password
  const userId = req.body.userID
  const passwordToken = req.body.passwordToken
  let resetUser

  User.findOne({ resetToken : passwordToken, resetTokenExpiration : { $gt : Date.now() }, _id : userId }).then((user)=>{
    resetUser = user
    return bcrypt.hash(newpassword, 8)
  }).then((hashPassword)=>{
    resetUser.password = hashPassword
    resetUser.resetToken = null
    resetUser.resetTokenExpiration = null
    return resetUser.save()
  }).then(()=>{
    res.redirect('/login')
  }).catch()
}
