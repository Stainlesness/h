import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>ElectroMarket KE</h5>
            <p className="text-muted">
              Connecting Kenyan businesses and customers for electronics needs.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/businesses" className="text-decoration-none text-muted">Businesses</a></li>
              <li><a href="/products" className="text-decoration-none text-muted">Products</a></li>
              <li><a href="/services" className="text-decoration-none text-muted">Services</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: info@electromarket.co.ke</li>
              <li>Phone: +254 700 123 456</li>
              <li>Nairobi, Kenya</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-3 bg-secondary" />
        <p className="text-center text-muted mb-0">
          © {new Date().getFullYear()} ElectroMarket KE. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;