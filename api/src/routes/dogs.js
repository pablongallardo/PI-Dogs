const { Router } = require('express');
const { Dog, Temperamento } = require('../db');
require('dotenv').config();
const { json } = require('body-parser');
const { Sequelize, Op } = require("sequelize");
const axios = require('axios')

const {
    URL_API, API_KEY
} = process.env;

const router = Router();
router.get('/', async (req, res, next) => {
    console.log('ingresa exitosamente')
    const { name } = req.query;
    if (!name) {
      try {
        var database = await Dog.findAll({
          include: {
            model: Temperamento,
              attributes: {
                include: ['name'], 
                exclude:['createdAt', 'updatedAt']
              },
              through: {
                attributes:[]
              }
          }
        })
        const api = await axios.get(`${URL_API}?api_key=${API_KEY}`)
        Promise.all([database, api])
          .then((results) => {
            const [databased, apiData] = results;
            const response = databased.concat(apiData.data)
            res.send(response);
          })
      } catch (error) {
        next(error)
        res.send(error.message)
      }
    } else {
      try {
        var database = await Dog.findAll({
          include: {
            model: Temperamento,
              attributes: {
                include: ['name'], 
              },
              through: {
                attributes:[]
              }
          }
        })
  
        const api = await axios.get(`${URL_API}?api_key=${API_KEY}`)
        let dogs = await Promise.all([database, api])
          .then((results) => {
            const [databased, apiData] = results;
            const response = databased.concat(apiData.data)
            return response;
          })
        let resultado = []
        for (let i = 0; i<dogs.length;i++){
          if(dogs[i].name.includes(name)){
           resultado.push(dogs[i])
          }}
        res.send(resultado).status(200)       
  
      } catch (error) {
        next(error)
        console.log(error)
        res.send({error:"Dog does not exist"}).status(404)
      }
    }
  
  })

router.get("/:id", async (req, res, next) => {
    const {id} = req.params;
    if (id.length < 15) {
        try {
            const perritos = await axios.get(`https://api.thedogapi.com/v1/breeds/?api_key=${API_KEY}`)
            res.json(perritos.data.find(dog => dog.id === parseInt(id)))
        } catch (error) {
            next(error)
        }
        
    } else {
        try {
            Dog.findAll({ 
                where: {id: id},
                include: {
                    model: Temperamento,
                    attributes: ["name"],
                    through: {
                        attributes: []
                    }
                }
            })
            .then(resp => res.send(resp))
        
        } catch (error) {
            next(error)
        }
    }
})

// function validarPeso(peso) {
//     let [min, max] = peso.split("-");
//     min = isNaN(min) ? "0" : parseInt(min);
//     max = isNaN(max) ? "0" : parseInt(max);
//     return [min, max];
//   }

// router.get('/', async (req, res) => {  // Back 1 y 2
//     let { name } = req.query
//     if (!name) {
//         try {
//             const perros = await axios(URL_API)
//             const datosApi = perros.data.map(p => {
//                 let perro = {
//                     id: p.id,
//                     image: p.image.url,
//                     name: p.name.toLowerCase(),
//                     Temperamento: p.Temperamento,
//                     weight: validarPeso(p.weight.metric)
//                 }
//                 return perro
//             })
//             const datosDB = (await Dog.findAll(            
//             {
//                 include: {
//                         model: Temperamento,
//                         attributes: ["name"],
//                         through: { attributes: [] },
//                 }
//             }
//             )).map(p=>{                 
//                 let pdb = {
//                     id: p.id,
//                     image: p.image,
//                     name: p.name.toLowerCase(), 
//                     weight: validarPeso(p.weight),
//                     Temperamento: p.temperamentos.map(t=> t.name).join(', ')                    
//                 }
//                 return pdb                
//             })
//             const unidos = datosDB.concat(datosApi)
//             res.json(unidos)

//         } catch (error) {
//             res.status(404).send(error)
//         }
//     } else {
//         try {
//             const perros = await axios(URL_API)
//             const filtrados = perros.data.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
//             const final = filtrados.map(p => {
//                 let perro = {
//                     id: p.id,
//                     image: p.image.url,
//                     name: p.name,
//                     Temperamento: p.Temperamento,
//                     weight: validarPeso(p.weight.metric)
//                 }
//                 return perro
//             })
            
//             const perrosDB = (await Dog.findAll({
//                 where:{name: {[Op.iLike]: `%${name}%`}},
//                 include: {
//                     model: Temperamento,
//                     attributes: ["name"],
//                     through: { attributes: [] },
//             }})).map(p=>{
//                 return {
//                     id: p.id,
//                     image: p.image,
//                     name: p.name, 
//                     weight: p.weight,
//                     Temperamento: p.temperamentos.map(t=> t.name).toString()                    
//                 }
//             })

            

//             res.json(perrosDB.concat(final));
//         } catch (error) {
//             res.status(404).send(error)
//         }
//     }
// })


// router.get('/:id', async (req, res) => {
//     let {id} = req.params;
//     if(id.length === 36){
//         try {
//             let searchDog = await Dog.findOne({
//                 attribute: ['name', 'weight', 'Temperamento', 'life_span', 'image'],
//                 where: {
//                     id: id,
//                 }, 
//                 include: {
//                     model: Temperamento,
//                     attributes:['name'],
//                     through: {attributes:[]},
//                 }
//             })
//             if(!searchDog) return res.status(404).send(`No existe el perro con el id "${id}"`)
//             let temps = searchDog.temperamentos.map(t => t.name)

//             let searchDogs = {
//                 id: searchDog.id,
//                 name: searchDog.name,
//                 weight: searchDog.weight,
//                 height: searchDog.height,
//                 life_span: searchDog.life_span,
//                 image: searchDog.image,
//                 Temperamento: temps.toString(),
//             }
//             return(searchDogs)
//         } catch (error) {
//             res.send(error)
//         }
//     } else {
//         try {
//             let dogs = await axios(URL_API);
//             let search = dogs.data.find(p => p.id == id)
//             if(!search) return send.status(201).send('El perro no está en lista')
//                 let resp = {
//                     id: search.id,
//                     image: search.image.url,
//                     name: search.name,
//                     Temperamento: search.Temperamento,
//                     height: search.height.metric,
//                     weight: validarPeso(search.weight.metric),
//                     life_span: searchDog.life_span,


//                 }
            
//             return res.json(resp)
//         } catch (error) {
//             return res.status(404).send('Hubo un error')
//         }
//     }
// })
module.exports = router;