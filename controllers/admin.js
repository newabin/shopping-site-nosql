const Product = require('../models/product')
const mongodb = require('mongodb')
const User = require('../models/user')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editMode : false,
      isAuthenticated : req.session.isLoggedIn

    })
  }

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const price = req.body.price
  
    const product = new Product({title : title, imageUrl : imageUrl, description : description, price : price, userId : req.user})

    product.save().then((result)=>{
      res.redirect('/admin/products')
    }).catch((err)=>{
      console.log(err)
    })
  }

  exports.getEditProduct = (req,res,next)=>{
      const editMode = req.query.edit
      const prodId = req.params.id
      if(!editMode){
          return res.redirect('/')
      }
     Product.findById(prodId)
      .then((product)=>{
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/add-product',{
            pageTitle : 'Edit Product',
            path: '/admin/edit-product',
            editMode,
            product,
            isAuthenticated : req.session.isLoggedIn
        })
      }).catch((err)=>{
        console.log(err)
      })
  }

  exports.postEditProduct = (req, res, next) => {
    const id = req.body.id
    const updatedtitle = req.body.title
    const updatedimageUrl = req.body.imageUrl
    const updateddescription = req.body.description
    const updatedprice = req.body.price
    Product.findById(id).then((product)=>{
      product.title = updatedtitle
      product.imageUrl = updatedimageUrl
      product.price = updatedprice
      product.description = updateddescription
      return product.save()
    }).then((result)=>{
      // console.log('Updated Product')
      res.redirect('/admin/products')
    }).catch((err)=>{
      console.log(err)
    })
  }

  exports.postDeleteProduct = (req,res,next)=>{
    const prodID = req.body.id
    req.user.removeFromCart(prodID).then(()=>{
      Product.findByIdAndRemove(prodID)
      .then(()=>{
            res.redirect('/admin/products')
      }).catch()
    }).catch((err)=>{
      console.log(err)
    })
  }

  exports.getAdminProducts = (req,res,next) =>{
    Product.find().then((products)=>{
      res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          isAuthenticated : req.session.isLoggedIn
        })
    }).catch((err)=>{
      console.log(err)
    })
}
