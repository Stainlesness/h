import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import BusinessCard from './BusinessCard';
import { businessApi } from '../../services/api';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await businessApi.getAll();
        setBusinesses(data);
      } catch (err) {
        setError('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="my-3">{error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">Business Directory</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>

      {filteredBusinesses.length === 0 ? (
        <Alert variant="info">No businesses found matching your search</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredBusinesses.map(business => (
            <Col key={business.id}>
              <BusinessCard business={business} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BusinessList;