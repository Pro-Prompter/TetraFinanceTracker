import React from 'react';
import { Table } from 'react-bootstrap';

const TeamCommissions = () => {
  return (
    <div>
      <h1>Team Commissions</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Team Member</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Member A</td>
            <td>$500</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Member B</td>
            <td>$300</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default TeamCommissions;