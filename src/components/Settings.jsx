import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout, checkAuth } from '../lib/redux/authSlice';

const Settings = () => {
  const { isAuthenticated, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(checkAuth())

  // }, [dispatch]);
  
  if (!isAuthenticated) {
    console.log("user is not authorized")
    navigate('/login'); // Redirect to login if not authenticated
  }


  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login'); // Redirect to login after logout
    } catch (err) {
      console.error('Logout failed:', err);
      // Handle logout failure (optional: show an alert or notification)
    }
  };

  return (
    <div className='pt'>
      <Card>
        <Card.Body>
          <h2>Settings</h2>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Button onClick={handleLogout}>Logout</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
