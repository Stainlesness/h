// src/components/product/ProductForm.jsx
import React, { useState } from 'react';
import { Form, Button, InputGroup, Badge, Spinner, Row, Col } from 'react-bootstrap';
import LocationPicker from '../common/LocationPicker';
import { productApi, aiApi } from '../../services/api';

const ProductForm = ({ initialData = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category?.id || '',
    condition: initialData.condition || 'NEW',
    stock: initialData.stock || 1,
    location: initialData.location || null,
  });
  const [location, setLocation] = useState(initialData.location || null);
  const [aiTags, setAiTags] = useState(initialData.ai_tags || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        location: location,
        ai_tags: aiTags
      };

      let response;
      if (initialData.id) {
        response = await productApi.update(initialData.id, productData);
      } else {
        response = await productApi.create(productData);
      }

      onSuccess(response.data);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTags = async () => {
    if (formData.description) {
      setLoading(true);
      try {
        const response = await aiApi.generateTags(formData.description);
        setAiTags(response.tags);
      } catch (err) {
        console.error('AI tagging failed:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Row className="g-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Button 
                variant="outline-secondary"
                onClick={generateTags}
                disabled={!formData.description || loading}
              >
                {loading ? 'Generating...' : 'AI Tags'}
              </Button>
            </InputGroup>
            {aiTags.length > 0 && (
              <div className="mt-2">
                <span className="fw-bold me-2">AI Tags:</span>
                {aiTags.map(tag => (
                  <Badge key={tag} bg="primary" className="me-1">{tag}</Badge>
                ))}
              </div>
            )}
          </Form.Group>
          
          <Row className="g-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price (KES)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Location (Click on map)</Form.Label>
            <LocationPicker position={location} setPosition={setLocation} />
          </Form.Group>
          
          <Row className="g-2">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  <option value="microcontrollers">Microcontrollers</option>
                  <option value="tools">Power Tools</option>
                  <option value="pumps">Pumps</option>
                  <option value="components">Components</option>
                  <option value="kits">Kits</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Condition</Form.Label>
                <Form.Select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="NEW">Brand New</option>
                  <option value="USED">Used</option>
                  <option value="REFURB">Refurbished</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>
      
      <div className="mt-4">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!location || loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              {initialData.id ? 'Updating...' : 'Adding...'}
            </>
          ) : initialData.id ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;