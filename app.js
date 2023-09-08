const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const handlebars = require('express-handlebars')
const routers = require('./routes/index')
const routersMongo = require('./routesMongo/index')
const viewsRouter = require('./routes/views')
const ProductManager = require('./dao/fileSystem/productsManager')
const configDb = require('./db/configDb/configDb')
const chatManager = require('./dao/mongoDb/chat')

const app = express()
const PORT = 8080

configDb.connectDB()

const httpServer = http.createServer(app)
const productsList = new ProductManager(`${__dirname}/db/products.json`)

//hbs--------------------------
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname +'/views')
app.set('view engine', 'handlebars')
//hbs--------------------------

app.use('/static', express.static(`${__dirname}/public`))
//Parseamos la informacion que el servidor recibe
app.use(express.json())
//Agregamos "urlencoded" para que el sv interprete los datos que viajan en la url
app.use(express.urlencoded({ extended: true }))
//Iniciamos el servidor
const io = new Server(httpServer)
httpServer.listen(PORT, () => {
    console.log(`Listening app port ${PORT}`)
})

//Configuramos los routes, los cuales estaran en /api/products y /api/carts dentro de routes/index
app.use('/api', routers)
//Configuramos los routes de mongo
app.use('/api', routersMongo)
//Configuramos los routes de las views
app.use("/", viewsRouter)

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado', socket.id)
    const messages = await chatManager.getAllMessages()
    socket.on('client:productDelete', async (pid, cid) => {
        const id = await productsList.getProductById(parseInt(pid.id))
        if(id) {
        await productsList.deleteById(parseInt( pid.id ))
        const data = await productsList.getProducts()
        return io.emit('newList', data)
        }
        const dataError = {status: "error", message: "Product not found"}
        return socket.emit('newList', dataError)
    })
    socket.on('client:newProduct', async data => {
        console.log(data.thumbnail)
        const imgPaths = data.thumbnail
        const productAdd = await productsList.addProducts(data, imgPaths)
        console.log(productAdd);
        if(productAdd.status === 'error'){
            let errorMess = productAdd.message
            socket.emit('server:producAdd', {status:'error', errorMess})
        }
        const newData = await productsList.getProducts()
        return io.emit('server:productAdd', newData)
    })
    //chat
    socket.emit("messages", messages)
    socket.on("newMessage", async data => {
        await chatManager.addMessages(data)
        const newMessageList = await chatManager.getAllMessages()
        io.emit("messages", newMessageList)
    });
})