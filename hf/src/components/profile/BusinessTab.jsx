import React from 'react';
import { Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Shop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const BusinessesTab = ({ businesses, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-5">
        <Shop size={48} className="text-muted mb-3" />
        <h5>No Businesses Registered</h5>
        <p className="text-muted">
          You haven't registered any businesses yet.
        </p>
        <Button variant="primary" as={Link} to="/add-business">
          Add Business
        </Button>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} className="g-4">
      {businesses.map(business => (
        <Col key={business.id}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{business.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {business.category?.name || 'Electronics'}
                  </Card.Subtitle>
                </div>
                <Badge bg={business.verified ? "success" : "warning"}>
                  {business.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
              
              <Card.Text className="mt-3">
                {business.description.substring(0, 100)}...
              </Card.Text>
              
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm" as={Link} to={`/businesses/${business.id}`}>
                  View
                </Button>
                <Button variant="outline-secondary" size="sm" as={Link} to={`/businesses/${business.id}/edit`}>
                  Edit
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BusinessesTab;