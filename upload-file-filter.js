const express = require('express')
const app = express()
const helmet = require('helmet')
const { MulterError } = require('multer')
const multer = require('multer')

app.use(helmet())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// storage
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

// file filter / size /

app.post('/image-upload-filter', async (req, res) => {
  const maxSize = 60 * 1024 * 1024
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'jpeg' ||
        file.mimetype === 'image/webp'||
        file.mimetype === "video/mp4"
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Only jpg png jpeg webp in allowed to upload'))
      }
    },
    limits: { fileSize: maxSize },
  }).array('photo', 12)

  

  upload(req, res, (error) => {
    console.log('Body test', req.body)
    console.log('Files test', req.file)
    if (error instanceof MulterError) {
      res.status(400).json({
        status: 'Fail',
        message: error.message,
      })
    } else if (error) {
      res.status(400).json({
        status: 'Fail',
        message: error.message,
      })
    }
    res.status(200).json({ message: 'File upload success' })
  })
})

app.listen(8000)
console.log('Server Running')
