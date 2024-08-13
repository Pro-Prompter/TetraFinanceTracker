import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { databases } from '../lib/appwrite'; // Adjust import path as needed
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table support in jsPDF
import Footer from './Footer';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('daily'); // Default time period

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await databases.listDocuments('[66ae058300333732f99a]', '[66b2408a001a648204c5]');
      setTransactions(response.documents);
    } catch (error) {
      console.error('Error fetching data from Appwrite:', error);
    }
  };

  const filterData = () => {
    const now = new Date();
    const filteredData = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      if (timePeriod === 'daily') {
        return transactionDate.toDateString() === now.toDateString();
      } else if (timePeriod === 'weekly') {
        const startOfWeek = now.getDate() - now.getDay();
        const endOfWeek = startOfWeek + 6;
        return transactionDate >= new Date(now.setDate(startOfWeek)) &&
               transactionDate <= new Date(now.setDate(endOfWeek));
      } else if (timePeriod === 'monthly') {
        return transactionDate.getMonth() === now.getMonth() &&
               transactionDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
    setReportData(filteredData);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reports', 14, 16);

    const columns = ['#', 'Name', 'Amount', 'Date'];
    const rows = reportData.map((transaction, index) => [
      transaction.id,
      transaction.name,
      transaction.amount,
      transaction.date,
    ]);

    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
    });

    doc.save('TetraReport.pdf');
  };

  return (
    <div className='pt'>
      <h1>Reports</h1>
      <div className="mb-3">
        <Button onClick={() => setTimePeriod('daily')} className='btn btn-primary mx-2'>Daily</Button>
        <Button onClick={() => setTimePeriod('weekly')} className='btn btn-primary mx-2'>Weekly</Button>
        <Button onClick={() => setTimePeriod('monthly')} className='btn btn-primary mx-2'>Monthly</Button>
        <Button onClick={filterData} className='btn btn-primary mx-2'>Filter</Button>
        <Button onClick={generatePDF} className='btn btn-success mx-2'>Download PDF</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Report Name</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map(transaction => (
            <tr key={transaction.$id}>
              <td>{transaction.id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Reports;