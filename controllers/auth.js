const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res,next)=>{
//    const isLoggedIn =  req.get('Cookie').trim().split('=')[1] === 'true'
    res.render('auth/login', {
      pageTitle: 'Login',
      path: '/auth/login',
      isAuthenticated : req.session.isLoggedIn

    })  
}

exports.postLogin = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email : email }).then((user)=>{
    if(!user){
      return res.redirect('/login')
    }
    bcrypt.compare(password, user.password).then((match)=>{
      if(match){
          req.session.isLoggedIn = true
          req.session.user = user
          return req.session.save(()=>{
              res.redirect('/')
            })
        }
        res.redirect('/login')
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
    res.render('auth/signup', {
      pageTitle: 'SignUp',
      path: '/auth/signup',
      isAuthenticated : req.session.isLoggedIn

    })  
}

exports.postSignup = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  const cpassword = req.body.cpassword
  User.findOne({ email : email }).then((userDoc)=>{
    if(userDoc){
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 8).then((hashPassword)=>{
        const user = new User({
          email : email,
          password : hashPassword,
          cart : { items: [] }
        })
        user.save().then(()=>{
        console.log('User Created')
        res.redirect('/login')
      })
    })
  }).catch()
}
