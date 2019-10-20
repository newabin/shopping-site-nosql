const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    resetToken : {
        type : String
    },
    resetTokenExpiration : {
        type : Date
    },
    cart : {
        items : [{ productId : { type : Schema.Types.ObjectId, ref : 'Product', required : true }, quantity : { type : Number, required : true } }]
    }
})

UserSchema.methods.addToCart = function(product){
        const cartProductIndex = this.cart.items.findIndex((cp)=>{
            return cp.productId.toString() === product._id.toString()
        })
        let newQty = 1

        const updatedCartItems = [...this.cart.items]
          
        if(cartProductIndex >= 0){
            newQty = this.cart.items[cartProductIndex].quantity + 1
            updatedCartItems[cartProductIndex].quantity = newQty
        }else{
            updatedCartItems.push({ productId: product._id, quantity : newQty })
        }

        const updateCart = { items: updatedCartItems}
        this.cart = updateCart
        return this.save()

}

UserSchema.methods.removeFromCart = function(id){
        const updatedCartItems = this.cart.items.filter((item)=>{
            return item.productId.toString() !== id.toString()
        })
        this.cart.items = updatedCartItems
        return this.save()
}

UserSchema.methods.clearCart = function(){
    this.cart = { items : []}
    return this.save()
}

module.exports = mongoose.model('User', UserSchema)

// const { getDb } = require('../util/sqldb')
// const mongodb = require('mongodb')

// class User {
//     constructor(username, email, cart, id){
//         this.username = username
//         this.email = email
//         this.cart = cart
//         this._id = id
//     }

//     save(){
//         const db = getDb()
//         return db.collection('users').insertOne(this).then(()=>{

//         }).catch()
//     }

//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex((cp)=>{
//             return cp.productId.toString() === product._id.toString()
//         })
//         let newQty = 1

//         const updatedCartItems = [...this.cart.items]
          
//         if(cartProductIndex >= 0){
//             newQty = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQty
//         }else{
//             updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity : newQty })
//         }

//         const updateCart = { items: updatedCartItems}
//         const db =getDb()
//         return db.collection('users').updateOne({ _id : new mongodb.ObjectId(this._id )}, { $set: { cart : updateCart }})
//     }

//     getCart(){
//         const db = getDb()
//         const productIds = this.cart.items.map((i)=>{
//             return i.productId
//         })
//         return db.collection('products').find({ _id : {$in : productIds} }).toArray()
//             .then((products)=>{
//                 return products.map((p)=>{
//                     return { ...p, quantity: this.cart.items.find((i)=>{
//                         return i.productId.toString() === p._id.toString()
//                     }).quantity
//                 }
//             })
//         })
//     }

//     deleteCartItem(id){
//         const updatedCartItems = this.cart.items.filter((item)=>{
//             return item.productId.toString() !== id.toString()
//         })
//         const updateCart = { items: updatedCartItems}
//         const db =getDb()
//         return db.collection('users').updateOne({ _id : new mongodb.ObjectId(this._id )}, { $set: { cart : updateCart }})        

//     }

//     addOrder(){
//         const db = getDb()
//         return this.getCart().then((products)=>{
//             const order = {
//                 items: products,
//                 user: {
//                     _id : new mongodb.ObjectId(this._id),
//                     name : this.username        
//                 } 
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(()=>{
//             this.cart = {items: []}
//             return db.collection('users').updateOne({ _id : new mongodb.ObjectId(this._id )}, { $set: { cart : { items : []} }})
//         })
//     }

//     getOrders(){
//         const db = getDb()
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray()
        
//     }

//     static findByPk(id){
//         const db = getDb()
//         return db.collection('users').findOne({ _id : new mongodb.ObjectId(id) }).then((user)=>{
//             return user
//         }).catch()
//     }
// }

// module.exports = User