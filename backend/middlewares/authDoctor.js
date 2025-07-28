// import jwt from 'jsonwebtoken'

// const authDoctor = async (req, res, next) => {
//     try {
        
//         const {dtoken} = req.headers
//         if(!dtoken) {
//             return res.json({success:false, message:'Not Authorized, Please login again'})
//         }

//         const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET) 
//         // req.body = { userId: token_decode.id }
//         req.docId = token_decode.id 
//         next()

//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

// export default authDoctor



import jwt from 'jsonwebtoken';

const authDoctor = (req, res, next) => {
  try {
    const token = req.headers.dtoken
    if (!token) return res.json({ success: false, message: 'Not Authorized, Please login again' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.doctorId = decoded.id
    next()
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message }) 
  }
};

export default authDoctor;
