import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../lib/redux/transactionsSlice";
import { BiMoney, BiTrendingUp, BiTrendingDown } from "react-icons/bi";
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
import "chartjs-plugin-autocolors";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state) => state.transactions);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      const income = transactions
        .filter((t) => t.Type === "Income")
        .reduce((acc, curr) => acc + parseFloat(curr.Amount), 0);
      const expenses = transactions
        .filter((t) => t.Type === "Expense")
        .reduce((acc, curr) => acc + parseFloat(curr.Amount), 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);
    }
  }, [transactions, status]);

  const lineChartData = {
    labels: transactions.map((t) => t.Date).reverse(),
    datasets: [
      {
        label: "Income",
        data: transactions
          .filter((t) => t.Type === "Income")
          .map((t) => parseFloat(t.Amount))
          .reverse(),
        borderColor: "#00C853",
        backgroundColor: "rgba(0, 200, 83, 0.2)",
        borderWidth: 1,
        fill: true,
      },
      {
        label: "Expenses",
        data: transactions
          .filter((t) => t.Type === "Expense")
          .map((t) => parseFloat(t.Amount))
          .reverse(),
        borderColor: "#D50032",
        backgroundColor: "rgba(213, 0, 50, 0.2)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Total Amount",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["rgba(0, 200, 83, 0.2)", "rgba(213, 0, 50, 0.2)"],
        borderColor: ["#00C853", "#D50032"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="pt bg-white">
      {status === "loading" ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="mt-4">
            <Col md={3}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="income-card">
                  <Card.Body>
                    <Card.Title>
                      <BiTrendingUp /> Total Income
                    </Card.Title>
                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      PKR {totalIncome.toFixed(2)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div className="empty-space"></div>
            </Col>
            <Col md={3}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="expenses-card">
                  <Card.Body>
                    <Card.Title>
                      <BiTrendingDown /> Total Expenses
                    </Card.Title>
                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      PKR {totalExpenses.toFixed(2)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <BiMoney /> Income & Expenses Over Time
                  </Card.Title>
                  <Line data={lineChartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <BiMoney /> Income vs Expenses
                  </Card.Title>
                  <Bar data={barChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;