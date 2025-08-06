// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { GeoAlt, CurrencyDollar, Box } from 'react-bootstrap-icons';
import { productApi } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productApi.getById(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Img variant="top" src={product.image || '/placeholder-product.jpg'} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Badge bg={product.condition === 'NEW' ? 'success' : 'warning'} className="mb-2">
                {product.condition}
              </Badge>
              <Card.Text>{product.description}</Card.Text>
              
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="text-primary mb-0">
                  <CurrencyDollar className="me-1" />
                  KES {product.price}
                </h4>
                <Button variant="primary">Add to Cart</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5>Seller Information</h5>
              <p className="text-muted">Sold by: {product.seller?.username || 'Unknown'}</p>
              
              <div className="d-flex align-items-center text-muted mb-3">
                <GeoAlt className="me-2" />
                <span>{product.location || 'Nairobi, Kenya'}</span>
              </div>
              
              <Button variant="outline-primary" className="w-100">
                Contact Seller
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;