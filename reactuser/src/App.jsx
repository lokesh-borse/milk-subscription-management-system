import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Landing from './pages/Landing.jsx';
import Categories from './pages/Categories.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SelectCategory from './pages/subscription/SelectCategory.jsx';
import SelectProduct from './pages/subscription/SelectProduct.jsx';
import SelectQuantity from './pages/subscription/SelectQuantity.jsx';
import SelectDuration from './pages/subscription/SelectDuration.jsx';
import DeliverySlot from './pages/subscription/DeliverySlot.jsx';
import Address from './pages/subscription/Address.jsx';
import Confirm from './pages/subscription/Confirm.jsx';
import Success from './pages/subscription/Success.jsx';
import SubscriptionDetails from './pages/subscription/SubscriptionDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/subscribe/category" element={<PrivateRoute><SelectCategory /></PrivateRoute>} />
            <Route path="/subscribe/product" element={<PrivateRoute><SelectProduct /></PrivateRoute>} />
            <Route path="/subscribe/quantity" element={<PrivateRoute><SelectQuantity /></PrivateRoute>} />
            <Route path="/subscribe/duration" element={<PrivateRoute><SelectDuration /></PrivateRoute>} />
            <Route path="/subscribe/slot" element={<PrivateRoute><DeliverySlot /></PrivateRoute>} />
            <Route path="/subscribe/address" element={<PrivateRoute><Address /></PrivateRoute>} />
            <Route path="/subscribe/confirm" element={<PrivateRoute><Confirm /></PrivateRoute>} />
            <Route path="/subscribe/success" element={<PrivateRoute><Success /></PrivateRoute>} />
            <Route path="/subscription-details/:id" element={<PrivateRoute><SubscriptionDetails /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
