import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GeoAlt } from 'react-bootstrap-icons';

const BusinessCard = ({ business }) => {
  return (
    <Card className="h-100 shadow-sm">
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
        <Card.Text className="text-muted mb-3">
          {business.description.length > 100
            ? `${business.description.substring(0, 100)}...`
            : business.description}
        </Card.Text>
        <div className="d-flex align-items-center text-muted small mb-3">
          <GeoAlt className="me-1" />
          <span>{business.address || 'Location not specified'}</span>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0">
        <Button
          as={Link}
          to={`/businesses/${business.id}`}
          variant="outline-primary"
          size="sm"
          className="w-100"
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default BusinessCard;