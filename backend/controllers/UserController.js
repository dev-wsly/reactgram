const User = require('../models/User')
const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secret = process.env.JWTSECRET

// Generate User Token
const generateToken = (id) => {
    return jwt.sign({id}, secret, {
        expiresIn: '7D',
    })
}

// Register user and sign in
const register = async (req, res) => {
    const {name, email, password} = req.body

    // Check if user exists
    const user = await User.findOne({email})
    if (user) {
        res.status(422).json({errors: ['E-mail já cadastrado em outro usuário!']})
        return
    }

    // Generate password hash
    const salt = await bcryptjs.genSalt()
    const passwordHash = await bcryptjs.hash(password, salt)

    // Create user
    const newUser = await User.create({
        name, 
        email, 
        password: passwordHash
    })

    // If user was created successfully, return the token
    if (!newUser) {
        res.status(422).json({errors: ['Ocorreu uma falha ao tentar completar a operação!']})
        return
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}

// Sign user in
const login = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    // Check if user exists
    if (!user) {
        res.status(404).json({errors: ['Usuário não encontrado!']})
        return
    }

    // Check if password matches
    if (!(await bcryptjs.compare(password, user.password))) {
        res.status(422).json({errors: ['Senha inválida!']})
        return
    }
    
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

// Get current logged in user
const getCurrentUser = async (req, res) => {
    const user = req.user

    res.status(200).json(user)
}

// Update an user
const update = async (req, res) => {
    const {name, password, bio} = req.body
    let profileImage = null

    if (req.file) {
        profileImage = req.file.filename
    }

    const reqUser = req.user
    const user = await User.findById(reqUser._id).select('-password')

    if (name) {
        user.name = name
    }

    if (password) {
        // Generate password hash
        const salt = await bcryptjs.genSalt()
        const passwordHash = await bcryptjs.hash(password, salt)

        user.password = passwordHash
    }

    if (profileImage) {
        user.profileImage = profileImage
    }

    if (bio) {
        user.bio = bio
    }

    await user.save()
    res.status(200).json(user)
}

// Get user by id
const getUserById = async (req, res) => {
    const {id} = req.params
    
    // Check if user exists
    try {
        const user = await User.findById(id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({errors: ['Usuário não encontrado']})
        return
    }
}

module.exports = {generateToken, register, login, getCurrentUser, update, getUserById}