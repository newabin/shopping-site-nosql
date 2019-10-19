const User = require('../models/user')

exports.getLogin = (req,res,next)=>{
//    const isLoggedIn =  req.get('Cookie').trim().split('=')[1] === 'true'
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/auth/login',
      isAuthenticated : req.session.isLoggedIn

    })  
}

exports.postLogin = (req,res,next)=>{
  User.findById('5da9caf79275db3500314b15').then((user)=>{
    req.session.isLoggedIn = true
    req.session.user = user
    req.session.save(()=>{
      res.redirect('/')
    })
  }).catch()
}

exports.postLogout = (req,res,next)=>{
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })
}