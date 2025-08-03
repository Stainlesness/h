// src/components/ServiceList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Row, Col, Card, Button, Form, 
  Spinner, Alert, InputGroup, Badge 
} from 'react-bootstrap';
import { GeoAlt, Search, Funnel, ArrowRight } from 'react-bootstrap-icons';

const API_BASE = 'http://localhost:8000/api';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Get user location and services
  useEffect(() => {
    // Get categories
    axios.get(`${API_BASE}/categories/`)
      .then(response => setCategories(response.data))
      .catch(console.error);
      
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchServices(latitude, longitude);
        },
        err => {
          console.error('Geolocation error:', err);
          setError('Could not get your location. Using default location.');
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          fetchServices(-1.2921, 36.8219);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
      fetchServices(-1.2921, 36.8219);
    }
  }, []);

  const fetchServices = (lat, lng, radius = 20) => {
    setLoading(true);
    axios.get(`${API_BASE}/services/?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then(response => {
        setServices(response.data);
        setFilteredServices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
        setLoading(false);
      });
  };

  // Apply filters
  useEffect(() => {
    let result = services;
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (category) {
      result = result.filter(service => 
        service.category?.name.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(service => {
        const price = service.hourly_rate || service.fixed_price;
        return price >= min && price <= max;
      });
    }
    
    setFilteredServices(result);
  }, [searchTerm, category, priceRange, services]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Triggered when search form is submitted
  };

  const getAISuggestions = () => {
    if (!searchTerm) return;
    
    setAiLoading(true);
    axios.post('/api/service-suggestions/', { text: searchTerm })
      .then(response => {
        setAiSuggestions(response.data.suggestions);
        setAiLoading(false);
      })
      .catch(error => {
        console.error('AI suggestions failed:', error);
        setAiLoading(false);
      });
  };

  const applyAISuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setAiSuggestions([]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setPriceRange('');
    setFilteredServices(services);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Find Services Near You</h2>
        <Button 
          variant={showFilters ? 'danger' : 'outline-primary'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Funnel className="me-1" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Search and Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search for services (e.g., electronics repair, microcontroller programming)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={getAISuggestions}
              />
              <Button 
                variant="primary" 
                type="submit"
                disabled={!searchTerm}
              >
                Search
              </Button>
            </InputGroup>
            
            {aiSuggestions.length > 0 && (
              <div className="mb-3">
                <p className="small mb-1">AI Suggestions:</p>
                <div className="d-flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Badge 
                      key={index}
                      pill 
                      bg="info" 
                      className="cursor-pointer"
                      onClick={() => applyAISuggestion(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {showFilters && (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Range (KES)</Form.Label>
                    <Form.Select 
                      value={priceRange} 
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="">Any Price</option>
                      <option value="0-500">Under 500</option>
                      <option value="500-2000">500 - 2,000</option>
                      <option value="2000-5000">2,000 - 5,000</option>
                      <option value="5000-10000">5,000 - 10,000</option>
                      <option value="10000-999999">Over 10,000</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Location Info */}
      {userLocation && (
        <div className="d-flex align-items-center mb-3 text-muted">
          <GeoAlt className="me-2" />
          <span>
            Showing services near: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </span>
          <Button 
            variant="link" 
            size="sm" 
            className="ms-2"
            onClick={() => fetchServices(userLocation.lat, userLocation.lng, 50)}
          >
            Expand search area
          </Button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Finding services near you...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredServices.length === 0 ? (
        <Alert variant="info" className="text-center">
          No services match your search criteria. Try different filters or expand your search area.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredServices.map(service => (
            <Col key={service.id}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

function ServiceCard({ service }) {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="mb-1">{service.title}</Card.Title>
            {service.category && (
              <Badge bg="secondary" className="mb-2">
                {service.category.name}
              </Badge>
            )}
          </div>
          <div className="text-end">
            <h5 className="text-primary mb-0">
              {service.hourly_rate ? `KES ${service.hourly_rate}/hr` : `KES ${service.fixed_price}`}
            </h5>
          </div>
        </div>
        
        <Card.Text className="text-muted">
          {showDetails ? service.description : `${service.description.substring(0, 100)}...`}
        </Card.Text>
        
        <div className="d-flex align-items-center text-muted small mb-3">
          <GeoAlt className="me-1" />
          <span>Within 20km of your location</span>
        </div>
        
        <div className="d-flex justify-content-between">
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Show Less' : 'Show More'}
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            as="a"
            href={`/services/${service.id}`}
          >
            Request Service <ArrowRight className="ms-1" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ServiceList;
