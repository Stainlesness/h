// src/components/service/ServiceCard.jsx
import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { GeoAlt, ArrowRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="mb-1">{service.title}</Card.Title>
            {service.category && (
              <Badge bg="secondary" className="mb-2">
                {service.category.name}
              </Badge>
            )}
          </div>
          <div className="text-end">
            <h5 className="text-primary mb-0">
              {service.hourly_rate ? `KES ${service.hourly_rate}/hr` : `KES ${service.fixed_price}`}
            </h5>
          </div>
        </div>
        
        <Card.Text className="text-muted">
          {showDetails ? service.description : `${service.description.substring(0, 100)}...`}
        </Card.Text>
        
        <div className="d-flex align-items-center text-muted small mb-3">
          <GeoAlt className="me-1" />
          <span>Within {service.service_area || 20}km of your location</span>
        </div>
        
        <div className="d-flex justify-content-between">
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Show Less' : 'Show More'}
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            as={Link}
            to={`/services/${service.id}`}
          >
            Request Service <ArrowRight className="ms-1" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;