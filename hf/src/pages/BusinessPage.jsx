import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BusinessList from '../components/business/BusinessList';
import BusinessForm from '../components/business/BusinessForm';

const BusinessPage = () => {
  return (
    <Container>
      <Row>
        <Col lg={8}>
          <BusinessList />
        </Col>
        <Col lg={4}>
          <BusinessForm />
        </Col>
      </Row>
    </Container>
  );
};

export default BusinessPage;