// src/components/service/ServiceList.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, InputGroup, Form, Button, Badge, Card } from 'react-bootstrap';
import { Search, Funnel, GeoAlt } from 'react-bootstrap-icons';
import ServiceCard from './ServiceCard';
import { serviceApi, categoryApi, aiApi } from '../../services/api';

const ServiceList = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get categories
        const categoriesResponse = await categoryApi.getAll();
        setCategories(categoriesResponse.data);
        
        // Get user location and services
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
              const servicesResponse = await serviceApi.getNearby(latitude, longitude, 20);
              setServices(servicesResponse.data);
              setFilteredServices(servicesResponse.data);
              setLoading(false);
            },
            async (err) => {
              console.error('Geolocation error:', err);
              setError('Could not get your location. Using default location.');
              setUserLocation({ lat: -1.2921, lng: 36.8219 });
              const servicesResponse = await serviceApi.getNearby(-1.2921, 36.8219, 20);
              setServices(servicesResponse.data);
              setFilteredServices(servicesResponse.data);
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser.');
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          const servicesResponse = await serviceApi.getNearby(-1.2921, 36.8219, 20);
          setServices(servicesResponse.data);
          setFilteredServices(servicesResponse.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load services');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = services;
    
    if (searchTerm) {
      result = result.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (category) {
      result = result.filter(service => 
        service.category?.name.toLowerCase() === category.toLowerCase()
      );
    }
    
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
    // Search is handled by the useEffect
  };

  const getAISuggestions = async () => {
    if (!searchTerm) return;
    
    setAiLoading(true);
    try {
      const response = await aiApi.getSuggestions(searchTerm);
      setAiSuggestions(response.suggestions);
    } catch (err) {
      console.error('AI suggestions failed:', err);
    } finally {
      setAiLoading(false);
    }
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

  const expandSearch = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const response = await serviceApi.getNearby(userLocation.lat, userLocation.lng, 50);
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (err) {
      console.error('Error expanding search:', err);
      setError('Failed to expand search area');
    } finally {
      setLoading(false);
    }
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
            onClick={expandSearch}
          >
            Expand search area
          </Button>
        </div>
      )}

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
};

export default ServiceList;