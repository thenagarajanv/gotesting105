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

const Admin = () => {
  const [userData, setUserData] = useState([]);
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);

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
    setUpdatedUserData(prevData => {
      const user = prevData[userId];
      let updatedStages = { ...user };

      if (value === '1') { // If the selected stage is "Rejected"
        switch (stage) {
          case 'stage1':
            updatedStages = {
              ...updatedStages,
              stage1: value,
              stage2: value,
              stage3: value,
              stage4: value,
              stage5: value,
              stage6: value,
            };
            break;
          case 'stage2':
            updatedStages = {
              ...updatedStages,
              stage2: value,
              stage3: value,
              stage4: value,
              stage5: value,
              stage6: value,
            };
            break;
          case 'stage3':
            updatedStages = {
              ...updatedStages,
              stage3: value,
              stage4: value,
              stage5: value,
              stage6: value,
            };
            break;
          case 'stage4':
            updatedStages = {
              ...updatedStages,
              stage4: value,
              stage5: value,
              stage6: value,
            };
            break;
          case 'stage5':
            updatedStages = {
              ...updatedStages,
              stage5: value,
              stage6: value,
            };
            break;
          case 'stage6':
            updatedStages = {
              ...updatedStages,
              stage6: value,
            };
            break;
          default:
            break;
        }
      } else {
        // If not "Rejected", just update the single stage
        updatedStages[stage] = value;
      }

      return {
        ...prevData,
        [userId]: updatedStages,
      };
    });
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

  const handleSearch = () => {
    const filteredData = userData.filter(user => user.name.toLowerCase().includes(searchName.toLowerCase()));
    setFilteredUserData(filteredData);
    setShowModal(false); // Close the modal after search
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <>
      <header><NavBar /></header>
      <div className="d-flex flex-column overflow-auto h-100 bg-gray text-dark">
        <Container className="my-5">
          <Row className="mb-3">
            <Col className="text-right">
              <div className="p-3">
                <Button variant="info" onClick={handleShowModal}>
                  Search by Roll Number
                </Button>
              </div>
            </Col>
          </Row>

          {/* Bootstrap Modal for Search */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Search by Roll Number</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="searchName">
                  <Form.Label>Roll Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter user Roll Number"
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
                </tr>
              </thead>
              <tbody>
                {filteredUserData.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
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
                      >
                        Update
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

export default Admin;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavBar from './NavBar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Container from 'react-bootstrap/Container';
// import Table from 'react-bootstrap/Table';
// import Button from 'react-bootstrap/Button';

// const Admin = () => {
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updatedUserData, setUpdatedUserData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3008/api/getusers"); // Replace with your API endpoint
//         setUserData(response.data);
//         setUpdatedUserData(response.data.reduce((acc, user) => ({
//           ...acc,
//           [user.id]: { ...user }
//         }), {}));
//       } catch (err) {
//         setError(err);
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (userId, stage, value) => {
//     setUpdatedUserData(prevData => ({
//       ...prevData,
//       [userId]: {
//         ...prevData[userId],
//         [stage]: value
//       }
//     }));
//   };

//   const handleSubmit = async (userId) => {
//     try {
//       const user = updatedUserData[userId];
//       await axios.put("http://localhost:3008/api/updateUser", { 
//         Useremail: user.email, 
//         stage1: user.stage1, 
//         stage2: user.stage2, 
//         stage3: user.stage3, 
//         stage4: user.stage4, 
//         stage5: user.stage5, 
//         stage6: user.stage6 
//       });
//       alert('User data updated successfully');
//     } catch (err) {
//       console.error("Error updating user data:", err);
//       alert('Failed to update user data');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching data: {error.message}</p>;

//   return (
//     <>
//       <header><NavBar /></header>
//       <div className="d-flex flex-column overflow-auto h-100 bg-gray text-dark">
//         <Container className="my-5">
//           {userData.length > 0 ? (
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Roll Number</th>
//                   <th>Email</th>
//                   <th>Stage 1</th>
//                   <th>Stage 2</th>
//                   <th>Stage 3</th>
//                   <th>Stage 4</th>
//                   <th>Stage 5</th>
//                   <th>Stage 6</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userData.map(user => (
//                   <tr key={user.id}>
//                     <td>{user.id}</td>
//                     <td>{user.email}</td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage1}
//                         onChange={(e) => handleChange(user.id, 'stage1', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage2}
//                         onChange={(e) => handleChange(user.id, 'stage2', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage3}
//                         onChange={(e) => handleChange(user.id, 'stage3', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage4}
//                         onChange={(e) => handleChange(user.id, 'stage4', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage5}
//                         onChange={(e) => handleChange(user.id, 'stage5', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <select
//                         className="form-control"
//                         value={updatedUserData[user.id].stage6}
//                         onChange={(e) => handleChange(user.id, 'stage6', e.target.value)}
//                       >
//                         <option value="0">Selected</option>
//                         <option value="1">Rejected</option>
//                         <option value="3">Waiting</option>
//                       </select>
//                     </td>
//                     <td>
//                       <Button 
//                         variant="primary" 
//                         onClick={() => handleSubmit(user.id)}
//                       >
//                         Update
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>No user data available.</p>
//           )}
//         </Container>
//       </div>
//     </>
//   );
// };

// export default Admin;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavBar from './NavBar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

// const ApplicationStatus = () => {
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updatedUserData, setUpdatedUserData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3008/api/getusers"); // Replace with your API endpoint
//         setUserData(response.data);
//         setUpdatedUserData(response.data.reduce((acc, user) => ({
//           ...acc,
//           [user.id]: { ...user }
//         }), {}));
//       } catch (err) {
//         setError(err);
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (userId, stage, value) => {
//     setUpdatedUserData(prevData => ({
//       ...prevData,
//       [userId]: {
//         ...prevData[userId],
//         [stage]: value
//       }
//     }));
//   };

//   const handleSubmit = async (userId) => {
//     try {
//       const user = updatedUserData[userId];
//       await axios.put("http://localhost:3008/api/updateUser", { 
//         Useremail: user.email, 
//         stage1: user.stage1, 
//         stage2: user.stage2, 
//         stage3: user.stage3, 
//         stage4: user.stage4, 
//         stage5: user.stage5, 
//         stage6: user.stage6 
//       });
//       alert('User data updated successfully');
//     } catch (err) {
//       console.error("Error updating user data:", err);
//       alert('Failed to update user data');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching data: {error.message}</p>;

//   return (
//     <>
//       <header><NavBar /></header>
//       <div className="d-flex flex-column overflow-auto h-100 bg-gray text-dark">
//         <div className="container h-50 px-4 py-5 mx-auto">
//           <div className="card bg-light shadow-lg border border-dark rounded-lg py-3 px-5 my-5">
//             <div className="row d-flex justify-content-between mx-5 pt-3 my-3">
//               <div className="container text-center">
//                 <p className="h3 text-success mb-3"><b>Application Status</b></p>
//               </div>
//             </div>
//             <Container>
//               {userData.length > 0 ? (
//                 userData.map(user => (
//                   <div key={user.id} className="card mb-3">
//                     <div className="card-body">
//                       <h5 className="card-title">{user.name}</h5>
//                       <p className="card-text"><b>Email:</b> {user.email}</p>
//                       <div className="form-group">
//                         <label>Stage 1:</label>
//                         <select
//                           className="form-control"
//                           value={updatedUserData[user.id].stage1}
//                           onChange={(e) => handleChange(user.id, 'stage1', e.target.value)}
//                         >
//                           <option value="select">Select</option>
//                           <option value="not select">Not Select</option>
//                         </select>
//                       </div>
//                       <div className="form-group">
//                         <label>Stage 2:</label>
//                         <select
//                           className="form-control"
//                           value={updatedUserData[user.id].stage2}
//                           onChange={(e) => handleChange(user.id, 'stage2', e.target.value)}
//                         >
//                           <option value="select">Select</option>
//                           <option value="not select">Not Select</option>
//                         </select>
//                       </div>
//                       {/* Repeat for other stages */}
//                       <Button 
//                         variant="primary" 
//                         onClick={() => handleSubmit(user.id)}
//                       >
//                         Update
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No user data available.</p>
//               )}
//             </Container>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ApplicationStatus;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavBar from './NavBar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Accordion from 'react-bootstrap/Accordion';

// const ApplicationStatus = () => {
//   const [userData, setUserData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3008/api/getusers");  // Replace with your API endpoint
//         console.log('API response data:', response.data);
        
//         // Assuming response.data is an array of users
//         setUserData(response.data);
//       } catch (err) {
//         setError(err);
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle loading and error states
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching data: {error.message}</p>;

//   // Helper function to determine stage status
//   const getStageStatus = (stage) => {
//     return stage ? 'select' : 'not select';
//   };

//   return (
//     <>
//       <header><NavBar /></header>
//       <div className="d-flex flex-column overflow-auto h-100 bg-gray text-dark">
//         <div className="container h-50 px-4 py-5 mx-auto">
//           <div className="card bg-light shadow-lg border border-dark rounded-lg py-3 px-5 my-5">
//             <div className="row d-flex justify-content-between mx-5 pt-3 my-3">
//               <div className="container text-center">
//                 <p className="h3 text-success mb-3"><b>Application Status</b></p>
//               </div>
//             </div>
//             <Container>
//               {userData.length > 0 ? (
//                 userData.map(user => (
//                   <div key={user.id} className="card mb-3">
//                     <div className="card-body">
//                       <h5 className="card-title">{user.name}</h5>
//                       <p className="card-text"><b>Email:</b> {user.email}</p>
//                       <p className="card-text"><b>Stage 1:</b> {getStageStatus(user.stage1)}</p>
//                       <p className="card-text"><b>Stage 2:</b> {getStageStatus(user.stage2)}</p>
//                       <p className="card-text"><b>Stage 3:</b> {getStageStatus(user.stage3)}</p>
//                       <p className="card-text"><b>Stage 4:</b> {getStageStatus(user.stage4)}</p>
//                       <p className="card-text"><b>Stage 5:</b> {getStageStatus(user.stage5)}</p>
//                       <p className="card-text"><b>Stage 6:</b> {getStageStatus(user.stage6)}</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No user data available.</p>
//               )}
//             </Container>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ApplicationStatus;

// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import NavBar from './NavBar';
// import Table from 'react-bootstrap/Table';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Admin(){
//     const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3008/api/getusers");  // Replace with your API endpoint
//         console.log('API response data:', response.data);
        
//         // Assuming response.data is either an array of users or an object with a users property
//         // Adjust the data extraction based on your actual response structure
//         const data = response.data;  // Modify if necessary

//         setUserData(data);
//       } catch (err) {
//         setError(err);
//         console.error("Error fetching user data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle loading and error states
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching data: {error.message}</p>;

//   return (
//     <>
//         <header><NavBar/></header>
//         <div style={{cursor:"pointer"}}>
//             <Table striped bordered hover variant="dark" style={{padding:"20px"}}>
//                 <thead>
//                     <tr>
//                         <th>Roll Number</th>
//                         <th>Email Id</th>
//                         <th>Round 2</th>
//                         <th>Round 3</th>
//                         <th>Round 4</th>
//                         <th>Round 5</th>
//                         <th>Round 6</th>
//                         <th>Update</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>{}</td>
//                         <td>{}</td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td><Button variant="primary">Update</Button></td>
//                     </tr>
//                     <tr>
//                         <td>717821f134</td>
//                         <td>717821f134@kce.ac.in</td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td>
//                         <Form.Select size="sm">
//                             <option>Select</option>
//                             <option value="success">Selected</option>
//                             <option value="danger">Not Selected</option>
//                         </Form.Select>
//                         </td>
//                         <td><Button variant="primary">Update</Button></td>
//                     </tr>
//                 </tbody>
//             </Table>
//         </div>
//         <footer></footer>
//     </>
//   )
// }

// export default Admin