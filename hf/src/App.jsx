// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  Link,
  useLocation,
  useParams
} from 'react-router-dom';
import { 
  Container, Navbar, Nav, Button, Spinner, Row, Col, Card, 
  Form, InputGroup, Badge, Alert, Tab, Nav as TabNav, ListGroup 
} from 'react-bootstrap';
import { 
  HouseDoor, Search, PlusCircle, Person, Shop, Tools, 
  Box, Star, GeoAlt, Funnel, ArrowRight, Gear 
} from 'react-bootstrap-icons';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// API Configuration
const API_BASE = 'http://localhost:8000/api';

// ======================== COMPONENTS ======================== //

// Header Component
function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="fw-bold">ElectroMarket KE</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              <HouseDoor className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/businesses" className={isActive('/businesses')}>
              <Shop className="me-1" /> Businesses
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className={isActive('/products')}>
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/services" className={isActive('/services')}>
              <Tools className="me-1" /> Services
            </Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outline-light" as={Link} to="/add-business" className="me-2">
              <PlusCircle className="me-1" /> Add Business
            </Button>
            <Button variant="primary" as={Link} to="/profile">
              <Person className="me-1" /> Profile
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Location Picker Component (Reusable)
function LocationPicker({ position, setPosition }) {
  const LocationFinder = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position ? <Marker position={position} /> : null;
  };

  return (
    <div className="border rounded overflow-hidden" style={{ height: '300px' }}>
      <MapContainer 
        center={position || [-1.2921, 36.8219]} 
        zoom={position ? 15 : 12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Marker position={position} />}
        <LocationFinder />
      </MapContainer>
      
      {position && (
        <div className="bg-light p-2 small">
          Selected: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}

// Business Card Component (Reusable)
function BusinessCard({ business }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-start">
          <div className="bg-light border rounded p-2 me-3">
            <div className="text-muted">Logo</div>
          </div>
          <div>
            <Card.Title>{business.name}</Card.Title>
            <Card.Text className="text-muted small">
              {business.category?.name || 'Electronics'}
            </Card.Text>
          </div>
        </div>
        <Card.Text className="mt-3">
          {business.description.length > 100 
            ? `${business.description.substring(0, 100)}...` 
            : business.description}
        </Card.Text>
        <div className="d-flex align-items-center text-muted small">
          <GeoAlt className="me-1" />
          <span>{business.address || 'Nairobi, Kenya'}</span>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0">
        <Button variant="outline-primary" size="sm" as={Link} to={`/businesses/${business.id}`}>
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
}

// Home Page Component
function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyBusinesses(latitude, longitude);
        },
        err => {
          console.error('Geolocation error:', err);
          setError('Could not get your location. Using default location.');
          // Default to Nairobi coordinates
          setUserLocation({ lat: -1.2921, lng: 36.8219 });
          fetchNearbyBusinesses(-1.2921, 36.8219);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      // Default to Nairobi coordinates
      setUserLocation({ lat: -1.2921, lng: 36.8219 });
      fetchNearbyBusinesses(-1.2921, 36.8219);
    }
  }, []);

  const fetchNearbyBusinesses = (lat, lng) => {
    setLoading(true);
    axios.get(`${API_BASE}/nearby-businesses/?lat=${lat}&lng=${lng}&radius=5`)
      .then(response => {
        setNearbyBusinesses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching businesses:', error);
        setError('Failed to load nearby businesses');
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Electronics Marketplace for Kenya</h1>
        <p className="lead">
          Find electronics, tools, and services near you. Connect with local businesses and service providers.
        </p>
        
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" size="lg" className="me-3" as={Link} to="/products">
            Browse Products
          </Button>
          <Button variant="outline-primary" size="lg" as={Link} to="/services">
            Find Services
          </Button>
        </div>
      </div>

      {userLocation && (
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <GeoAlt className="me-2 text-primary" />
            <h4 className="mb-0">Businesses Near You</h4>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading nearby businesses...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : nearbyBusinesses.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {nearbyBusinesses.map(business => (
                <Col key={business.id}>
                  <BusinessCard business={business} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="alert alert-info">
              No businesses found near your location. Try expanding your search radius.
            </div>
          )}
        </div>
      )}

      <div className="mt-5 pt-4 border-top">
        <h4 className="mb-4">Popular Categories</h4>
        <CategoryGrid />
      </div>
    </div>
  );
}

// Category Grid Component
function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/categories/`)
      .then(response => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
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
              <div className="display-5 mb-3">📱</div>
              <Card.Title>{category.name}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

// Business List Component
function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/businesses/`)
      .then(response => {
        setBusinesses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching businesses:', error);
        setError('Failed to load businesses');
        setLoading(false);
      });
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2 className="mb-4">Local Electronics Businesses</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary">
          <Search />
        </Button>
      </InputGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading businesses...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredBusinesses.length === 0 ? (
        <Alert variant="info" className="text-center">
          No businesses found matching your search
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredBusinesses.map(business => (
            <Col key={business.id}>
              <BusinessCard business={business} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

// Add Business Component
function AddBusiness() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    location: null
  });
  const [location, setLocation] = useState(null);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Add location to form data
    const businessData = {
      ...formData,
      location: location
    };
    
    axios.post(`${API_BASE}/businesses/`, businessData)
      .then(response => {
        alert('Business added successfully!');
        setFormData({
          name: '',
          description: '',
          category: '',
          address: '',
          contact_email: '',
          contact_phone: '',
          location: null
        });
        setLocation(null);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error adding business:', error);
        alert('Failed to add business');
        setLoading(false);
      });
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
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <h2 className="mb-4">Register Your Business</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Business Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description</label>
              <div className="input-group">
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={enhanceDescription}
                  disabled={!formData.description || loading}
                >
                  {loading ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
              {aiEnhanced && (
                <div className="form-text text-success">
                  Description enhanced with AI
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Location (Click on map)</label>
              <LocationPicker position={location} setPosition={setLocation} />
            </div>
            
            <div className="row g-2">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="tools">Power Tools</option>
                <option value="pumps">Pumps</option>
                <option value="components">Components</option>
                <option value="services">Services</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!location || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registering Business...
              </>
            ) : 'Register Business'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Product List Component
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/products/`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2 className="mb-4">Electronics & Tools Marketplace</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary">
          <Search />
        </Button>
      </InputGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          No products found matching your search
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title>{product.name}</Card.Title>
            {product.category && (
              <Badge bg="secondary" className="mb-2">
                {product.category.name}
              </Badge>
            )}
          </div>
          <div className="text-end">
            <h5 className="text-primary mb-0">KES {product.price}</h5>
          </div>
        </div>
        
        <Card.Text className="text-muted">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Card.Text>
        
        <div className="d-flex align-items-center text-muted small mb-3">
          <GeoAlt className="me-1" />
          <span>Nairobi, Kenya</span>
        </div>
        
        <div className="d-flex justify-content-between">
          <Badge bg={product.condition === 'NEW' ? 'success' : 'warning'}>
            {product.condition}
          </Badge>
          <Button variant="primary" size="sm">
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// Add Product Component
function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: 'NEW',
    stock: 1,
    location: null
  });
  const [location, setLocation] = useState(null);
  const [aiTags, setAiTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Add location to form data
    const productData = {
      ...formData,
      location: location,
      ai_tags: aiTags
    };
    
    axios.post(`${API_BASE}/products/`, productData)
      .then(response => {
        alert('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          condition: 'NEW',
          stock: 1,
          location: null
        });
        setLocation(null);
        setAiTags([]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product');
        setLoading(false);
      });
  };

  const generateTags = () => {
    if (formData.description) {
      setLoading(true);
      axios.post('/api/generate-tags/', { text: formData.description })
        .then(response => {
          setAiTags(response.data.tags);
          setLoading(false);
        })
        .catch(error => {
          console.error('AI tagging failed:', error);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Description</label>
              <div className="input-group">
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={generateTags}
                  disabled={!formData.description || loading}
                >
                  {loading ? 'Generating...' : 'AI Tags'}
                </button>
              </div>
              {aiTags.length > 0 && (
                <div className="mt-2">
                  <span className="fw-bold me-2">AI Tags:</span>
                  {aiTags.map(tag => (
                    <span key={tag} className="badge bg-primary me-1">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="row g-2">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Price (KES)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Location (Click on map)</label>
              <LocationPicker position={location} setPosition={setLocation} />
            </div>
            
            <div className="row g-2">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
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
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Condition</label>
                  <select
                    className="form-select"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  >
                    <option value="NEW">Brand New</option>
                    <option value="USED">Used</option>
                    <option value="REFURB">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!location || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Adding Product...
              </>
            ) : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Service List Component
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

// Add Service Component
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

// User Profile Component
function UserProfile() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('businesses');

  // Simulated user data (in a real app, this would come from authentication)
  const userId = 1; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await axios.get(`${API_BASE}/users/${userId}/`);
        setUser(userResponse.data);
        
        // Fetch user's businesses
        const businessesResponse = await axios.get(`${API_BASE}/businesses/?owner=${userId}`);
        setBusinesses(businessesResponse.data);
        
        // Fetch user's products
        const productsResponse = await axios.get(`${API_BASE}/products/?seller=${userId}`);
        setProducts(productsResponse.data);
        
        // Fetch user's services
        const servicesResponse = await axios.get(`${API_BASE}/services/?provider=${userId}`);
        setServices(servicesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-5">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '100px', height: '100px' }}>
                {user.profile_pic ? (
                  <img 
                    src={user.profile_pic} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Person size={48} className="text-secondary" />
                )}
              </div>
              
              <Card.Title className="mb-1">{user.username}</Card.Title>
              <Card.Subtitle className="text-muted mb-3">
                {user.user_type === 'BUSINESS' ? 'Business Account' : 'Service Provider'}
              </Card.Subtitle>
              
              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button variant="outline-primary" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Settings
                </Button>
              </div>
              
              <ListGroup variant="flush" className="text-start">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Email</span>
                  <span className="text-muted">{user.email || 'Not provided'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Phone</span>
                  <span className="text-muted">{user.phone || 'Not provided'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Account Type</span>
                  <Badge bg="info">{user.user_type}</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center text-muted">
                    <GeoAlt className="me-2" />
                    <span>{user.address || 'Location not set'}</span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Card className="shadow-sm">
              <Card.Header>
                <TabNav variant="tabs" defaultActiveKey="businesses">
                  <TabNav.Item>
                    <TabNav.Link eventKey="businesses">
                      <Shop className="me-2" /> My Businesses
                    </TabNav.Link>
                  </TabNav.Item>
                  <TabNav.Item>
                    <TabNav.Link eventKey="products">
                      <Box className="me-2" /> My Products
                    </TabNav.Link>
                  </TabNav.Item>
                  <TabNav.Item>
                    <TabNav.Link eventKey="services">
                      <Tools className="me-2" /> My Services
                    </TabNav.Link>
                  </TabNav.Item>
                  <TabNav.Item>
                    <TabNav.Link eventKey="reviews">
                      <Star className="me-2" /> Reviews
                    </TabNav.Link>
                  </TabNav.Item>
                </TabNav>
              </Card.Header>
              
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="businesses">
                    <BusinessesTab 
                      businesses={businesses} 
                      loading={loading} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="products">
                    <ProductsTab 
                      products={products} 
                      loading={loading} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="services">
                    <ServicesTab 
                      services={services} 
                      loading={loading} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="reviews">
                    <ReviewsTab />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
}

// Businesses Tab Component
function BusinessesTab({ businesses, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-5">
        <Shop size={48} className="text-muted mb-3" />
        <h5>No Businesses Registered</h5>
        <p className="text-muted">
          You haven't registered any businesses yet. Start by adding your first business.
        </p>
        <Button variant="primary" as="a" href="/add-business">
          Add Business
        </Button>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} className="g-4">
      {businesses.map(business => (
        <Col key={business.id}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>{business.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {business.category?.name || 'Electronics'}
                  </Card.Subtitle>
                </div>
                <Badge bg={business.verified ? "success" : "warning"}>
                  {business.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
              
              <Card.Text className="mt-3">
                {business.description.length > 100 
                  ? `${business.description.substring(0, 100)}...` 
                  : business.description}
              </Card.Text>
              
              <div className="d-flex align-items-center text-muted small mb-3">
                <GeoAlt className="me-1" />
                <span>{business.address || 'Nairobi, Kenya'}</span>
              </div>
              
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  View
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Edit
                </Button>
                <Button variant="outline-success" size="sm">
                  Add Product
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

// Products Tab Component
function ProductsTab({ products, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <Box size={48} className="text-muted mb-3" />
        <h5>No Products Listed</h5>
        <p className="text-muted">
          You haven't listed any products yet. Start by adding your first product.
        </p>
        <Button variant="primary" as="a" href="/add-product">
          Add Product
        </Button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Condition</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="bg-light border rounded me-3" style={{ width: '40px', height: '40px' }}></div>
                  <div>
                    <div className="fw-bold">{product.name}</div>
                    <div className="small text-muted">
                      {product.description.substring(0, 40)}...
                    </div>
                  </div>
                </div>
              </td>
              <td>{product.category?.name || 'Electronics'}</td>
              <td className="fw-bold">KES {product.price}</td>
              <td>{product.stock}</td>
              <td>
                <Badge bg={
                  product.condition === 'NEW' ? 'success' : 
                  product.condition === 'USED' ? 'warning' : 'secondary'
                }>
                  {product.condition}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-1">
                  Edit
                </Button>
                <Button variant="outline-success" size="sm">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Services Tab Component
function ServicesTab({ services, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-5">
        <Tools size={48} className="text-muted mb-3" />
        <h5>No Services Offered</h5>
        <p className="text-muted">
          You haven't listed any services yet. Start by adding your first service.
        </p>
        <Button variant="primary" as="a" href="/add-service">
          Add Service
        </Button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Service</th>
            <th>Category</th>
            <th>Pricing</th>
            <th>Status</th>
            <th>Requests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>
                <div className="fw-bold">{service.title}</div>
                <div className="small text-muted">
                  {service.description.substring(0, 60)}...
                </div>
              </td>
              <td>{service.category?.name || 'General'}</td>
              <td>
                {service.hourly_rate ? 
                  `KES ${service.hourly_rate}/hr` : 
                  `KES ${service.fixed_price} fixed`
                }
              </td>
              <td>
                <Badge bg="success">Active</Badge>
              </td>
              <td>
                <Badge bg="primary">5 Requests</Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-1">
                  Manage
                </Button>
                <Button variant="outline-success" size="sm">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Reviews Tab Component
function ReviewsTab() {
  return (
    <div className="text-center py-5">
      <Star size={48} className="text-muted mb-3" />
      <h5>Customer Reviews</h5>
      <p className="text-muted">
        You haven't received any reviews yet. Your reviews will appear here once customers rate your services.
      </p>
      <div className="d-flex justify-content-center mt-4">
        <div className="text-center me-5">
          <div className="display-4">4.8</div>
          <div className="text-muted">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="display-4">0</div>
          <div className="text-muted">Total Reviews</div>
        </div>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>ElectroMarket KE</h5>
            <p className="text-muted">
              Connecting Kenyan businesses and customers for all electronics needs.
            </p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/businesses" className="text-decoration-none text-muted">Businesses</Link></li>
              <li><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
              <li><Link to="/services" className="text-decoration-none text-muted">Services</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="text-muted">Email: info@electromarket.co.ke</li>
              <li className="text-muted">Phone: +254 700 123 456</li>
              <li className="text-muted">Nairobi, Kenya</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4 bg-secondary" />
        <p className="text-center text-muted mb-0">
          © {new Date().getFullYear()} ElectroMarket KE. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

// ======================== MAIN APP COMPONENT ======================== //

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 py-4">
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/businesses" element={<BusinessList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/add-business" element={<AddBusiness />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/add-service" element={<AddService />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
