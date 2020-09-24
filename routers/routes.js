const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body)
    res.json("Home..")
})

router.post('/singin', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.senha)
        const token = await user.generateAuthToken()

        res.status(201).json({user, token})
    } catch(e) {
        res.status(401).json({message: e.message})
    }
})

router.post('/singup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user, token})
    } catch(e) {
        res.status(400).json({message: e.message})
    }
})

router.get('/buscar/:id', auth, async(req, res)=> {
    try {
        const user = await User.findById(req.params.id)
        res.status(201).json(user)
    } catch (e) {
        res.status(401).json({message: e.message})
    }
})

/*router.get('/buscar', async(req, res)=> {
    console.log("buscando usuarios mongodb")
    const user = await User.find()
    res.json(user)
})*/

module.exports = { 
    router 
}