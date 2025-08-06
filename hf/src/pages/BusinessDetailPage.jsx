// src/pages/BusinessDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { GeoAlt, Envelope, Telephone } from 'react-bootstrap-icons';
import { businessApi } from '../services/api';
import ProductList from '../components/product/ProductList';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await businessApi.getById(id);
        setBusiness(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title>{business.name}</Card.Title>
                  <Badge bg="secondary" className="mb-2">
                    {business.category?.name || 'General'}
                  </Badge>
                </div>
                {business.verified && (
                  <Badge bg="success">Verified</Badge>
                )}
              </div>
              
              <Card.Text>{business.description}</Card.Text>
              
              <div className="d-flex align-items-center text-muted mb-3">
                <GeoAlt className="me-2" />
                <span>{business.address}</span>
              </div>
              
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <Envelope className="me-1" /> {business.contact_email}
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Telephone className="me-1" /> {business.contact_phone}
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <h4 className="mb-3">Products from this Business</h4>
          <ProductList sellerId={business.owner} />
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Location</h5>
              {/* You can add a map here using your LocationPicker component */}
              <div className="bg-light rounded" style={{ height: '300px' }}>
                {/* Map placeholder */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BusinessDetailPage;