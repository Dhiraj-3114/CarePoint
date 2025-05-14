import express from 'express'
import { doctorList } from '../controllers/doctorController.js'

const doctorsRouter = express.Router() 

doctorsRouter.get('/list', doctorList)

export default doctorsRouter 