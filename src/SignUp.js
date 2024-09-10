import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [rollnumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();
  const [error, setError] = useState('');

  // Email validation function
  const validateEmailDomain = (email) => {
    return email.endsWith("@kce.ac.in");
  };

  async function submit(e) {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate email domain
    if (!validateEmailDomain(email)) {
      setError("Please use your college email (e.g., @kce.ac.in)");
      return;
    }

    try {
      await axios.post("http://localhost:3008/api/signup", {
        rollnumber, email, password
      })
      .then(res => {
        console.log(res);
        
        if (res.status !== 201) {
          alert("User already exists");
        } else {
          history("/ApplicationStatus", { state: { id: email } });
        }
      })
      .catch(e => {
        alert("Wrong details");
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="form-container sign-up-container">
      <form action="POST">
        <h1>Create Account</h1>
        <span>Use your college email for registration</span>
        
        {/* Display error message */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <input
          type="text"
          name="rollnumber"
          value={rollnumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Roll Number"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="College Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" onClick={submit}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;