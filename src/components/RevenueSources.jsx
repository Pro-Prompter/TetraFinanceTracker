import React from 'react';
import { Table } from 'react-bootstrap';

const RevenueSources = () => {
  return (
    <div>
      <h1>Revenue Sources</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Source</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Source A</td>
            <td>$5000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Source B</td>
            <td>$3000</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default RevenueSources;
