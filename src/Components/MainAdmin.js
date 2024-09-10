import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MainAdmin = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [searchName, setSearchName] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3008/api/getusers"); // Replace with your API endpoint
        setUserData(response.data);
        setFilteredUserData(response.data);
        setUpdatedUserData(response.data.reduce((acc, user) => ({
          ...acc,
          [user.id]: { ...user }
        }), {}));
      } catch (err) {
        setError(err);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (userId, stage, value) => {
    const updatedStages = { ...updatedUserData[userId] };
    const stages = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6'];
    const stageIndex = stages.indexOf(stage);

    if (value === '1') { // '1' represents 'Rejected'
      for (let i = stageIndex; i < stages.length; i++) {
        updatedStages[stages[i]] = '1';
      }
    } else {
      updatedStages[stage] = value;
    }

    setUpdatedUserData(prevData => ({
      ...prevData,
      [userId]: updatedStages
    }));
  };

  const handleSubmit = async (userId) => {
    try {
      const user = updatedUserData[userId];
      await axios.put("http://localhost:3008/api/updateUser", { 
        Useremail: user.email, 
        stage1: user.stage1, 
        stage2: user.stage2, 
        stage3: user.stage3, 
        stage4: user.stage4, 
        stage5: user.stage5, 
        stage6: user.stage6 
      });
      alert('User data updated successfully');
    } catch (err) {
      console.error("Error updating user data:", err);
      alert('Failed to update user data');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3008/api/deleteUser/${userId}`); // Replace with your API endpoint
      setUserData(prevData => prevData.filter(user => user.id !== userId));
      setFilteredUserData(prevData => prevData.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      console.error("Error deleting user:", err);
      alert('Failed to delete user');
    }
  };

  const handleSearch = () => {
    const filteredData = userData.filter(user => user.name.toLowerCase().includes(searchName.toLowerCase()));
    setFilteredUserData(filteredData);
    setShowSearchModal(false); // Close the search modal after search
  };

  const handleShowSearchModal = () => setShowSearchModal(true);
  const handleCloseSearchModal = () => setShowSearchModal(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <>
      <header><NavBar /></header>
      <div className="d-flex flex-column overflow-auto h-100 bg-gray text-dark">
        <Container className="my-5">
          {/* Bootstrap Modal for Search */}
          <Modal show={showSearchModal} onHide={handleCloseSearchModal}>
            <Modal.Header closeButton>
              <Modal.Title>Search by Roll Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="searchName">
                  <Form.Label>Roll Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Roll number"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleSearch}>
                  Search
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Button to open the search modal */}
          <Row className="mb-3">
            <Col>
              <div className="text-right">
                <Button variant="info" onClick={handleShowSearchModal}>
                  Search by Name
                </Button>
              </div>
            </Col>
          </Row>

          {filteredUserData.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Email</th>
                  <th>Stage 1</th>
                  <th>Stage 2</th>
                  <th>Stage 3</th>
                  <th>Stage 4</th>
                  <th>Stage 5</th>
                  <th>Stage 6</th>
                  <th>Actions</th>
                  <th>Delete User</th>
                </tr>
              </thead>
              <tbody>
                {filteredUserData.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage1}
                        onChange={(e) => handleChange(user.id, 'stage1', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage2}
                        onChange={(e) => handleChange(user.id, 'stage2', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage3}
                        onChange={(e) => handleChange(user.id, 'stage3', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage4}
                        onChange={(e) => handleChange(user.id, 'stage4', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage5}
                        onChange={(e) => handleChange(user.id, 'stage5', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={updatedUserData[user.id].stage6}
                        onChange={(e) => handleChange(user.id, 'stage6', e.target.value)}
                      >
                        <option value="0">Selected</option>
                        <option value="1">Rejected</option>
                        <option value="3">Waiting</option>
                      </select>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        onClick={() => handleSubmit(user.id)}
                        className="mr-2"
                      >
                        Update
                      </Button>
                    </td>
                    <td>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No user data available.</p>
          )}
        </Container>
      </div>
    </>
  );
};

export default MainAdmin;
