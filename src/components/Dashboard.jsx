import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../lib/redux/transactionsSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Footer from './Footer';  // Import the Footer component

// Register the components needed for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state) => state.transactions);
  
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      const income = transactions.filter(t => t.Type === 'Income').reduce((acc, curr) => acc + parseFloat(curr.Amount), 0);
      const expenses = transactions.filter(t => t.Type === 'Expense').reduce((acc, curr) => acc + parseFloat(curr.Amount), 0);
      const pending = transactions.filter(t => t.Status === 'Pending').reduce((acc, curr) => acc + parseFloat(curr.Amount), 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setPendingPayments(pending);
    }
  }, [transactions, status]);

  const lineChartData = {
    labels: transactions.map(t => t.Date).reverse(),
    datasets: [
      {
        label: 'Income',
        data: transactions.filter(t => t.Type === 'Income').map(t => parseFloat(t.Amount)).reverse(),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true
      },
      {
        label: 'Expenses',
        data: transactions.filter(t => t.Type === 'Expense').map(t => parseFloat(t.Amount)).reverse(),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true
      }
    ]
  };

  const barChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Total Amount',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {status === 'loading' ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <Card.Body>
                    <Card.Title>Total Income</Card.Title>
                    <Card.Text>${totalIncome.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <Card.Body>
                    <Card.Title>Total Expenses</Card.Title>
                    <Card.Text>${totalExpenses.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <Card.Body>
                    <Card.Title>Pending Payments</Card.Title>
                    <Card.Text>${pendingPayments.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Income & Expenses Over Time</Card.Title>
                  <Line data={lineChartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Income vs Expenses</Card.Title>
                  <Bar data={barChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      <Footer />  {/* Add the Footer component */}
    </div>
  );
};

export default Dashboard;
