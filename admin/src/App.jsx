import React, { useContext, lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AllAppointments = lazy(() => import('./pages/Admin/AllAppointments'))
const AddDoctor = lazy(() => import('./pages/Admin/AddDoctor'))
const DoctorsList = lazy(() => import('./pages/Admin/DoctorsList'))
const DoctorDashboard = lazy(() => import('./pages/Doctor/DoctorDashboard'))
const DoctorProfile = lazy(() => import('./pages/Doctor/DoctorProfile'))
const DoctorAppointments = lazy(() => import('./pages/Doctor/DoctorAppointments'))

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />

        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  ) : (
    <>
      <Suspense fallback={<div className="text-center py-10">Loading Login...</div>}>
        <Login />
      </Suspense>
      <ToastContainer />
    </>
  )
}

export default App