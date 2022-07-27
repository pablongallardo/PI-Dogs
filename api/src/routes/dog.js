const { Router } = require('express');
const { Dog, Temperamento } = require('../db');
require('dotenv').config();
const { json } = require('body-parser');
const axios = require('axios')
const { Op } = require("sequelize");
const {
    URL_API
} = process.env;

const router = Router();

const validateImage = (URL) => {
    const regex = new RegExp(/(https?:\/\/.*\.(?:png|jpg|gif))/);
    if(regex.test(URL)) return URL;
    if(!regex.test(URL)) return 'C:\SoyHenry carrera\PI-Dogs-main\client\imagenes\dogback.png';

}

router.post('/', async (req, res) =>{
    let {name, height, weight, life_span,image, temperamentos } = req.body
    if(!name || !height || !weight) return res.status(404).send({mensaje: 'Required data missing'})

    try {
        const [newDog, created] = await Dog.findOrCreate({
            where: {name: name.toLowerCase()},
            defaults: {
                name: name.toLowerCase(),
                height: height,
                weight: weight,
                life_span: life_span,
                // image: validateImage(image)
            }
        })
        if(created){
            const temps = await Temperamento.findAll({
                where: {
                    id: temperamentos
                }
            })
            await newDog.addTemperamentos(temps);
            return res.send('Breed successfully created')
        }
        res.send({mensaje: 'Breed already exists ... Find it through the search bar'})
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
})


module.exports = router;