// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EmojiFrown } from 'react-bootstrap-icons';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5">
      <EmojiFrown size={48} className="text-danger mb-3" />
      <h1>404 - Page Not Found</h1>
      <p className="lead">The page you're looking for doesn't exist.</p>
      <Button as={Link} to="/" variant="primary" className="mt-3">
        Go Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;