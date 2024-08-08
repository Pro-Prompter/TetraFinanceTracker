import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { databases } from '../lib/appwrite';
import Swal from 'sweetalert2';
import Footer from "./Footer";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentUser, setCurrentUser] = useState({ Name: "", Role: "", Status: "" });

  const fetchUsers = async () => {
    try {
      const response = await databases.listDocuments('66ae058300333732f99a', '66ae05a1002d7b4e35f7');
      setUsers(response.documents);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShow = (mode, user = {}) => {
    setModalMode(mode);
    if (mode === "edit" && user) {
      setCurrentUser({ ...user });
    } else {
      setCurrentUser({ Name: "", Role: "", Status: "" });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ Name: "", Role: "", Status: "" });
  };

  const handleSave = async () => {
    try {
      const documentData = {
        Name: currentUser.Name,
        Role: currentUser.Role,
        Status: currentUser.Status
      };
  
      if (modalMode === "add") {
        await databases.createDocument('66ae058300333732f99a', '66ae05a1002d7b4e35f7', 'unique()', documentData);
      } else if (modalMode === "edit") {
        if (!currentUser.$id) {
          console.error("No document ID provided for update.");
          return;
        }
        await databases.updateDocument('66ae058300333732f99a', '66ae05a1002d7b4e35f7', currentUser.$id, documentData);
      }
      handleClose();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
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
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await databases.deleteDocument('66ae058300333732f99a', '66ae05a1002d7b4e35f7', id);
        await Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success"
        });
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <Button variant="primary" onClick={() => handleShow("add")}>Add User</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.$id}>
              <td>{index + 1}</td>
              <td>{user.Name}</td>
              <td>{user.Role}</td>
              <td>{user.Status}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow("edit", user)} className="mx-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user.$id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Footer />

      {/* Modal for Add/Edit User */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "add" ? "Add User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={currentUser.Name}
                onChange={(e) => setCurrentUser({ ...currentUser, Name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Role"
                value={currentUser.Role}
                onChange={(e) => setCurrentUser({ ...currentUser, Role: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.Status}
                onChange={(e) => setCurrentUser({ ...currentUser, Status: e.target.value })}
              >
                <option value="">Select Status</option>
                {["Active", "Inactive", "Pending"].map((Status) => (
                  <option key={Status} value={Status}>{Status}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;