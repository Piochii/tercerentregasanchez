const cartsModel = require('./model/cart')

class CartManagerMongo {
  createCart = async () => {
    try {
      const cart = await cartsModel.create({})
      return cart
    } catch (error) {
      console.log(`Error creating cart: ${error.message}`)
    }
  }
  deleteCart = async (id) => {
    try {
      const cart = await this.getById(id)
      if (!cart) {
        throw new Error(`No cart found with the requested id.`)
      } else {
        await cartsModel.findOneAndDelete({ _id: id })
        return "Cart successfully deleted"
      }
    } catch (error) {
      console.log(`Error deleting cart: ${error.message}`)
    }
  }
  getById = async (id) => {
    try {
      const cart = await cartsModel
        .findOne({ _id: id })
        .populate("products.product")
        .lean()
      if (!cart) {
        throw new Error(`Does not exist.`)
      } else {
        return cart
      }
    } catch (error) {
      console.log(
        `Error looking for the cart with the requested id: ${error.message}`
      )
    }
  }
  addToCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      )
      if (!cart) {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $addToSet: { products: { product: pid, quantity: 1 } } },
          { new: true }
        )
        return cart
      }
      return cart
    } catch (error) {
      console.log(`Error adding product to cart: ${error.message}`)
    }
  }
  deleteProduct = async (cid, pid) => {
    try {
      const cart = await this.getById(cid)
      const quantity = cart.products.find(item => item.product._id).quantity
      if (quantity > 1) {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid, "products.product": pid },
          { $set: { "products.$.quantity": quantity - 1 } },
          { new: true }
        )
        return cart
      } else {
        const cart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $pull: { "products": { "product": pid } } },
          { new: true }
        )
        return cart;
      }
    } catch (error) {
      console.log(`Error deleting product from cart: ${error.message}`)
    }
  }
  deleteAllProducts = async (id) => {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { _id: id },
        { $set: { products: [] } }
      )
      return cart
    } catch (error) {
      console.log(
        `Error deleting all products from the cart: ${error.message}`
      )
    }
  }
}
module.exports = new CartManagerMongo