const Photo = require('../models/Photo')
const User = require('../models/User')
const mongoose = require('mongoose')

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const {title} = req.body
    const image = req.file.filename

    const reqUser = req.user
    const user = await User.findById(reqUser._id)

    // Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name
    })

    if (!newPhoto) {
        res.status(400).json({errors: ['Ocorreu uma falha ao tentar completar a operação!']})
        return
    }
    
    // If photo was created successfully, return data
    res.status(201).json(newPhoto)
}

// Remove a photo from DB
const deletePhoto = async (req, res) => {
    const {id} = req.params
    const reqUser = req.user
    
    try {
        const photo = await Photo.findById(id)
        
        // Check if photo belongs to user
        if (!photo.userId.equals(reqUser._id)) {
            return res.status(422).json({errors: ['Você não pode excluir a postagem de outro usuário!']})
        }

        await Photo.findByIdAndDelete(photo._id)
        return res.status(200).json({id:photo._id, message:'Foto excluída com sucesso!'})
    } catch (error) {
        return res.status(404).json({errors: ['Postagem não encontrada!']})
    }
}

// Get all photos
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({}).sort([['createdAt', -1]]).exec()
    return res.status(200).json(photos)
}

// Get user photos
const getUserPhotos = async (req, res) => {
    const {id} = req.params
    const photos = await Photo.find({userId: id})
        .sort([['createdAt', -1]])
        .exec()

    return res.status(200).json(photos)
}

// Get photo by id
const getPhotoById = async (req, res) => {
    const {id} = req.params
    
    // Check if photo exists
    try {
        const photo = await Photo.findById(id)
        return res.status(200).json(photo)
    } catch (error) {
        return res.status(404).json({errors: ['Postagem não encontrada!']})
    }
}

// Update a photo
const updatePhoto = async (req, res) => {
    const {id} = req.params
    const {title} = req.body

    const reqUser = req.user
    
    // Check if photo exists
    try {
        const photo = await Photo.findById(id)

        // Check if photo belongs to user
        if (!photo.userId.equals(reqUser._id))
            return res.status(422).json({errors: ['Você não pode atualizar a postagem de outro usuário!']})

        if (title)
            photo.title = title

        await photo.save()
        return res.status(201).json({photo, message:'Postagem atualizada com sucesso!'})
    } catch (error) {
        return res.status(404).json({errors: ['Postagem não encontrada!']})
    }
}

// Like functionality
const likePhoto = async (req, res) => {
    const {id} = req.params
    const reqUser = req.user

    try {
        const photo = await Photo.findById(id)

        // Check if the user already liked the photo
        if (photo.likes.includes(reqUser._id)) {
            photo.likes.splice(photo.likes.indexOf(reqUser._id), 1);
            await photo.save()
            return res.status(201).json({photoId: id, userId: reqUser._id, message: 'Like removido!'})
        }

        photo.likes.push(reqUser._id)
        await photo.save()
        return res.status(201).json({photoId: id, userId: reqUser._id, message: 'Like adicionado!'})
    } catch (error) {
        return res.status(404).json({errors: ['Postagem não encontrada!']})
    }
}

// Comment functionality
const commentPhoto = async (req, res) => {
    const {id} = req.params
    const {comment} = req.body
    const reqUser = req.user

    try {
        const user = await User.findById(reqUser._id)
        const photo = await Photo.findById(id)

        // Put comment in the array comments
        const userComment = {
            comment,
            userName: user.name,
            userImage: user.profileImage,
            userId: user._id
        }

        photo.comments.push(userComment)
        await photo.save()
        res.status(200).json({
            comment: userComment,
            message: 'Comentário inserido com sucesso!'
        })

    } catch (error) {
        return res.status(404).json({errors: ['Postagem não encontrada!']})
    }
}

// Search photos by title
const searchPhotos = async (req, res) => {
    const {q} = req.query
    
    try {
        const photos = await Photo.find({title: new RegExp(q, 'i')}).exec()
        
        if (photos.length > 0)
            return res.status(200).json({photos})
        else
            return res.status(404).json({message: 'Não foram encontrados resultados para a busca!'})
    } catch (error) {
        return res.status(400).json({errors: ['Ocorreu uma falha ao tentar completar a operação!'], error})
    }
}

module.exports = {
    insertPhoto, 
    deletePhoto, 
    getAllPhotos, 
    getUserPhotos, 
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos
}