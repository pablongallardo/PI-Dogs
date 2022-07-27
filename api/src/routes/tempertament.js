require('dotenv').config();
const { Router } = require ('express');
const router = Router();
const axios = require('axios');

const { Temperamento} =require('../db.js')

const {
    URL_API
} = process.env;


router.get("/", async (req, res, next) => {
    try{
        const db = await Temperamento.findAll()
        return res.json(db).status(200)
    } catch (e) {
        return res.json(e.message).status(409)
    }
})

// router.get('/', async (req, res) => { // hecha!!!
//     try {
//         const hayDatos = await Temperamento.findAll()
//         if (!hayDatos.length) {
//             const perros = await axios(URL_API)
//             const tempApi = perros.data.map((p) => p.temperament ? p.temperament : '').map(s => s?.split(', ')).flat()
//             const result = tempApi.reduce((acc, item) => {
//                 if (!acc.includes(item) && item !== '') {
//                     acc.push(item);
//                 }
//                 return acc;
//             }, [])
            
//             let datos = result.map(c => {
//                 let dato = { name: c }
//                 return dato
//             })
//             await Temperamento.bulkCreate(datos)
//         }
//         return res.json(await Temperamento.findAll())
//     } catch (error) {
//         res.status(404).send(error)
//     }
// })

module.exports = router;
