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
    Currency: "USD",
    Status: "",
  });
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleShow = (mode, transaction = {}) => {
    setModalMode(mode);
    setCurrentTransaction(
      mode === "edit" && transaction
        ? { ...transaction }
        : {
            Date: "",
            Amount: "",
            Type: "",
            Comments: "",
            Currency: "USD",
            Status: "",
          }
    );
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
      Status: "",
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
      Status: currentTransaction.Status,
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

  const filteredTransactions = transactions.filter((transaction) =>
    filterStatus === "All" ? true : transaction.Status === filterStatus
  );

  return (
    <div>
      <h1>Transactions</h1>
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => handleShow("add")}
          className="my-4"
        >
          Add Transaction
        </Button>
        <Form.Group controlId="formFilterStatus" className="mb-0 mx-4">
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="sm"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </Form.Control>
        </Form.Group>
      </div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Comments</th>
            <th>Status</th>
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
                <td>{transaction.Status}</td>
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
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
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
                placeholder="Enter Comments"
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