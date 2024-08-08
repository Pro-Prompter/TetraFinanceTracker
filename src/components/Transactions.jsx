import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../lib/redux/transactionsSlice";
import Footer from "./Footer";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, status, error } = useSelector(
    (state) => state.transactions
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentTransaction, setCurrentTransaction] = useState({
    Date: "",
    Amount: "",
    Type: "",
    Comments: "",
    Currency: "PKR",
    Status: "", // Add status field
  });
  const [filterStatus, setFilterStatus] = useState("All"); // Filter state

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleShow = (mode, transaction = {}) => {
    setModalMode(mode);
    if (mode === "edit" && transaction) {
      setCurrentTransaction({ ...transaction });
    } else {
      setCurrentTransaction({
        Date: "",
        Amount: "",
        Type: "",
        Comments: "",
        Currency: "USD",
        Status: "", // Reset status
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentTransaction({
      Date: "",
      Amount: "",
      Type: "",
      Comments: "",
      Currency: "USD",
      Status: "", // Reset status
    });
  };

  const handleSave = async () => {
    const transactionData = {
      Date: format(new Date(currentTransaction.Date), "yyyy-MM-dd"),
      Amount: parseFloat(
        currentTransaction.Amount.replace(/[^0-9.-]+/g, "")
      ).toFixed(2),
      Type: currentTransaction.Type,
      Comments: currentTransaction.Comments,
      Currency: currentTransaction.Currency,
      Status: currentTransaction.Status, // Include status
    };

    try {
      if (modalMode === "add") {
        await dispatch(addTransaction(transactionData));
      } else if (modalMode === "edit") {
        await dispatch(
          updateTransaction({ ...transactionData, $id: currentTransaction.$id })
        );
      }
      handleClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem saving the transaction.",
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
        await dispatch(deleteTransaction(id));
        await Swal.fire({
          title: "Deleted!",
          text: "Transaction has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Filter transactions based on selected status
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterStatus === "All") return true;
    return transaction.Status === filterStatus;
  });

  return (
    <div>
      <h1>Transactions</h1>
      <div className="mb-3">
        <Form.Group controlId="formFilterStatus">
          <Form.Label>Filter by Status</Form.Label>
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={() => handleShow("add")} className="my-4">
          Add Transaction
        </Button>
      </div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Comments</th>
            <th>Status</th> {/* Add Status column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" ? (
            <tr>
              <td colSpan="7" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          ) : status === "failed" ? (
            <tr>
              <td colSpan="7" className="text-center">
                Error: {error}
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <tr key={transaction.$id}>
                <td>{index + 1}</td>
                <td>{format(parseISO(transaction.Date), "dd-MM-yyyy")}</td>
                <td>
                  {transaction.Currency}{" "}
                  {parseFloat(transaction.Amount).toFixed(2)}
                </td>
                <td>{transaction.Type}</td>
                <td>{transaction.Comments}</td>
                <td>{transaction.Status}</td> {/* Add Status */}
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleShow("edit", transaction)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(transaction.$id)}
                    className="mx-3"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
          <Footer />
      {/* Modal for Add/Edit Transaction */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Transaction" : "Edit Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentTransaction.Date}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Date: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter Amount"
                value={currentTransaction.Amount}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Amount: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Type}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Type: e.target.value,
                  })
                }
              >
                <option value="">Select Type</option>
                {["Income", "Expense"].map((Type) => (
                  <option key={Type} value={Type}>
                    {Type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCurrency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Currency}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Currency: e.target.value,
                  })
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PKR">PKR</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Status}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Status: e.target.value,
                  })
                }
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formComments">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter comments"
                value={currentTransaction.Comments}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    Comments: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;