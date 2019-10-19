const mongoose = require('mongoose')

exports.mongoConnect = mongoose.connect('mongodb+srv://newabin:practisenode@cluster0-ymvj0.mongodb.net/test?retryWrites=true&w=majority')
