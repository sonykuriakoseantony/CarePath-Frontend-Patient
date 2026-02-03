import React, { useState } from 'react'
import { BiLock, BiUser } from 'react-icons/bi'
import { BsArrowLeft } from 'react-icons/bs'
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone, FaPhoneAlt } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { loginAPI, registerAPI } from '../services/allAPI'
import { useAuth } from '../context/AuthContext'
// import { GoogleLogin } from '@react-oauth/google'
// import { jwtDecode } from 'jwt-decode'

function UserAuth({ registerURL }) {

  const { setUser } = useAuth();

  const navigate = useNavigate();

  const [invalidUsername, setInvalidUsername] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidPassword, setInvalidPassword] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    passwordHash: ''
  })

  const validateInputs = (inputTag) => {

    const { name, value } = inputTag

    if (name == "name") {
      const usernameRegex = /^[a-zA-Z ]{3,16}$/;
      setUserDetails({ ...userDetails, name: value })
      if (!usernameRegex.test(value)) {
        setInvalidUsername(true);
      }
      else {
        setInvalidUsername(false);
      }
    }

    if (name == "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setUserDetails({ ...userDetails, email: value })
      if (!emailRegex.test(value)) {
        setInvalidEmail(true);
      }
      else {
        setInvalidEmail(false);
      }
    }

    if (name == "password") {
      const pswdRegex = /^.{6,6}$/
      setUserDetails({ ...userDetails, passwordHash: value })
      if (pswdRegex.test(value)) {
        setInvalidPassword(true);
      }
      else {
        setInvalidPassword(false);
      }
    }
    if (name == "phone") {
      const phoneRegex = /^.{10,10}$/
      setUserDetails({ ...userDetails, phone: value })
      if (phoneRegex.test(value)) {
        setInvalidPhone(true);
      }
      else {
        setInvalidPhone(false);
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, phone, passwordHash } = userDetails;

    if (name && email && phone && passwordHash) {
      console.log(name, email, phone, passwordHash);

      try {

        const result = await registerAPI(userDetails);
        console.log(result);

        //results in 200, 409, 500

        if (result.status == 200) {
          toast.success("Registered successfully !");
          setUserDetails({
            name: '',
            email: '',
            phone: '',
            passwordHash: ''
          })
          navigate('/login', {replace : true});
        }
        else if (result.status == 409) {
          toast.warning(res.response.data.message);
          setUserDetails({
            name: '',
            email: '',
            phone: '',
            passwordHash: ''
          })
          navigate('/login', {replace : true});
        }
        else {
          toast.error("Something went wrong. Please try again later !");
          setUserDetails({
            name: '',
            email: '',
            phone: '',
            passwordHash: ''
          })
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      toast.warning("Please fill all the details !")
    }

  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, passwordHash } = userDetails;

    if (email && passwordHash) {
      console.log(email, passwordHash);

      // console.log("Ready for API call !");
      try {

        const result = await loginAPI(userDetails);
        console.log(result);

        //results in 200, 401, 404, 500

        if (result.status == 200) {
           console.log("Logged in successfully !", result);
          toast.success("Logged in successfully !");
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("user", JSON.stringify(result.data.user));

          setUserDetails({
            email: '',
            passwordHash: ''
          })

          //Authorised user set in AuthContext
          // Update AuthContext user so protected routes see the change immediately
          setUser && setUser(result.data.user);

          setTimeout(() => {
    navigate("/dashboard", { replace: true });
  }, 2500);

        }
        else if (result.status == 401 || result.status == 404) {
          console.log("Icorrect creds ", result);
          toast.warning(result.response.data);
          setUserDetails({
            email: '',
            passwordHash: ''
          })
          // navigate('/');
        }
        else {
          toast.error("Something went wrong. Please try again later !");
          setUserDetails({
            email: '',
            passwordHash: ''
          })
          console.log(result);
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      toast.warning("Please fill all the details !")
    }
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <BsArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <button onClick={() => toast.success("TEST TOAST")}>
      Test Toast
    </button>
  
          {/* Card */}
          <div className="card-medical animate-scale-in">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-soft">
                <img src="/logo-image.png" alt="" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {registerURL ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {registerURL
                  ? 'Start your health journey with MedCare'
                  : 'Sign in to continue to your dashboard'}
              </p>
            </div>
  
            {/* Form */}
            <form className="space-y-4">
              {registerURL && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={(e) => validateInputs(e.target)}
                      placeholder="John Doe"
                      className="input-medical pl-11"
                      required={registerURL}
                    />
                  </div>
                </div>
              )}
  
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="email"
                    value={userDetails.email}
                    onChange={(e) => validateInputs(e.target)}
                    placeholder="you@example.com"
                    className="input-medical pl-11"
                    required
                  />
                </div>
              </div>

              {registerURL && (<div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="phone"
                    value={userDetails.phone}
                    onChange={(e) => validateInputs(e.target)}
                    placeholder="9876543210"
                    className="input-medical pl-11"
                    required
                  />
                </div>
              </div>)}
  
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <BiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={viewPassword ? 'text' : 'password'}
                    name="password"
                    value={userDetails.passwordHash}
                    onChange={(e) => validateInputs(e.target)}
                    placeholder="*******"
                    className="input-medical pl-11 pr-11"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setViewPassword(!viewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {viewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {registerURL && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>
  
              {registerURL ?
              (<button onClick={handleRegister}
                type="button"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : 'Create Account'}
              </button>)
              :
              (<button onClick={handleLogin}
                type="button"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) :'Login'
                }
              </button>)}
            </form>
  
            {/* Have an account or not */}
              <div className="my-5 text-center">
                {
                  registerURL ?
                    <p className="text-muted-foreground">Already have an account?  <Link className="text-primary ms-5 font-medium hover:underline" to={'/login'}>Login</Link></p>
                    :
                    <p className="text-muted-foreground">Are you a New User? <Link className="text-primary ms-5 font-medium hover:underline" to={'/register'}>Register</Link></p>
                }
              </div>
          </div>
  
          {/* Security Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme='colored' />
    </>
    
  )
}

export default UserAuth