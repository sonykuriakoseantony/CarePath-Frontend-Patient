import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserAuth from './pages/UserAuth'
import Dashboard from './pages/Dashboard'
import PageNotFound from './pages/PageNotFound'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<UserAuth />} />
        <Route path='/register' element={<UserAuth registerURL={true} />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
