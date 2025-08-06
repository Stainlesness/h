// src/components/product/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, InputGroup, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import ProductCard from './ProductCard';
import { productApi } from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2 className="mb-4">Electronics & Tools Marketplace</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
      </InputGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No products found matching your search
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProductList;