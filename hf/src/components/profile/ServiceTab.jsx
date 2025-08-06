// src/components/profile/ServicesTab.jsx
import React from 'react';
import { Button, Badge, Spinner, Table } from 'react-bootstrap';
import { Tools } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ServicesTab = ({ services, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-5">
        <Tools size={48} className="text-muted mb-3" />
        <h5>No Services Offered</h5>
        <p className="text-muted">
          You haven't listed any services yet. Start by adding your first service.
        </p>
        <Button variant="primary" as={Link} to="/add-service">
          Add Service
        </Button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover>
        <thead>
          <tr>
            <th>Service</th>
            <th>Category</th>
            <th>Pricing</th>
            <th>Status</th>
            <th>Requests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>
                <div className="fw-bold">{service.title}</div>
                <div className="small text-muted">
                  {service.description.substring(0, 60)}...
                </div>
              </td>
              <td>{service.category?.name || 'General'}</td>
              <td>
                {service.hourly_rate ? 
                  `KES ${service.hourly_rate}/hr` : 
                  `KES ${service.fixed_price} fixed`
                }
              </td>
              <td>
                <Badge bg="success">Active</Badge>
              </td>
              <td>
                <Badge bg="primary">5 Requests</Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-1" as={Link} to={`/services/${service.id}/edit`}>
                  Manage
                </Button>
                <Button variant="outline-success" size="sm" as={Link} to={`/services/${service.id}`}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ServicesTab;