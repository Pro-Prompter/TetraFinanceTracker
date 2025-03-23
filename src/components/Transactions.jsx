import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";
import {
  FaEdit,
  FaTrashAlt,
  FaPlusSquare,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import { AiFillCloseCircle, AiFillSave } from "react-icons/ai";
import {
  fetchTransactions,
  fetchAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  resetPagination,
} from "../lib/redux/transactionsSlice";
import { storage, ID } from "../lib/appwrite";

const Transactions = () => {
  const dispatch = useDispatch();
  const {
    documents: transactions,
    nextCursor,
    prevCursor,
    status,
    error,
    allTransactions,
  } = useSelector((state) => state.transactions);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsCountStart, setItemsCountStart] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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
    ClientName: "",
    CompanyName: "",
    ProjectName: "",
    ProjectStartDate: "",
    ProjectEndDate: "",
    RevisionsAmount: 0,
    Discount: 0,
  });
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceFileName, setInvoiceFileName] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");

  useEffect(() => {
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  // Fetch all transactions when component mounts
  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (!prevCursor) {
      setItemsCountStart(1);
      setCurrentPage(1);
    }
  }, [prevCursor]);

  const handleNextPage = () => {
    if (nextCursor) {
      dispatch(
        fetchTransactions({
          cursor: nextCursor,
          direction: "next",
        })
      );
      setItemsCountStart((prev) => prev + ITEMS_PER_PAGE);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      dispatch(
        fetchTransactions({
          cursor: prevCursor,
          direction: "prev",
        })
      );
      setItemsCountStart((prev) => Math.max(1, prev - ITEMS_PER_PAGE));
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleShow = async (mode, transaction = {}) => {
    if (mode === "edit" && transaction) {
      const result = await Swal.fire({
        title: "Do you want to edit this transaction?",
        text: "Make sure the details are correct before proceeding.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, edit it",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      setModalMode("edit");
      const formattedTransaction = {
        ...transaction,
        Date: format(parseISO(transaction.Date), "yyyy-MM-dd"),
        ProjectStartDate: transaction.ProjectStartDate
          ? format(parseISO(transaction.ProjectStartDate), "yyyy-MM-dd")
          : "",
        ProjectEndDate: transaction.ProjectEndDate
          ? format(parseISO(transaction.ProjectEndDate), "yyyy-MM-dd")
          : "",
      };
      setCurrentTransaction(formattedTransaction);
      setInvoiceFileName(transaction.InvoiceId ? "Existing File" : "");
      setReceiptFileName(transaction.ReceiptId ? "Existing File" : "");
    } else {
      setFilterStatus("All");
      setFilterType("All");
      resetTransaction();
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetTransaction();
  };

  const resetTransaction = () => {
    setCurrentTransaction({
      Date: new Date().toISOString().split("T")[0],
      Amount: "",
      Type: "",
      Comments: "",
      Currency: "USD",
      Status: "",
      InvoiceId: null,
      ClientName: "",
      CompanyName: "",
      ProjectName: "",
      ProjectStartDate: "",
      ProjectEndDate: "",
      RevisionsAmount: 0,
      Discount: 0,
    });
    setInvoiceFileName("");
    setReceiptFileName("");
  };

  const uploadInvoice = async () => {
    if (!invoiceFile) return null;
    try {
      const response = await storage.createFile(
        "672078b60026aca47d2b",
        ID.unique(),
        invoiceFile
      );
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

  const uploadReceipt = async () => {
    if (!receiptFile) return null;
    try {
      const response = await storage.createFile(
        "675d9f9000011543ff7b",
        ID.unique(),
        receiptFile
      );
      return response.$id;
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was a problem uploading the receipt.",
        icon: "error",
      });
      return null;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (
      !currentTransaction.Date ||
      !currentTransaction.Amount ||
      !currentTransaction.Type ||
      !currentTransaction.ClientName ||
      !currentTransaction.Status
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const isoDate = format(parseISO(currentTransaction.Date), "yyyy-MM-dd");
      const isoProjectStartDate = currentTransaction.ProjectStartDate
        ? format(parseISO(currentTransaction.ProjectStartDate), "yyyy-MM-dd")
        : null;
      const isoProjectEndDate = currentTransaction.ProjectEndDate
        ? format(parseISO(currentTransaction.ProjectEndDate), "yyyy-MM-dd")
        : null;

      let invoiceId = currentTransaction.InvoiceId;
      let receiptId = currentTransaction.ReceiptId;

      if (invoiceFile) {
        const invoiceResponse = await uploadInvoice();
        invoiceId = invoiceResponse || invoiceId;
      }

      if (receiptFile) {
        const receiptResponse = await uploadReceipt();
        receiptId = receiptResponse || receiptId;
      }

      const transactionData = {
        Date: isoDate,
        Amount: currentTransaction.Amount.toString(),
        Type: currentTransaction.Type,
        Comments: currentTransaction.Comments,
        Currency: currentTransaction.Currency,
        Status: currentTransaction.Status,
        InvoiceId: invoiceId,
        ReceiptId: receiptId,
        ClientName: currentTransaction.ClientName,
        CompanyName: currentTransaction.CompanyName,
        ProjectName: currentTransaction.ProjectName,
        ProjectStartDate: isoProjectStartDate,
        ProjectEndDate: isoProjectEndDate,
        RevisionsAmount: currentTransaction.RevisionsAmount.toString(),
        Discount: currentTransaction.Discount.toString(),
      };

      if (modalMode === "add") {
        await dispatch(addTransaction(transactionData));
        dispatch(resetPagination());
        dispatch(fetchTransactions({}));
        // Refresh all transactions as well
        dispatch(fetchAllTransactions());
        setItemsCountStart(1);
        setCurrentPage(1);
        Swal.fire({
          title: "Success!",
          text: "Transaction added successfully.",
          icon: "success",
        });
      } else if (modalMode === "edit") {
        await dispatch(
          updateTransaction({ ...transactionData, $id: currentTransaction.$id })
        );
        dispatch(fetchTransactions({}));
        // Refresh all transactions as well
        dispatch(fetchAllTransactions());
        Swal.fire({
          title: "Success!",
          text: "Transaction updated successfully.",
          icon: "success",
        });
      }

      handleClose();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `There was a problem saving the transaction: ${error.message}`,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id, invoiceId, receiptId) => {
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
          await storage.deleteFile("672078b60026aca47d2b", invoiceId);
        }

        if (receiptId) {
          await storage.deleteFile("675d9f9000011543ff7b", receiptId);
        }
        await dispatch(deleteTransaction(id));
        // Refresh all transactions after deletion
        await dispatch(fetchAllTransactions());
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Toggle search mode based on whether there's a search query
    setIsSearching(value !== "");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  // Determine which data source to use based on search state
  const dataSource = isSearching ? allTransactions : transactions;

  // Filter the appropriate data source
  const filteredTransactions =
    dataSource?.filter(
      (transaction) =>
        (filterStatus === "All" || transaction.Status === filterStatus) &&
        (filterType === "All" || transaction.Type === filterType) &&
        (searchQuery === "" ||
          transaction.ClientName?.toLowerCase().includes(
            searchQuery.toLowerCase()
          ))
    ) || [];

  // Calculate the total number of pages if using search mode
  const totalPages = isSearching 
    ? Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) 
    : null;

  // For search mode, calculate which items to display based on current page
  const paginatedSearchResults = isSearching
    ? filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : filteredTransactions;

  // Calculate correct serial numbers based on pagination
  const getSerialNumber = (index) => {
    if (isSearching) {
      return (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
    } else {
      return itemsCountStart + index;
    }
  };

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="d-flex flex-wrap align-items-center mb-3">
        <Button
          variant="primary"
          onClick={() => handleShow("add")}
          className="my-2 me-2"
        >
          <FaPlusSquare /> Add Transaction
        </Button>

        {/* Search Bar */}
        <InputGroup className="my-2 me-2" style={{ maxWidth: "300px" }}>
          <Form.Control
            placeholder="Search by client name"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search clients"
          />
          <InputGroup.Text>
            {searchQuery ? (
              <Button
                variant="link"
                className="p-0"
                onClick={handleClearSearch}
                style={{ color: "grey" }}
              >
                <AiFillCloseCircle />
              </Button>
            ) : (
              <FaSearch />
            )}
          </InputGroup.Text>
        </InputGroup>

        {/* Status Filter */}
        <Form.Group controlId="formFilterStatus" className="my-2 me-2">
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </Form.Control>
        </Form.Group>

        {/* Type Filter */}
        <Form.Group controlId="formFilterType" className="my-2">
          <Form.Control
            as="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="sm"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </Form.Control>
        </Form.Group>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-3">
          Found {filteredTransactions.length} transaction(s) for "{searchQuery}"
        </div>
      )}

      <Table striped bordered hover responsive className="mt-3 table">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Date</th>
            <th className="text-right">Amount</th>
            <th>Client</th>
            <th>Project Name</th>
            <th className="text-center">Company Name</th>
            <th className="text-center">Project Dates</th>
            <th className="text-right">Discount</th>
            <th>Invoice</th>
            <th>Receipt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" && !isSearching ? (
            <tr>
              <td colSpan="11" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          ) : status === "failed" && !isSearching ? (
            <tr>
              <td colSpan="11" className="text-center">
                Error: {error}
              </td>
            </tr>
          ) : filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center">
                No transactions found
              </td>
            </tr>
          ) : (
            // Display paginated results when searching, otherwise show all filtered transactions
            (isSearching ? paginatedSearchResults : filteredTransactions).map((transaction, index) => (
              <tr key={transaction.$id}>
                <td>{getSerialNumber(index)}</td>
                <td>{format(parseISO(transaction.Date), "dd-MM-yyyy")}</td>
                <td className="text-right">
                  PKR {parseFloat(transaction.Amount).toFixed(2)}
                </td>
                <td>{transaction.ClientName || "N/A"}</td>
                <td>{transaction.ProjectName || "N/A"}</td>
                <td>{transaction.CompanyName || "N/A"}</td>
                <td className="text-center">
                  {transaction.ProjectStartDate ? (
                    <>
                      {format(
                        parseISO(transaction.ProjectStartDate),
                        "dd/MM/yyyy"
                      )}{" "}
                      -{" "}
                      {transaction.ProjectEndDate
                        ? format(
                            parseISO(transaction.ProjectEndDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="text-right">
                  {transaction.Discount ? transaction.Discount : "N/A"}
                </td>
                <td>
                  {transaction.InvoiceId ? (
                    <a
                      href={storage.getFilePreview(
                        "672078b60026aca47d2b",
                        transaction.InvoiceId
                      )}
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
                  {transaction.ReceiptId ? (
                    <a
                      href={storage.getFilePreview(
                        "675d9f9000011543ff7b",
                        transaction.ReceiptId
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Receipt
                    </a>
                  ) : (
                    "No Receipt"
                  )}
                </td>
                <td>
                  <div className="d-flex justify-content-start">
                    <Button
                      variant="warning"
                      onClick={() => handleShow("edit", transaction)}
                      style={{ marginRight: "10px" }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDelete(
                          transaction.$id,
                          transaction.InvoiceId,
                          transaction.ReceiptId
                        )
                      }
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination controls - different for search vs. normal mode */}
      <div className="d-flex justify-content-between mt-4">
        {isSearching ? (
          /* Search mode pagination */
          <>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || status === "loading"}
              className="d-flex align-items-center"
            >
              <FaArrowLeft />
            </Button>

            <div className="text-muted d-flex align-items-center">
              Page {currentPage} of {totalPages || 1}
              {" | "}
              Showing {Math.min(filteredTransactions.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)} 
              {" - "}
              {Math.min(filteredTransactions.length, currentPage * ITEMS_PER_PAGE)}
              {" of "}
              {filteredTransactions.length} transactions
            </div>

            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
              disabled={currentPage >= totalPages || status === "loading"}
              className="d-flex align-items-center"
            >
              <FaArrowRight />
            </Button>
          </>
        ) : (
          /* Normal mode pagination (using cursors) */
          <>
            <Button
              variant="outline-primary"
              onClick={handlePrevPage}
              disabled={!prevCursor || status === "loading"}
              className="d-flex align-items-center"
            >
              <FaArrowLeft />
            </Button>

            <div className="text-muted d-flex align-items-center">
              Page {currentPage} | Showing {transactions.length ? itemsCountStart : 0} 
              {" - "}
              {itemsCountStart + transactions.length - 1}
            </div>

            <Button
              variant="outline-primary"
              onClick={handleNextPage}
              disabled={!nextCursor || status === "loading"}
              className="d-flex align-items-center"
            >
              <FaArrowRight />
            </Button>
          </>
        )}
      </div>
      <div className="mb-4"></div>
      
      {/* Modal for Add/Edit Transaction */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Transaction" : "Edit Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={currentTransaction.Date || ""}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        Date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    placeholder="Enter Amount"
                    type="text"
                    value={currentTransaction.Amount}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        Amount: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
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
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-md-6">
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
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="PKR">PKR</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formClientName">
                  <Form.Label>Client Name</Form.Label>
                  <Form.Control
                    placeholder="Enter Client Name"
                    type="text"
                    value={currentTransaction.ClientName}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        ClientName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formCompanyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    placeholder="Enter Company Name"
                    type="text"
                    value={currentTransaction.CompanyName}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        CompanyName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formProjectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    placeholder="Enter Project Name"
                    type="text"
                    value={currentTransaction.ProjectName}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        ProjectName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formRevisionsAmount">
                  <Form.Label>Revisions Amount</Form.Label>
                  <Form.Control
                    placeholder="Enter Revisions Amount"
                    type="number"
                    value={currentTransaction.RevisionsAmount || ""}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        RevisionsAmount: e.target.value || "", // Handle empty value
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formDiscount">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    placeholder="Enter Discount"
                    type="number"
                    value={currentTransaction.Discount || ""}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        Discount: e.target.value || "", // Handle empty value
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
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
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formProjectStartDate">
                  <Form.Label>Project Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={currentTransaction.ProjectStartDate || ""}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        ProjectStartDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formProjectEndDate">
                  <Form.Label>Project End Date</Form.Label>

                  <Form.Control
                    type="date"
                    value={currentTransaction.ProjectEndDate || ""}
                    onChange={(e) =>
                      setCurrentTransaction({
                        ...currentTransaction,
                        ProjectEndDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Group controlId="formInvoice">
                  <Form.Label>Invoice</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      setInvoiceFile(e.target.files[0]);
                      setInvoiceFileName(e.target.files[0].name);
                    }}
                  />
                  {invoiceFileName && <p>Selected file: {invoiceFileName}</p>}
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Form.Group controlId="formReceipt">
                  <Form.Label>Receipt</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      setReceiptFile(e.target.files[0]);
                      setReceiptFileName(e.target.files[0].name);
                    }}
                  />
                  {receiptFileName && <p>Selected file: {receiptFileName}</p>}
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <AiFillCloseCircle /> Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : modalMode === "add" ? (
              <>
                <FaPlusSquare /> Add Transaction
              </>
            ) : (
              <>
                <AiFillSave /> Update Transaction
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;