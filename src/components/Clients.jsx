import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchClients, addClient, updateClient, deleteClient } from '../lib/redux/clientsSlice';
import Footer from './Footer';
import "../App.css"

const Clients = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.clients);
  const status = useSelector((state) => state.clients.status);
  const error = useSelector((state) => state.clients.error);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', project: '', status: '' });

  // Filter state
  const [filter, setFilter] = useState({
    clientName: '',
    companyName: '',
    project: '',
    paymentStatus: '',
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClients());
    }
  }, [dispatch, status]);

  const handleAddShow = () => {
    setFormData({ name: '', company: '', project: '', status: '' }); // Reset form data
    setShowAddModal(true);
  };

  const handleAddClose = () => setShowAddModal(false);

  const handleUpdateShow = (client) => {
    setCurrentClient(client);
    setFormData({ 
      name: client.Client_Name || '', 
      company: client.Company_Name || '', 
      project: client.Project_Name || '', 
      status: client.Payment_Status || '' 
    });
    setShowUpdateModal(true);
  };

  const handleUpdateClose = () => setShowUpdateModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = async () => {
    try {
      await dispatch(addClient(formData));
      Swal.fire({
        title: 'Success!',
        text: 'Client added successfully.',
        icon: 'success',
      });
      handleAddClose();
    } catch (error) {
      console.error('Error adding client:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the client.',
        icon: 'error',
      });
    }
  };

  const handleUpdateClient = async () => {
    if (currentClient) {
      try {
        await dispatch(updateClient({ ...currentClient, ...formData }));
        Swal.fire({
          title: 'Success!',
          text: 'Client updated successfully.',
          icon: 'success',
        });
        handleUpdateClose();
      } catch (error) {
        console.error('Error updating client:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem updating the client.',
          icon: 'error',
        });
      }
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await dispatch(deleteClient(id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Client has been deleted.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem deleting the client.',
        icon: 'error',
      });
    }
  };

  // Apply filters
  const filteredClients = clients.filter((client) => {
    return (
      (filter.clientName === '' || (client.Client_Name || '').toLowerCase().includes(filter.clientName.toLowerCase())) &&
      (filter.companyName === '' || (client.Company_Name || '').toLowerCase().includes(filter.companyName.toLowerCase())) &&
      (filter.project === '' || (client.Project_Name || '').toLowerCase().includes(filter.project.toLowerCase())) &&
      (filter.paymentStatus === '' || (client.Payment_Status || '').toLowerCase().includes(filter.paymentStatus.toLowerCase()))
    );
  });

  return (
    <div className='pt'>
      <h1>Clients</h1>
      <div className="d-flex flex-column mb-4">
        <Button variant="primary" onClick={handleAddShow} className='my-4'>
          Add Client
        </Button>
        <div className="d-flex flex-wrap mb-3">
          <Form.Group className="mr-3 mb-2" controlId="formFilterClientName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              name="clientName"
              value={filter.clientName}
              onChange={handleFilterChange}
              placeholder="Filter by client name"
            />
          </Form.Group>
          <Form.Group className="mr-3 mb-2" controlId="formFilterCompanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={filter.companyName}
              onChange={handleFilterChange}
              placeholder="Filter by company name"
            />
          </Form.Group>
          <Form.Group className="mr-3 mb-2" controlId="formFilterProject">
            <Form.Label>Project</Form.Label>
            <Form.Control
              type="text"
              name="project"
              value={filter.project}
              onChange={handleFilterChange}
              placeholder="Filter by project"
            />
          </Form.Group>
          <Form.Group className="mr-3 mb-2" controlId="formFilterStatus">
            <Form.Label>Payment Status</Form.Label>
            <Form.Control
              as="select"
              name="paymentStatus"
              value={filter.paymentStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </Form.Control>
          </Form.Group>
        </div>
      </div>
      {status === 'loading' && <Spinner animation="border" />}
      {status === 'failed' && <p>Error: {error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Company Name</th>
            <th>Project</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client, index) => (
            <tr key={client.$id}>
              <td>{index + 1}</td>
              <td>{client.Client_Name || 'N/A'}</td>
              <td>{client.Company_Name || 'N/A'}</td>
              <td>{client.Project_Name || 'N/A'}</td>
              <td>{client.Payment_Status || 'N/A'}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateShow(client)} className='mx-2'>
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
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
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
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select status...</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddClient} className='my-4'>
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
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter company name"
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
                as="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select status...</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className='my-4' onClick={handleUpdateClient}>
              Update Client
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clients;