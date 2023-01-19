const express = require('express')
const app = express()
const helmet = require('helmet')
const multer = require('multer')

app.use(helmet())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log('+++++++++' + file)
    callback(null, './uploads')
  },
  filename: (req, file, callback) => {
    console.log('>>>>>>>>>' + file)
    callback(null, file.originalname)
  },
})

const upload = multer({ storage }).array('photos', 3)
app.post('/multiple', (req, res) => {
  upload(req, res, (error) => {
    if (error) {
      res.send('File Upload Failed')
    } else {
      res.send('File Upload Success')
    }
  })
})

app.listen(8000)
console.log('Server Running')
