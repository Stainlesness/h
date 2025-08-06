import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BusinessPage from './pages/BusinessPage';
import BusinessForm from './components/business/BusinessForm';
import ProductPage from './pages/ProductPage';
//import ServicePage from './pages/ServicePage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProductForm from './components/product/ProductForm';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 py-4">
            <Container>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />

                {/* Business Routes */}
                <Route path="/businesses" element={
                  <ProtectedRoute>
                    <BusinessPage />
                  </ProtectedRoute>
                } />
                <Route path="/businesses/new" element={
                  <ProtectedRoute>
                    <BusinessForm />
                  </ProtectedRoute>
                } />
                <Route path="/businesses/:id" element={<BusinessDetailPage />} />
                <Route path="/businesses/:id/edit" element={
                  <ProtectedRoute>
                    <BusinessForm />
                  </ProtectedRoute>
                } />

                {/* Product Routes */}
                <Route path="/products" element={
                  <ProtectedRoute>
                    <ProductPage />
                  </ProtectedRoute>
                } />
                <Route path="/products/new" element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/products/:id/edit" element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } />

                {/* Service Routes */}
                {/* <Route path="/services" element={
                  <ProtectedRoute>
                    <ServicePage />
                  </ProtectedRoute>
                } /> */}
                {/* <Route path="/services/new" element={
                  <ProtectedRoute>
                    <ServiceForm />
                  </ProtectedRoute>
                } /> */}
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                {/* <Route path="/services/:id/edit" element={
                  <ProtectedRoute>
                    <ServiceForm />
                  </ProtectedRoute>
                } /> */}

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;