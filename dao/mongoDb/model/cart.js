const { Schema, model } = require('mongoose')

const collection = 'carts'

const cartsSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number },
      _id: false
    },
  ],
})

const cartsModel = model(collection, cartsSchema)

module.exports = cartsModel