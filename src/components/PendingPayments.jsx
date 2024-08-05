import React from 'react';
import { Table } from 'react-bootstrap';

const PendingPayments = () => {
  return (
    <div>
      <h1>Pending Payments</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Client A</td>
            <td>$2000</td>
            <td>01/10/2024</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default PendingPayments;
