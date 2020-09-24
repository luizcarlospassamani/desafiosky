const express = require('express')
const auth = require('../middleware/auth')
const jsonvalidate = require('../middleware/jsonvalidate')
const User = require('../models/user')

const router = express.Router();



/*
endpoint: /singup
input: Corpo no formato json com os dados do usuário
function: Adiciona um model do tipo User no banco com senha encriptada e token
output: O usuario criado e seu token caso tudo ocorra bem ou mensagem de erro caso não seja possível criar o usuario
*/
router.post('/singup', jsonvalidate, async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({user, token})
    } catch(e) {
        res.status(400).json({message: e.message})
    }
})

/*
endpoint: /singin
input: Corpo no formato json com o login e senha do usuário
function: Busca usuário no banco e verifica se a senha informada é valida, gera um novo token atualizado
output: O usuário criado e seu token caso tudo ocorra bem ou mensagem de erro caso não seja possível criar o usuario
*/
router.post('/singin', jsonvalidate, async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.senha)
        const token = await user.generateAuthToken()

        res.status(201).json({user, token})
    } catch(e) {
        res.status(401).json({message: e.message})
    }
})

/*
endpoint: /buscar/:id
input: header com o token do usuário e o id informado pelo path
function: Verifica se o usuário logado esta com o token valido e se estiver correto, buscar o usuário pelo id informado no path
output: O usuário informado pelo seu id no path ou mensagem de erro caso não seja possível criar o usuário
*/
router.get('/buscar/:id', auth, async(req, res)=> {
    try {
        const user = await User.findById(req.params.id)
        res.status(201).json(user)
    } catch (e) {
        res.status(401).json({message: e.message})
    }
})


module.exports = { 
    router 
}