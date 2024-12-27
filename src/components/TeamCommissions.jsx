import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  fetchCommissions,
  addCommission,
  updateCommission,
  deleteCommission,
} from "../lib/redux/commissionsSlice";
import { databases } from '../lib/appwrite'; // Appwrite SDK

// Default Commission State (now only Amount_Paid)
const getDefaultCommission = () => ({
  Amount_Paid: "",
  Currency: "PKR", // Default currency is PKR
  ProjectName: "",
});

const TeamCommissions = () => {
  const dispatch = useDispatch();
  const { commissions, status, error } = useSelector(
    (state) => state.commissions
  );

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCommission, setCurrentCommission] = useState(getDefaultCommission());
  const [projectNames, setProjectNames] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);  // To track project names loading state

  useEffect(() => {
    // Fetch commissions
    dispatch(fetchCommissions());

    // Fetch project names from the Transactions collection
    const fetchProjectNames = async () => {
      try {
        const response = await databases.listDocuments(
          '66ae058300333732f99a',
          '66b076ea0017936bd88b'
        );
        const names = response.documents.map((transaction) => transaction.ProjectName);
        if (names.length === 0) {
          Swal.fire({
            title: "No Projects Available",
            text: "There are no project names available for selection.",
            icon: "warning",
          });
        }
        setProjectNames(names);
      } catch (error) {
        console.error("Error fetching project names:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an issue fetching project names.",
          icon: "error",
        });
      } finally {
        setLoadingProjects(false);  // Mark as loaded
      }
    };

    fetchProjectNames();
  }, [dispatch]);

  const formatCurrency = (value, currency) => {
    if (isNaN(value)) {
      return `${currency} 0.00`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleShow = (mode, commission = {}) => {
    setModalMode(mode);
    if (mode === "edit" && commission) {
      setCurrentCommission({ ...commission });
    } else {
      setCurrentCommission(getDefaultCommission());
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentCommission(getDefaultCommission());
  };

  const handleSave = async () => {
    const amountPaid = parseFloat(currentCommission.Amount_Paid) || 0; // Ensures valid number or defaults to 0

    if (isNaN(amountPaid) || !currentCommission.ProjectName) {
      Swal.fire({
        title: "Error!",
        text: "Please make sure all fields are filled correctly.",
        icon: "error",
      });
      return;
    }

    const commissionData = {
      Amount_Paid: amountPaid.toFixed(2), // Ensure 2 decimal format
      Currency: currentCommission.Currency,
      ProjectName: currentCommission.ProjectName,
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
      <h1 className="text-center my-4 text-light">Team Commissions</h1>
      <Button
        variant="primary"
        onClick={() => handleShow("add")}
        className="my-4"
        disabled={status === "loading"}
      >
        <FaEdit className="me-2" />
        Add Commission
      </Button>

      {status === "loading" && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {status === "failed" && <p className="text-danger">Error: {error}</p>}

      <Table striped bordered hover className="shadow-sm">
        <thead className="bg-dark text-white">
          <tr>
            <th>#</th>
            <th>Amount Paid</th>
            <th>Currency</th>
            <th>Project Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission, index) => {
            const amountPaid = parseFloat(commission.Amount_Paid) || 0;

            return (
              <tr key={commission.$id}>
                <td>{index + 1}</td>
                <td>{formatCurrency(amountPaid, commission.Currency)}</td>
                <td>{commission.Currency}</td>
                <td>{commission.ProjectName || "N/A"}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleShow("edit", commission)}
                    className="mx-2"
                    title="Edit Commission"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(commission.$id)}
                    title="Delete Commission"
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Add/Edit Commission Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            {modalMode === "add" ? "Add Commission" : "Edit Commission"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                  })
                }
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                as="select"
                value={currentCommission.ProjectName}
                onChange={(e) =>
                  setCurrentCommission({
                    ...currentCommission,
                    ProjectName: e.target.value,
                  })
                }
                disabled={loadingProjects} // Disable dropdown if projects are loading
              >
                <option value="">Select Project</option>
                {loadingProjects ? (
                  <option disabled>Loading Projects...</option>
                ) : (
                  projectNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))
                )}
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSave}
              className="my-4"
              disabled={!currentCommission.Amount_Paid || !currentCommission.ProjectName}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeamCommissions;