const multer = require('multer')
const path = require('path')

// Destination to store image
const imageStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        let folder = ''

        if (req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('photos')) {
            folder = 'photos'
        }

        callback(null, `uploads/${folder}/`)
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/i)) {
            // Upload only png, jpg and jpeg formats
            return callback(new Error('Somente imagens nos formatos PNG, JPG ou JPEG são aceitos!'))
        }
        callback(undefined, true)
    }
})

module.exports = {imageUpload}