const {Router} =require('express')
const productsRouter = require('./products')
const usersRouter = require('./users.js')
const cartsRouter = require('./carts.js')

const router = Router()


router.use('/productsMongo', productsRouter)
router.use('/usersMongo', usersRouter)
router.use('/cartsMongo', cartsRouter)

module.exports = router