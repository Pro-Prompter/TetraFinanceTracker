import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { databases } from '../lib/appwrite'; // Ensure this points to your Appwrite setup
import Swal from 'sweetalert2';
import auth from '../lib/redux/auth'; // Import your auth utility

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentUser, setCurrentUser] = useState({ Name: "", User_Name: "", Role: "" });

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
      setCurrentUser({ Name: "", User_Name: "", Role: "" });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser({ Name: "", User_Name: "", Role: "" });
  };

  const handleSave = async () => {
    try {
      const documentData = {
        User_Name: currentUser.User_Name,
        Name: currentUser.Name,
        Role: currentUser.Role
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

  const handleDelete = async (id, userEmail) => {
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
        // First, delete the user from the Users collection
        await databases.deleteDocument('66ae058300333732f99a', '66ae05a1002d7b4e35f7', id);

        // Then, delete the user's account using their email
        await auth.deleteAccount(userEmail); // Implement this function in your auth.js

        await Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success"
        });

        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      await Swal.fire({
        title: "Error!",
        text: "There was a problem deleting the user.",
        icon: "error"
      });
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
            <th>User Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.$id}>
              <td>{index + 1}</td>
              <td>{user.Name}</td>
              <td>{user.User_Name}</td>
              <td>{user.Role}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow("edit", user)} className="mx-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user.$id, user.Email)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
            <Form.Group controlId="formUserName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                value={currentUser.User_Name}
                onChange={(e) => setCurrentUser({ ...currentUser, User_Name: e.target.value })}
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