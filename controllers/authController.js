const User = require('../models/User')
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const generateAccessToken = (id,cities) => {
    const payload = {
        id,
        cities
    }
    return jwt.sign(payload, 'secretKey', {expiresIn: "24h"})
}


class AuthController {
    async registration(req,res){
        try {
            const error = validationResult(req)
            if (!error.isEmpty()){
                return res.status(400).json('Error validation')
            }
            const {username,password} = req.body
            const candidate = await User.findOne({username})
            if (candidate){
                return res.status(400).json({message:'User already exists'})
            }
            const salt = bcrypt.genSaltSync(5);
            const hashPassword =  bcrypt.hashSync(password,salt)
            const user = new User({username:username,password:hashPassword})
            await user.save()
            return res.json({message:'Registration has been success'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message:'Registration error'})
        }
    }

    async addNewCity(req,res){
        try {
            const {username, cityName} = req.body
            let user = await User.findOne({username})
            if (!user) {
                res.status(400).json({message:'Not found user'})
            }
            if (user.cities.length > 9){
                res.status(400).json({message:'Maximum cities '})
            }
            const cities = user.cities
            user.cities =   [...cities,{cityName: cityName }]
             await user.save()
             await res.json(user.cities)
        } catch (e) {

        }
    }

    async getAllCities(req,res){
        try{
            const username = req.body.username
            const user = await User.findOne({username})
            if (!user) {
                res.status(400).json({message:'Not found user'})
            }
            await res.json(user.cities)
            await res.json('Done')
        }catch (e) {
            console.log(e)
        }
    }

    async deleteCity(req,res){
        try{
            const {username, cityId} = req.body
            let user = await User.findOne({username})
            if (!user) {
                res.status(400).json({message:'Not found user'})
            }
            user.cities = await user.cities.filter(city => city._id.toString() !== cityId)
            await user.save()
            await res.json(user.cities)
        }catch (e) {
            console.log(e)
        }
    }

    async login(req,res){
        try {
            const { username, password} = req.body
            const user = await User.findOne({username})
            if (!user){
                res.status(400).json({message:'Authorisation error'})
            }
            const validPassword = bcrypt.compareSync(password,user.password)
            if (!validPassword){
                res.status(400).json({message:'Wrong password'})
            }
            const token = generateAccessToken(user._id, user.cities)
            return res.json({token})
        } catch (e) {
            res.status(400).json({message:'Login error'})
        }
    }

    async getUsers(req,res){
       try {
           const users = await User.find()
           await res.json(users)
           await res.json('Done')
       } catch (e) {
           console.log(e)
       }
    }
}

module.exports = new AuthController()