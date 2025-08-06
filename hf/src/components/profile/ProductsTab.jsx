// src/components/profile/ProductsTab.jsx
import React from 'react';
import { Button, Badge, Spinner, Table } from 'react-bootstrap';
import { Box } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ProductsTab = ({ products, loading }) => {
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
        <Button variant="primary" as={Link} to="/add-product">
          Add Product
        </Button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover>
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
                <Button variant="outline-primary" size="sm" className="me-1" as={Link} to={`/products/${product.id}/edit`}>
                  Edit
                </Button>
                <Button variant="outline-success" size="sm" as={Link} to={`/products/${product.id}`}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductsTab;