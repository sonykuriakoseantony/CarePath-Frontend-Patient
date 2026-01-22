import React from 'react'
import { FaRegHeart } from 'react-icons/fa'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

function Header() {

  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // call logout from Auth Context
    navigate('/');
  };

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-end group hover:bg-secondary pe-2 ps-1 py-1 transition-all duration-300 rounded-md cursor-pointer">
            {/* <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
              <FaRegHeart className="w-5 h-5 text-primary-foreground" />
            </div> */}
            <img src="/logo-image.png" alt="Care Path Logo" width={'45px'}/>
            <span className="text-2xl font-bold text-[#337659] transition-colors">
              CarePath
            </span>
            
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                title='Go to Dashboard'
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors  cursor-pointer"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-foreground font-semibold text-md hover:bg-secondary transition-colors flex items-center justify-center gap-1 border border-accent-foreground cursor-pointer"
                >
                  <FiUser />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary bg-primary text-sm cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
    </>
  )
}

export default Header

