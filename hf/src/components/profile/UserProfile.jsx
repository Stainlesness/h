// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Tab, Nav, Spinner,
  Button, ListGroup, Badge, Alert
} from 'react-bootstrap';
import { Person, Shop, Gear, Box, Tools, Star, GeoAlt } from 'react-bootstrap-icons';

const API_BASE = 'http://localhost:8000/api';

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
                <Nav variant="tabs" defaultActiveKey="businesses">
                  <Nav.Item>
                    <Nav.Link eventKey="businesses">
                      <Shop className="me-2" /> My Businesses
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products">
                      <Box className="me-2" /> My Products
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="services">
                      <Tools className="me-2" /> My Services
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="reviews">
                      <Star className="me-2" /> Reviews
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
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

function ReviewsTab() {
  // Placeholder for reviews functionality
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

export default UserProfile;
