import React from 'react';
import { Table } from 'react-bootstrap';

const Reports = () => {
  return (
    <div>
      <h1>Reports</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Report Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Report A</td>
            <td>01/10/2024</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Report B</td>
            <td>02/10/2024</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Reports;
