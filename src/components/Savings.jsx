import React from 'react';
import { Card } from 'react-bootstrap';

const Savings = () => {
  return (
    <div>
      <h1>Savings</h1>
      <Card>
        <Card.Body>
          <Card.Title>Total Savings</Card.Title>
          <Card.Text>$3000</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Savings;
