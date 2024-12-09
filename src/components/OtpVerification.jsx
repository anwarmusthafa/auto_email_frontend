import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useSelector , useDispatch } from 'react-redux'; 
import { axiosInstance } from '../services/axiosSetUp'; 
import { clearUserId } from '../redux/slices/profileSlice';  
import './OTPVerification.css'; 
import {message} from 'antd'

const OTPVerification = () => { 
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();
  const dispatch = useDispatch() 

  const userId = useSelector((state) => state.profile.userId);// Get userId (uuid) from Redux store 

  const handleChange = (value, index) => { 
    const newOtp = [...otp]; 
    newOtp[index] = value; 

    // Move to the next input if a value is entered 
    if (value !== '' && index < 5) { 
      document.getElementById(`otp-input-${index + 1}`).focus(); 
    } 

    // Move back to the previous input if the user deletes a value 
    if (value === '' && index > 0) { 
      document.getElementById(`otp-input-${index - 1}`).focus(); 
    } 

    setOtp(newOtp); 
    setError(null); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 

    const otpValue = otp.join(''); // Combine OTP digits into a single string 
    if (otpValue.length < 6) { 
      setError('Please enter a complete OTP.'); 
      return; 
    } 

    try { 
      setLoading(true);
      console.log("uuid",userId);
      const response = await axiosInstance.post('/accounts/verify-otp/', { 
        uuid: userId, // Use the userId (uuid) from Redux store 
        otp: otpValue, 
      }); 

      if (response.status === 200) { 
        dispatch(clearUserId()); 
        localStorage.removeItem('persist:root');
        message.success("Otp is Verified, Please Login Now")
        navigate('/login');
      } 
    } catch (error) { 
      if (error.response?.data?.error) { 
        setError(error.response.data.error); 
      } else { 
        console.log("error",error);
        
        setError('Verification failed. Please try again.'); 
      } 
    } finally { 
      setLoading(false); 
    } 
  }; 

  return ( 
    <div className="otp-verification-container">
      <h2>Verify Your OTP</h2>
      <p>Please enter the OTP sent to your email.</p>
      <form onSubmit={handleSubmit} className="otp-form">
        <div className="gop-auth-otp-inputs">
          {otp.map((digit, index) => ( 
            <input 
              key={index} 
              type="text" 
              value={digit} 
              onChange={(e) => handleChange(e.target.value, index)} 
              id={`otp-input-${index}`} 
              className={`gop-auth-input ${error ? 'gop-auth-input-error' : ''}`} 
              maxLength="1" 
            /> 
          ))} 
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  ); 
}; 

export default OTPVerification;