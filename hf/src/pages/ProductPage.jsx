// src/pages/ProductPage.jsx
import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import ProductList from '../components/product/ProductList';
import ProductForm from '../components/product/ProductForm';

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [refreshList, setRefreshList] = useState(false);

  const handleSuccess = () => {
    setActiveTab('list');
    setRefreshList(prev => !prev);
  };

  return (
    <Container>
      <h2 className="mb-4">Products Management</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="list" title="My Products">
          <ProductList key={refreshList} />
        </Tab>
        <Tab eventKey="add" title="Add Product">
          <ProductForm onSuccess={handleSuccess} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProductPage;