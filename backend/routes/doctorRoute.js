import express from 'express'
import { doctorList, loginDoctor } from '../controllers/doctorController.js'

const doctorsRouter = express.Router() 

doctorsRouter.get('/list', doctorList)
doctorsRouter.post('/login', loginDoctor) 

export default doctorsRouter 