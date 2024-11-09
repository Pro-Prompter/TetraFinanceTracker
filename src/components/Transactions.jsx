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
import { storage, ID } from '../lib/appwrite';

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
    InvoiceId: null,
  });
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [invoiceFileName, setInvoiceFileName] = useState("");

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleShow = async (mode, transaction = {}) => {
    setModalMode(mode);
    if (mode === "edit" && transaction) {
      setCurrentTransaction({
        ...transaction,
        Date: format(parseISO(transaction.Date), "yyyy-MM-dd"),
      });
      setInvoiceFile(null);
      setInvoiceFileName("");

      if (transaction.InvoiceId) {
        try {
          const file = await storage.getFile('672078b60026aca47d2b', transaction.InvoiceId);
          setInvoiceFileName(file.name);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    } else {
      setCurrentTransaction({
        Date: "",
        Amount: "",
        Type: "",
        Comments: "",
        Currency: "USD",
        Status: "",
        InvoiceId: null,
      });
      setInvoiceFileName("");
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
      Status: "",
      InvoiceId: null,
    });
  };

  const uploadInvoice = async () => {
    if (!invoiceFile) {
      return null;
    }

    try {
      const response = await storage.createFile('672078b60026aca47d2b', ID.unique(), invoiceFile);
      return response.$id;
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was a problem uploading the invoice.",
        icon: "error",
      });
      return null;
    }
  };

  const handleSave = async () => {
    const invoiceId = await uploadInvoice();
    const transactionData = {
      Date: format(new Date(currentTransaction.Date), "yyyy-MM-dd"),
      Amount: parseFloat(currentTransaction.Amount.replace(/[^0-9.-]+/g, "") || 0).toFixed(2),
      Type: currentTransaction.Type,
      Comments: currentTransaction.Comments,
      Currency: currentTransaction.Currency,
      Status: currentTransaction.Status,
      InvoiceId: invoiceId || null,
    };

    try {
      if (modalMode === "add") {
        await dispatch(addTransaction(transactionData));
      } else if (modalMode === "edit") {
        await dispatch(updateTransaction({ ...transactionData, $id: currentTransaction.$id }));
      }
      handleClose();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was a problem saving the transaction.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (id, invoiceId) => {
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
        if (invoiceId) {
          await storage.deleteFile('672078b60026aca47d2b', invoiceId);
        }
        await dispatch(deleteTransaction(id));
        await Swal.fire({
          title: "Deleted!",
          text: "Transaction has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was a problem deleting the transaction.",
        icon: "error",
      });
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    filterStatus === "All" ? true : transaction.Status === filterStatus
  );

  return (
    <div>
      <h1>Transactions</h1>
      <div className="d-flex align-items-center mb-3">
        <Button variant="primary" onClick={() => handleShow("add")} className="my-4">
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
            <th>Amount (PKR)</th>
            <th>Type</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Invoice</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" ? (
            <tr>
              <td colSpan="8" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          ) : status === "failed" ? (
            <tr>
              <td colSpan="8" className="text-center">
                Error: {error}
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <tr key={transaction.$id}>
                <td>{index + 1}</td>
                <td>{format(parseISO(transaction.Date), "dd-MM-yyyy")}</td>
                <td>
                  PKR {parseFloat(transaction.Amount).toFixed(2)} {/* Display amount directly in PKR */}
                </td>
                <td>{transaction.Type}</td>
                <td>{transaction.Comments}</td>
                <td>{transaction.Status}</td>
                <td>
                  {transaction.InvoiceId ? (
                    <a
                      href={transaction.InvoiceId ? storage.getFilePreview('672078b60026aca47d2b', transaction.InvoiceId) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Invoice
                    </a>
                  ) : (
                    "No Invoice"
                  )}
                </td>
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
                    onClick={() => handleDelete(transaction.$id, transaction.InvoiceId)}
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

      {/* Modal for Add/Edit Transaction */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add Transaction" : "Edit Transaction"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={currentTransaction.Date}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                value={currentTransaction.Amount}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Amount: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Type}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formComments">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                type="text"
                value={currentTransaction.Comments}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Comments: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCurrency">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Currency}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="PKR">PKR</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={currentTransaction.Status}
                onChange={(e) => setCurrentTransaction({ ...currentTransaction, Status: e.target.value })}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formInvoice">
              <Form.Label>Invoice</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  setInvoiceFile(e.target.files[0]);
                  setInvoiceFileName(e.target.files[0].name);
                }}
              />
              {invoiceFileName && <p>Selected File: {invoiceFileName}</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalMode === "add" ? "Add Transaction" : "Update Transaction"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;