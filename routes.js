const express = require('express')
const auth = require('./middleware/auth')
const User = require('./models/user')

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body)
    res.send("Home..")
})

router.post('/singin', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.senha)
        const token = await user.generateAuthToken()
        //console.log(token)

        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/singup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        //console.log(token)
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/buscar', auth, async(req, res)=> {
    console.log("buscando usuarios mongodb")
    const usuario = await User.find()
    res.send('Buscando users: ' + usuario)
})

module.exports = { 
    router 
}