import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/redux/authSlice';
import '../App.css'; // Import the CSS file

const Settings = () => {
  const { isAuthenticated, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User is not authorized");
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

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
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <Card className='shadow-lg p-4' style={{ maxWidth: '400px', width: '100%', marginTop: '50px' }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Settings</h2>
          {success && <Alert variant="success" className="text-center">{success}</Alert>}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Button 
            onClick={handleLogout} 
            variant="danger" 
            className="w-100 mt-3 btn-shine"
          >
            Logout
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;