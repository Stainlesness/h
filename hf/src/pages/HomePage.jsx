import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { HouseDoor, Shop, Box, Tools } from 'react-bootstrap-icons';
import CategoryGrid from '../components/common/CategoryGrid';

const HomePage = () => {
  return (
    <div>
      <div className="bg-light py-5 mb-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold mb-4">ElectroMarket Kenya</h1>
          <p className="lead mb-4">
            Find electronics, tools, and services near you
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="primary" size="lg" href="/businesses">
              <Shop className="me-2" /> Browse Businesses
            </Button>
            <Button variant="outline-primary" size="lg" href="/products">
              <Box className="me-2" /> View Products
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        <h2 className="mb-4">Popular Categories</h2>
        <CategoryGrid />
      </Container>
    </div>
  );
};

export default HomePage;