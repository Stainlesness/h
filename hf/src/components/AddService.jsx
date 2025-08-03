// src/components/AddService.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Form, Button, Spinner, 
  Row, Col, Card, Badge, Alert
} from 'react-bootstrap';
import LocationPicker from './LocationPicker';

const API_BASE = 'http://localhost:8000/api';

function AddService() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricing_model: 'hourly',
    hourly_rate: '',
    fixed_price: '',
    service_area: 10, // Default 10km radius
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    axios.get(`${API_BASE}/categories/`)
      .then(response => setCategories(response.data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location) {
      setError('Please select a location on the map');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const serviceData = {
      ...formData,
      location: location,
      provider: 1, // In a real app, this would be the logged-in user ID
    };
    
    axios.post(`${API_BASE}/services/`, serviceData)
      .then(response => {
        setSuccess(true);
        resetForm();
        setLoading(false);
      })
      .catch(error => {
        console.error('Error adding service:', error);
        setError('Failed to add service. Please try again.');
        setLoading(false);
      });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      pricing_model: 'hourly',
      hourly_rate: '',
      fixed_price: '',
      service_area: 10,
    });
    setLocation(null);
    setAiEnhanced(false);
  };

  const enhanceDescription = () => {
    if (formData.description) {
      setLoading(true);
      axios.post('/api/enhance-description/', { text: formData.description })
        .then(response => {
          setFormData({ ...formData, description: response.data.enhanced_text });
          setAiEnhanced(true);
          setLoading(false);
        })
        .catch(error => {
          console.error('AI enhancement failed:', error);
          setError('AI enhancement failed. Using your original description.');
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Add a New Service</h2>
      
      {success && (
        <Alert variant="success" className="mb-4">
          Service added successfully! It will be visible to customers immediately.
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
                    Adding Service...
                  </>
                ) : 'Publish Service'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddService;
