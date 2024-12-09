import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../services/axiosSetUp';
import './ScheduleEmail.css';
import { message } from 'antd';

const ScheduleEmail = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const cancel = ()=>{
    navigate('/home')
  }

  // Comprehensive datetime validation function
  const isValidFutureDateTime = (date, time) => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return false;
    }

    // Create Date object with Indian Standard Time (IST) offset
    const combinedDateTime = new Date(`${date}T${time}:00+05:30`);
    const currentDateTime = new Date();

    // Ensure the combined datetime is in the future
    return combinedDateTime > currentDateTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Add :00 to time if not already present
    const formattedTime = `${scheduledTime}:00`;

    // Validate date and time
    if (!isValidFutureDateTime(scheduledDate, scheduledTime)) {
      setError('Please select a valid future date and time in IST format.');
      return;
    }

    try {
      const data = {
        email,
        subject,
        content,
        scheduled_date: scheduledDate,
        scheduled_time: formattedTime,
      };

      const response = await axiosInstance.post('scheduler/schedule-email/', data);
      setSuccess(response.data.message);
      message.success("Your Email is Scheduled");
      navigate('/home');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
        message.error(err.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again later.');
        message.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="schedule-email-wrapper">
      <h2>Schedule an Email</h2>
      
      <form onSubmit={handleSubmit} className="schedule-email-form">
        <div className="schedule-email-field">
          <label htmlFor="email">Recipient Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            title="Please enter a valid email address"
          />
        </div>

        <div className="schedule-email-field">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div className="schedule-email-field">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
          />
        </div>

        <div className="schedule-email-field">
          <label htmlFor="scheduledDate">Scheduled Date (YYYY-MM-DD):</label>
          <input
            type="date"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
        </div>

        <div className="schedule-email-field">
          <label htmlFor="scheduledTime">Scheduled Time (HH:MM):</label>
          <input
            type="time"
            id="scheduledTime"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>

        {error && <div className="schedule-email-error">{error}</div>}
        {success && <div className="schedule-email-success">{success}</div>}

        <button type="submit" className="schedule-email-submit-btn">
          Schedule Email
        </button>
        <button onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ScheduleEmail;