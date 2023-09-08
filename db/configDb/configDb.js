const {connect} = require('mongoose')

const url = "mongodb+srv://matisanchez:Matisanchez1234!@cluster0matias.fqcv8lg.mongodb.net/"
// Matisanchez1234!
module.exports = {
  connectDB: ()=>{
    connect(url)
    console.log('Base de datos conectada')
  }
}