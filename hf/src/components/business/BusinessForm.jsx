import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import LocationPicker from '../common/LocationPicker';
import { businessApi } from '../../services/api';

const BusinessForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    contact_email: '',
    contact_phone: ''
  });
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchBusiness = async () => {
        try {
          setLoading(true);
          const { data } = await businessApi.getById(id);
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category?.id || '',
            address: data.address,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone
          });
          if (data.location) {
            setLocation({ lat: data.location.lat, lng: data.location.lng });
          }
        } catch (err) {
          setError('Failed to load business data');
        } finally {
          setLoading(false);
        }
      };
      fetchBusiness();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      setError('Please select a location on the map');
      return;
    }

    try {
      setLoading(true);
      const businessData = {
        ...formData,
        location: { lat: location.lat, lng: location.lng }
      };

      if (isEditMode) {
        await businessApi.update(id, businessData);
      } else {
        await businessApi.create(businessData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate(isEditMode ? `/businesses/${id}` : '/businesses');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} business`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="mb-4">{isEditMode ? 'Edit Business' : 'Register New Business'}</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && (
        <Alert variant="success" className="mb-4">
          Business {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
        </Alert>
      )}
      
      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="tools">Tools</option>
                  <option value="components">Components</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <LocationPicker position={location} setPosition={setLocation} />
              </Form.Group>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="mt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !location}
              className="me-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isEditMode ? 'Updating...' : 'Registering...'}
                </>
              ) : isEditMode ? 'Update Business' : 'Register Business'}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(isEditMode ? `/businesses/${id}` : '/businesses')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default BusinessForm;