const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts  = (req, res, next) => {
  Product.find().then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated : req.session.isLoggedIn
    })
  }).catch((err)=>{
    console.log(err)
  })
}

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.id
  Product.findById(prodId).then((product)=>{
    const pageTitle = product.title
    res.render('shop/product-detail',{
      pageTitle,
      path : '/products',
      product,
      isAuthenticated : req.session.isLoggedIn
    })
  }).catch((err)=>{
    console.log(err)
  })
 }

exports.getIndex = (req,res,next) =>{
  Product.find().then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated : req.session.isLoggedIn
    })
  }).catch((err)=>{
    console.log(err)
  })
}

exports.getCart = (req,res,next)=>{
  req.user.populate('cart.items.productId')
  .execPopulate()
  .then((user)=>{
    const cartprod = user.cart.items  
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        prods : cartprod,
        isAuthenticated : req.session.isLoggedIn
      })  
  }).catch((err)=>{
    console.log(err)
  })
}

exports.postCart = (req,res,next)=>{
  const prodId = req.body.productId
  Product.findById(prodId).then((product)=>{
    return req.user.addToCart(product)
  }).then(()=>{
    res.redirect('/cart')
  }).catch()
}

exports.postDeleteCartItem = (req,res,next) =>{
  const prodId = req.body.productId
  req.user.removeFromCart(prodId).then(()=>{
    res.redirect('/cart')

  }).catch()
}

exports.postOrder = (req, res, next) =>{
    req.user.populate('cart.items.productId')
      .execPopulate()
      .then((user)=>{
        const products = user.cart.items.map((i)=>{
          return { quantity : i.quantity, product : { ...i.productId._doc } }
        })  
        const order = new Order({
          user : {
            username : req.user.username,
            userId : req.user
          },
          products
      })
      return order.save()
  }).then(()=>{
    return req.user.clearCart()
  }).then(()=>{
    res.redirect('/orders')
  }).catch()
}

exports.getOrders = (req,res,next)=>{
  Order.find({'user.userId' : req.user._id}).then((orders)=>{
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
      isAuthenticated : req.session.isLoggedIn
    })  
  }).catch()
}

