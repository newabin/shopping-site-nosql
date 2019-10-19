const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongodbStore = require('connect-mongodb-session')(session)

const app = express()
const store = new MongodbStore({
  uri : 'mongodb+srv://newabin:practisenode@cluster0-ymvj0.mongodb.net/shop?retryWrites=true&w=majority',
  collection : 'sessions'
})

const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', 'views')

 const adminRoutes = require('./routes/admin')
 const shopRoutes = require('./routes/shop')
 const errorController = require('./controllers/error') 
 const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({ secret : 'MyNaMeIsPrAvIn', resave : false, saveUninitialized : false, store : store }))

app.use((req,res,next)=>{
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id).then((user)=>{
    req.user = user
    next()
  }).catch()
})


  app.use('/admin', adminRoutes)
  app.use(shopRoutes)
  app.use(authRoutes)
//app.use(errorController.get404page)

mongoose.connect('mongodb+srv://newabin:practisenode@cluster0-ymvj0.mongodb.net/shop?retryWrites=true&w=majority').then(()=>{
  app.listen(4444,()=>{
    console.log('Listening at port 4444')
  })  
})
