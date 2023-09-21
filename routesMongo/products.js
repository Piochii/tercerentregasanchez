const {Router} = require('express')
const productManager = require('../dao/mongoDb/products')
const uploader = require('../utils')

const router = Router()

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll()
    res.send({
      status: 'success',
      payload: products,
    })
  } catch (error) {
    console.log(error)
  }
})
router.get('/:pid', async (req, res) => {
  try {
    const {pid} = req.params
    let product = await productManager.getById(pid)
    res.status(200).send({
      status: 'success',
      payload: product
  })
  } catch (error) {
    console.log(error)
  }
})
router.post('/', uploader.array('thumbnail', 10), async (req, res) => {
  try {
    const newProduct = req.body
    const imgPaths = req.files.map(file => file.path)
    let result = await productManager.addProduct(newProduct, imgPaths)
    res.status(201).send({
      status: 'success',
      payload: result
    })
  } catch (error) {
    console.log(error)
  }
})
router.put('/:pid', uploader.array('thumbnail', 10), async (req, res) => {
  try {
    const {pid} = req.params
    const data = req.body
    let result = await productManager.updateProduct({_id: pid}, data)
    res.status(200).send({
      status: 'success',
      payload: result
    })
  } catch (error) {
    console.log(error)
  }
})
router.delete('/:pid', async (req, res) => {
  try {
    const {pid} = req.params
    let result = await productManager.deleteById(pid)
    res.status(200).send({
      status: 'success',
      payload: result
    })
  } catch (error) {
    console.log(error)
  }
})
router.delete("/", async (req, res) => {
  try {
    const removedProducts = await productManager.deleteAll()
    !removedProducts
      ? res.status(404).json({ error: "Products could not be deleted" })
      : res.status(200).json(removedProducts)
  } catch (error) {
    console.log(error)
  }
})
module.exports = router