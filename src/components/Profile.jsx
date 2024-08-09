import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../lib/redux/profileSlice"; // Import the fetchProfile action
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Footer from "./Footer";
import "chartjs-plugin-autocolors"; // Import the plugin

// Register the components needed for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.profile); // Use 'profile' from the Redux store

  const [activityData, setActivityData] = useState([]);
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      // Mock data transformation; replace with actual data handling
      setActivityData(profile.activity || []);
      setSummaryData(profile.summary || {});
    }
  }, [profile, status]);

  // Define activity chart data
  const activityChartData = {
    labels: activityData.map((item) => item.date),
    datasets: [
      {
        label: "Activity",
        data: activityData.map((item) => item.value),
        borderColor: "#3F51B5",
        backgroundColor: "rgba(63, 81, 181, 0.2)", // Transparent blue
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  // Define summary bar chart data
  const summaryChartData = {
    labels: Object.keys(summaryData),
    datasets: [
      {
        label: "Summary",
        data: Object.values(summaryData),
        backgroundColor: "rgba(63, 81, 181, 0.2)", // Transparent blue
        borderColor: "#3F51B5", // Corresponding border color
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {status === "loading" ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
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
                      <strong>Name:</strong> {profile.name || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Email:</strong> {profile.email || "N/A"}
                    </Card.Text>
                    {/* Add more profile details as needed */}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Activity Over Time</Card.Title>
                  <Line data={activityChartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Summary</Card.Title>
                  <Bar data={summaryChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Profile;