// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'CUSTOMER'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Create Account</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Account Type</Form.Label>
          <Form.Select
            value={formData.user_type}
            onChange={(e) => setFormData({...formData, user_type: e.target.value})}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="BUSINESS">Business</option>
            <option value="SERVICE">Service Provider</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" disabled={loading} className="w-100">
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </Container>
  );
};

export default RegisterPage;