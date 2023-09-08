const multer = require('multer')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/uploads`)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploader = multer({
  storage,
  onError: (err, next) => {
      console.log(err)
      next()
  }
})

module.exports = uploader