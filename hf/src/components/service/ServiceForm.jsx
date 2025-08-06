// src/components/service/ServiceForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import LocationPicker from '../common/LocationPicker';
import { serviceApi, categoryApi, aiApi } from '../../services/api';

const ServiceForm = ({ initialData = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category?.id || '',
    pricing_model: initialData.pricing_model || 'hourly',
    hourly_rate: initialData.hourly_rate || '',
    fixed_price: initialData.fixed_price || '',
    service_area: initialData.service_area || 10,
  });
  const [location, setLocation] = useState(initialData.location || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setError('Please select a location on the map');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const serviceData = {
        ...formData,
        location: location,
      };

      let response;
      if (initialData.id) {
        response = await serviceApi.update(initialData.id, serviceData);
      } else {
        response = await serviceApi.create(serviceData);
      }

      setSuccess(true);
      onSuccess(response.data);
    } catch (err) {
      console.error('Error adding service:', err);
      setError('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const enhanceDescription = async () => {
    if (formData.description) {
      setLoading(true);
      try {
        const response = await aiApi.enhanceText(formData.description);
        setFormData({ ...formData, description: response.enhanced_text });
        setAiEnhanced(true);
      } catch (err) {
        console.error('AI enhancement failed:', err);
        setError('AI enhancement failed. Using your original description.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      {success && (
        <Alert variant="success" className="mb-4">
          Service {initialData.id ? 'updated' : 'added'} successfully!
        </Alert>
      )}
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Service Information</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label>Service Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Arduino Programming, Electronics Repair"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">AI Enhance:</span>
                    <Button 
                      variant={aiEnhanced ? 'success' : 'outline-secondary'} 
                      size="sm"
                      onClick={enhanceDescription}
                      disabled={!formData.description || loading}
                    >
                      {loading ? 'Processing...' : aiEnhanced ? 'Enhanced ✓' : 'Improve Description'}
                    </Button>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Service Area Radius (km)</Form.Label>
                  <Form.Range 
                    min="1" 
                    max="100" 
                    value={formData.service_area}
                    onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                  />
                  <div className="d-flex justify-content-between">
                    <span>1km</span>
                    <span className="fw-bold">{formData.service_area}km</span>
                    <span>100km</span>
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Pricing & Location</h5>
                
                <Form.Group className="mb-4">
                  <Form.Label>Pricing Model</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      id="hourly"
                      label="Hourly Rate"
                      name="pricing"
                      checked={formData.pricing_model === 'hourly'}
                      onChange={() => setFormData({ ...formData, pricing_model: 'hourly' })}
                    />
                    <Form.Check
                      type="radio"
                      id="fixed"
                      label="Fixed Price"
                      name="pricing"
                      checked={formData.pricing_model === 'fixed'}
                      onChange={() => setFormData({ ...formData, pricing_model: 'fixed' })}
                    />
                  </div>
                </Form.Group>
                
                {formData.pricing_model === 'hourly' ? (
                  <Form.Group className="mb-4">
                    <Form.Label>Hourly Rate (KES)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>KES</InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        step="50"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                        required
                      />
                      <InputGroup.Text>per hour</InputGroup.Text>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Average hourly rates in Kenya: KES 500-2,000 for technical services
                    </Form.Text>
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-4">
                    <Form.Label>Fixed Price (KES)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>KES</InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        step="100"
                        value={formData.fixed_price}
                        onChange={(e) => setFormData({ ...formData, fixed_price: e.target.value })}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                )}
                
                <Form.Group className="mb-4">
                  <Form.Label>Service Location</Form.Label>
                  <p className="small text-muted mb-2">
                    Click on the map to set your primary service location. Customers will see this as your base.
                  </p>
                  <LocationPicker position={location} setPosition={setLocation} />
                  {location && (
                    <div className="mt-2 small">
                      <span className="fw-bold">Selected: </span>
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
            
            <div className="d-grid">
              <Button 
                variant="primary" 
                size="lg" 
                type="submit"
                disabled={loading || !location}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {initialData.id ? 'Updating...' : 'Publishing...'}
                  </>
                ) : initialData.id ? 'Update Service' : 'Publish Service'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ServiceForm;