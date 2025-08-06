import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { GeoAlt, Clock, CurrencyDollar, Tools } from 'react-bootstrap-icons';
import { serviceApi } from '../services/api';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await serviceApi.getById(id);
        setService(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
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
                  <Card.Title>{service.title}</Card.Title>
                  <Badge bg="secondary" className="mb-2">
                    {service.category?.name || 'General'}
                  </Badge>
                </div>
                <h4 className="text-primary">
                  {service.hourly_rate ? 
                    `KES ${service.hourly_rate}/hr` : 
                    `KES ${service.fixed_price}`}
                </h4>
              </div>
              
              <Card.Text>{service.description}</Card.Text>
              
              <div className="d-flex flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center text-muted">
                  <Tools className="me-2" />
                  <span>Service Area: {service.service_area || 20}km radius</span>
                </div>
                
                <div className="d-flex align-items-center text-muted">
                  <Clock className="me-2" />
                  <span>Response Time: {service.response_time || 'Within 24 hours'}</span>
                </div>
              </div>
              
              <Button variant="primary" size="lg" className="w-100">
                Request This Service
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5>Service Provider</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-light rounded-circle me-3" style={{ width: '50px', height: '50px' }}>
                  {service.provider?.profile_pic ? (
                    <img 
                      src={service.provider.profile_pic} 
                      alt="Provider" 
                      className="rounded-circle w-100 h-100"
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <Person size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="fw-bold">{service.provider?.username || 'Unknown'}</div>
                  <div className="text-muted small">
                    Member since {new Date(service.provider?.date_joined).getFullYear() || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="d-flex align-items-center text-muted mb-3">
                <GeoAlt className="me-2" />
                <span>
                  {service.location ? 
                    `${service.location.lat.toFixed(4)}, ${service.location.lng.toFixed(4)}` : 
                    'Location not specified'}
                </span>
              </div>
              
              <Button variant="outline-primary" className="w-100">
                Contact Provider
              </Button>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Location</h5>
              <div className="bg-light rounded" style={{ height: '200px' }}>
                {/* Map placeholder */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceDetailPage;