import express from 'express'
import { doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorsRouter = express.Router() 

doctorsRouter.get('/list', doctorList)
doctorsRouter.post('/login', loginDoctor) 
doctorsRouter.get('/appointments', authDoctor, appointmentsDoctor) 
doctorsRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorsRouter.post('/cancel-appointment', authDoctor, appointmentCancel) 
doctorsRouter.get('/dashboard', authDoctor, doctorDashboard) 
doctorsRouter.get('/profile', authDoctor, doctorProfile)
doctorsRouter.post('/update-profile', authDoctor, updateDoctorProfile) 

export default doctorsRouter 