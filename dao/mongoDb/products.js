const { productsModel } = require('./model/products.js')

class ProductManagerMongo {
  addProduct = async (product, path) => {
    try {
      const thumbnail = path
      if (this.#paramsValidator(product)) {
        product = {
          code: this.#codeGenerator(),
          status: true,
          thumbnail,
          ...product,
        }
        const newProduct = await productsModel.create(product)
        return newProduct
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`)
    }
  }
  getAll = async () => {
    try {
      const allProducts = await productsModel.find().lean(); 
      return allProducts
    } catch (error) {
      console.log(`Error obteniendo todos los productos: ${error.message}`)
    }
  }
  getById = async (id) => {
    try {
      const product = await productsModel.find({ _id: id })
      if (product) {
        return product
      } else {
        throw new Error(`Producto con id ${id} no encontrado`);
      }
    } catch (error) {
      console.log(
        `Error al buscar producto con el id solicitado: ${error.message}`
      )
    }
  }
  updateProduct = async (id, data) => {
    try {
      const productFinded = await this.getById(id)
      if (productFinded) {
        await productsModel.findOneAndUpdate({_id: id}, data)
        const updatedProduct = await this.getById(id)
        return updatedProduct
      } else {
        throw new Error(`No se encontro el producto con el id solicitado`)
      }
    } catch (error) {
      console.log(
        `Error al modificar producto con el id ${id}: ${error.message}`
      );
    }
  }
  deleteById = async (id) => {
    try {
      const deletedProduct = await this.getById(id)
      if (deletedProduct) {
        await productsModel.deleteOne({ _id: id })
        return "Producto eliminado"
      } else {
        throw new Error(`Producto con id ${id} no encontrado`)
      }
    } catch (error) {
      console.log(
        `Error al eliminar el producto con el id solicitado: ${error.message}`
      )
    }
  }
  deleteAll = async () => {
    try {
      await productsModel.deleteMany()
      return "Productos eliminados"
    } catch (error) {
      console.log(`Ocurrio un error eliminando los datos: ${error.message}`)
    }
  }
  #codeGenerator(codeLength = 15) {
    const numeros = "0123456789"
    const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numYLetras = numeros + letras
    let code = ""
    for (let i = 0; i < codeLength; i++) {
      const random = Math.floor(Math.random() * numYLetras.length)
      code += numYLetras.charAt(random)
    }
    return code
  }
  #paramsValidator(product) {
    if(
        product.title &&
        product.description &&
        product.category &&
        product.price &&
        product.status &&
        product.stock
    ){
        return true
    }
    return console.log('To add a product you must do it with all its properties')
    }
}
module.exports = new ProductManagerMongo