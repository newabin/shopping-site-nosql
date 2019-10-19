const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

module.exports = mongoose.model('Product', productSchema)


// const { getDb } = require('../util/sqldb')
// const mongodb = require('mongodb')

// class Product{
//     constructor(title, imageUrl, description, price , id, userId){
//         this.title = title
//         this.price = price
//         this.description = description
//         this.imageUrl = imageUrl
//         this._id = id ? new mongodb.ObjectId(id) : null
//         this.userId = userId
//     }

//     save(){
//         const db = getDb()
//         let dbOp
//         if(this._id){
//             dbOp = db.collection('products')
//             .updateOne({ _id : this._id}, { $set : this})
//         }else{
//             dbOp = db.collection('products').insertOne(this)
//         }
//         return dbOp.then((result)=>{
//             // console.log(result)
//         }).catch()    
//     }

//     static fetchAll(){
//         const db = getDb()
//         return db.collection('products').find().toArray().then((products)=>{
//             return products
//         }).catch()
//     }

//     static findByPk(id){
//         const db = getDb()
//         return db.collection('products').findOne({ _id : new mongodb.ObjectId(id) }).then((product)=>{
//             return product
//         }).catch()
//     }

//     static deleteByPk(id){
//         const db = getDb()
//         return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) }).then(()=>{

//         }).catch()
//     }
// }

// module.exports = Product