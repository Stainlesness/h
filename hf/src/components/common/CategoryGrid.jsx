// src/components/common/CategoryGrid.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { categoryApi } from '../../services/api';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <Row xs={2} md={3} lg={6} className="g-3">
      {categories.map(category => (
        <Col key={category.id}>
          <Card className="h-100 text-center border-0 shadow-sm">
            <Card.Body className="py-4">
              <div className="display-5 mb-3">
                {category.icon || '📱'}
              </div>
              <Card.Title>{category.name}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CategoryGrid;