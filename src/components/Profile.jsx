import React, { useEffect } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../lib/redux/profileSlice"; // Import the fetchProfile action

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile); // Use 'profile' from the Redux store

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (status === "failed") {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="pt">
      <Row className="mt-4">
        <Col md={12}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="profile-summary-card">
              <Card.Body>
                <Card.Title>Profile Summary</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {profile.Name || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Role:</strong> {profile.Role || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong> {profile.Status || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Username:</strong> {profile.User_Name || "N/A"}
                </Card.Text>
                {/* Add more profile details as needed */}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;