const {Schema, model} = require('mongoose')

const collection = 'products'

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    code: {
      type: String,
      unique: true
    },
    category: String,
    thumbnail: Array,
    status: Boolean
})

const productsModel = model(collection, productSchema)

module.exports = {
  productsModel
}