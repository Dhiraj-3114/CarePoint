import validator from 'validator'
import bcrypt from 'bcrypt' 
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import Razorpay from 'razorpay'
import sendEmail from '../utils/sendEmail.js' 


const registerUser = async (req, res) => {
    try {
        
        const {name, email, password} = req.body

        if(!name || !email || !password) {
            return res.json({success: false, message: "Missing Details !!"})
        }

        if(!validator.isEmail(email)) {
            return res.json({success: false, message: "Invalid Email !!"})    
        }

        if(password.length < 8) {
            return res.json({success: false, message: "Invalid Password !!"})    
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, 
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save() 

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        await sendEmail({
            to: email,
            subject: 'Welcome to CarePoint',
            html: `
                <h2>Hello ${name},</h2>
                <p>Welcome to the CarePoint.</p>
                <p>Your account has been created successfully.</p>
                <p>Login and start booking appointments easily!</p>
            `
        })

        res.json({success: true, token}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// user login function

const loginUser = async (req, res) => {

    try {
        
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false, message:"User does not exist"})    
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch) {

            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

            await sendEmail({
                to: email,
                subject: 'Login Notification',
                html: `
                <h2>Login Successful</h2>
                <p>Hello <b>${user.name}</b>,</p>
                <p>You have successfully logged in to your CarePoint account.</p>
                <p>Thank you for using our service!</p>
                `
            })

            res.json({success: true, token}) 

        } else {
            res.json({success: false, message:"Invalid credentials"}) 
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})    
    }

}

// api to get user profile data

const getProfile = async (req, res) => {

    try {
        
        // const {userId} = req.body 
        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password') 

        res.json({success:true, userData}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})   
    }

}


const updateProfile = async (req, res) => {

    try {
        
        const userId = req.userId
        const {name, phone, address, dob, gender} = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
                return res.json({success: false, message: "Required data is missing !!"})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})

        //    if (typeof imageFile === 'string' && imageFile.startsWith('data:image')) {

        //         const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
        //         const imageURL = imageUpload.secure_url

        //         await userModel.findByIdAndUpdate(userId, {image: imageURL}) 

        //    }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})

            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

       res.json({success: true, message: "Profile Updated !!"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})    
    }

}

// api to book the appointment

const bookAppointment = async (req, res) => {

    try {
        
        const userId = req.userId
        const {docId, slotDate, slotTime} = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({success: false, message: 'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        if(slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success: false, message: 'Slot not available'})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save() 

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        await sendEmail({
            to: userData.email,
            subject: 'Appointment Booked Successfully',
            html: `
                <h2>Hello ${userData.name},</h2>
                <p>Your appointment with <b>${docData.name}</b> has been booked.</p>
                <p><strong>Date:</strong> ${slotDate}</p>
                <p><strong>Time:</strong> ${slotTime}</p>
                <p>Fees: ₹${docData.fees}</p>
                <p>Thank you for using our platform.</p> 
            `
        }) 

        res.json({success: true, message: 'Appointment Booked !!'})
         
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})  
    }

}

// api to get list of user's appointments

const listAppointment = async (req, res) => {

    try {

        const userId = req.userId
        const appointments = await appointmentModel.find({userId})

        res.json({success: true, appointments}) 
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})     
    }

}

const cancelAppointment = async (req, res) => {

    try {

        const userId = req.userId
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({success: false, message: 'Unauthorized Action !!'}) 
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        const userData = await userModel.findById(userId);
        await sendEmail({
            to: userData.email,
            subject: 'Appointment Cancelled',
            html: `
                <h2>Hello ${userData.name},</h2>
                <p>Your appointment with <b>${doctorData.name}</b> on <b>${slotDate}</b> at <b>${slotTime}</b> has been cancelled.</p>
                <p>If this was a mistake, please book a new appointment.</p>
            `
        })

        res.json({success: true, message: 'Appointment Cancelled !!'})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})   
    }

}

// payment of appointment using razorpay

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const paymentRazorpay = async (req, res) => {

    try {
        
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({success: false, message: 'Appointment Cancelled or Not Found'})
        }

        const options = {
            amount: appointmentData.amount * 100, 
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)

        res.json({success: true, order}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})    
    }

}

const verifyRazorpay = async (req, res) => {

    try {
        
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment: true}) 
            res.json({success: true, message: 'Payment Successful'})
        } else {
            res.json({success: false, message: 'Payment Failed'})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})     
    }

}

export {
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
}