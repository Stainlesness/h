// src/components/product/ProductCard.jsx
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { GeoAlt } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title>{product.name}</Card.Title>
            {product.category && (
              <Badge bg="secondary" className="mb-2">
                {product.category.name}
              </Badge>
            )}
          </div>
          <div className="text-end">
            <h5 className="text-primary mb-0">KES {product.price}</h5>
          </div>
        </div>
        
        <Card.Text className="text-muted">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Card.Text>
        
        <div className="d-flex align-items-center text-muted small mb-3">
          <GeoAlt className="me-1" />
          <span>{product.location || 'Nairobi, Kenya'}</span>
        </div>
        
        <div className="d-flex justify-content-between">
          <Badge bg={product.condition === 'NEW' ? 'success' : 'warning'}>
            {product.condition}
          </Badge>
          <Button 
            variant="primary" 
            size="sm" 
            as={Link} 
            to={`/products/${product.id}`}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;