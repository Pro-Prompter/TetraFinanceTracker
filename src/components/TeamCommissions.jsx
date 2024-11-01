import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { fetchCommissions, addCommission, updateCommission, deleteCommission } from '../lib/redux/commissionsSlice';

const TeamCommissions = () => {
  const dispatch = useDispatch();
  const { commissions, status, error } = useSelector((state) => state.commissions);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCommission, setCurrentCommission] = useState({
    Project: "",
    Amount_Paid: "",
    Commission: "",
    Currency: "PKR",
  });
  const [exchangeRates, setExchangeRates] = useState({ PKR: 1 });
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    dispatch(fetchCommissions());
    fetchExchangeRates();
  }, [dispatch]);

  const fetchExchangeRates = async () => {
    const cachedRates = localStorage.getItem('exchangeRates');
    const cacheTimestamp = localStorage.getItem('exchangeRatesTimestamp');
    const cacheDuration = 24 * 3600000; // 24 hours in milliseconds

    if (cachedRates && cacheTimestamp && (Date.now() - cacheTimestamp < cacheDuration)) {
      setExchangeRates(JSON.parse(cachedRates));
      setLoadingRates(false);
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setExchangeRates(data.conversion_rates);
      localStorage.setItem('exchangeRates', JSON.stringify(data.conversion_rates));
      localStorage.setItem('exchangeRatesTimestamp', Date.now());
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoadingRates(false);
    }
  };

  const calculateCommission = (amountPaid, currency) => {
    const rate = exchangeRates[currency] || 1; // Default to 1 if currency not found
    const amountInPKR = parseFloat(amountPaid) * rate; // Convert to PKR
    const commissionValue = (amountInPKR * 0.15) / exchangeRates.PKR; // Calculate 15% commission in PKR and convert back
    return Math.round(commissionValue * 100) / 100; // Round to 2 decimal places
  };

  const formatCurrency = (value, currency) => {
    if (isNaN(value)) {
      return `${currency} 0.00`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleShow = (mode, commission = {}) => {
    setModalMode(mode);
    if (mode === "edit" && commission) {
      setCurrentCommission({ ...commission });
    } else {
      setCurrentCommission({
        Project: "",
        Amount_Paid: "",
        Commission: "",
        Currency: "PKR",
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentCommission({
      Project: "",
      Amount_Paid: "",
      Commission: "",
      Currency: "PKR",
    });
  };

  const handleSave = async () => {
    const amountPaid = parseFloat(currentCommission.Amount_Paid) || 0;
    const commissionValue = calculateCommission(amountPaid, currentCommission.Currency);

    const commissionData = {
      Project: currentCommission.Project,
      Amount_Paid: amountPaid.toFixed(2),
      Commission: commissionValue.toFixed(2),
      Currency: currentCommission.Currency,
    };

    try {
      if (modalMode === "add") {
        await dispatch(addCommission(commissionData));
      } else if (modalMode === "edit") {
        await dispatch(updateCommission({ ...commissionData, $id: currentCommission.$id }));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving commission:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem saving the commission.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await dispatch(deleteCommission(id));
        await Swal.fire({
          title: "Deleted!",
          text: "Commission has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting commission:", error);
    }
  };

  return (
    <div>
      <h1>Team Commissions</h1>
      <Button variant="primary" onClick={() => handleShow("add")} className="my-4">
        Add Commission
      </Button>
      {status === "loading" && <Spinner animation="border" />}
      {status === "failed" && <p>Error: {error}</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project</th>
            <th>Amount Paid</th>
            <th>Commission</th>
            <th>Grand Total</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission, index) => {
            const amountPaid = parseFloat(commission.Amount_Paid) || 0;
            const commissionValue = parseFloat(commission.Commission) || 0;
            const grandTotal = amountPaid - commissionValue;

            return (
              <tr key={commission.$id}>
                <td>{index + 1}</td>
                <td>{commission.Project || 'N/A'}</td>
                <td>{formatCurrency(amountPaid, commission.Currency)}</td>
                <td>{formatCurrency(commissionValue, commission.Currency)}</td>
                <td>{formatCurrency(grandTotal, commission.Currency)}</td>
                <td>{commission.Currency}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow("edit", commission)} className="mx-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(commission.$id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Add/Edit Commission Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Commission" : "Edit Commission"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProject">
              <Form.Label>Project</Form.Label>
              <Form.Control
                type="text"
                name="Project"
                value={currentCommission.Project}
                onChange={(e) =>
                  setCurrentCommission({ ...currentCommission, Project: e.target.value })
                }
                placeholder="Enter project"
              />
            </Form.Group>
            <Form.Group controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="Amount_Paid"
                value={currentCommission.Amount_Paid}
                onChange={(e) => {
                  const amountPaid = e.target.value;
                  setCurrentCommission({
                    ...currentCommission,
                    Amount_Paid: amountPaid,
                    Commission: calculateCommission(amountPaid, currentCommission.Currency).toFixed(2),
                  });
                }}
                placeholder="Enter amount paid"
              />
            </Form.Group>
            <Form.Group controlId="formCurrency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                value={currentCommission.Currency}
                onChange={(e) =>
                  setCurrentCommission({
                    ...currentCommission,
                    Currency: e.target.value,
                    Commission: calculateCommission(currentCommission.Amount_Paid, e.target.value).toFixed(2),
                  })
                }
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCommission">
              <Form.Label>Commission (15%)</Form.Label>
              <Form.Control
                type="text"
                name="Commission"
                value={formatCurrency(currentCommission.Commission, currentCommission.Currency)}
                readOnly
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSave} className="my-4">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeamCommissions;