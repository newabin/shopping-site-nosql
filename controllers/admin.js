const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editMode : false
    })
  }

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const price = req.body.price
    req.user.createProduct({title, imageUrl, description, price}).then((result)=>{
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
      req.user.getProducts({where : { id : prodId}})
//      Product.findByPk(prodId)
      .then((products)=>{
        const product = products[0]
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/add-product',{
            pageTitle : 'Edit Product',
            path: '/admin/edit-product',
            editMode,
            product
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
    Product.findByPk(id).then((product)=>{
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
    const updatedproduct = new Product(id, updatedtitle, updatedimageUrl, updateddescription, updatedprice)
    updatedproduct.save()
  }

  exports.postDeleteProduct = (req,res,next)=>{
    const prodID = req.body.id
    Product.findByPk(prodID).then((product)=>{
      return product.destroy()
    }).then((result)=>{
      res.redirect('/admin/products')
    }).catch((err)=>{
      console.log(err)
    })
  }

  exports.getAdminProducts = (req,res,next) =>{
    req.user.getProducts()
    .then((products)=>{
      res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        })
    }).catch((err)=>{
      console.log(err)
    })
}
