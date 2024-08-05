import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, addClient, updateClient, deleteClient } from '../lib/redux/clientsSlice';

const Clients = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.clients);
  const status = useSelector((state) => state.clients.status);
  const error = useSelector((state) => state.clients.error);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', project: '', status: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, status]);

  const handleAddShow = () => setShowAddModal(true);
  const handleAddClose = () => setShowAddModal(false);

  const handleUpdateShow = (client) => {
    setCurrentClient(client);
    setFormData({ name: client.name, project: client.project, status: client.status });
    setShowUpdateModal(true);
  };
  const handleUpdateClose = () => setShowUpdateModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    dispatch(addClient(formData));
    handleAddClose();
  };

  const handleUpdateClient = () => {
    if (currentClient) {
      dispatch(updateClient({ ...currentClient, ...formData }));
      handleUpdateClose();
    }
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch(deleteClient(id));
    }
  };

  return (
    <div>
      <h1>Clients</h1>
      <Button variant="primary" onClick={handleAddShow}>
        Add Client
      </Button>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Project</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client.$id}>
              <td>{index + 1}</td>
              <td>{client.name}</td>
              <td>{client.project}</td>
              <td>{client.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateShow(client)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteClient(client.$id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Client Modal */}
      <Modal show={showAddModal} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formClientName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </Form.Group>
            <Form.Group controlId="formProject">
              <Form.Label>Project</Form.Label>
              <Form.Control
                type="text"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                placeholder="Enter project"
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="Enter payment status"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddClient}>
              Add Client
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Client Modal */}
      <Modal show={showUpdateModal} onHide={handleUpdateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formClientName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter client name"
              />
            </Form.Group>
            <Form.Group controlId="formProject">
              <Form.Label>Project</Form.Label>
              <Form.Control
                type="text"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                placeholder="Enter project"
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="Enter payment status"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateClient}>
              Update Client
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clients;