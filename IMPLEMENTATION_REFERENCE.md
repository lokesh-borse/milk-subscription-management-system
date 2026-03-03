# Professional UI Components - Implementation Reference

## Quick Start Guide

This document provides detailed examples and best practices for using the newly implemented professional UI components in the Milkman subscription management system.

---

## Table of Contents

1. [Admin Dashboard Components](#admin-dashboard-components)
2. [User Portal Components](#user-portal-components)
3. [Form Validation Patterns](#form-validation-patterns)
4. [Common Integration Examples](#common-integration-examples)
5. [Styling Guidelines](#styling-guidelines)

---

## Admin Dashboard Components

### 1. Sidebar Navigation

**Location:** `reactadmin/src/components/Sidebar.jsx`

The Sidebar component provides professional navigation with collapsible menus, active state highlighting, and user info display.

**Features:**
- ✅ Collapsible on mobile/tablet
- ✅ Active link highlighting with left border indicator
- ✅ User avatar and logout functionality
- ✅ Icon integration with Lucide React
- ✅ Smooth animations and transitions

**Props:**
```jsx
<Sidebar
  user={user}          // { email: "admin@example.com" }
  onLogout={handler}   // Function to handle logout
/>
```

**Responsive Behavior:**
- **Desktop (>1024px):** Fixed left sidebar (280px width)
- **Tablet/Mobile:** Collapsible hamburger menu overlay

---

### 2. Dashboard Page with Analytics

**Location:** `reactadmin/src/pages/Dashboard.jsx`

The Dashboard delivers KPI metrics, trend visualization, and quick statistics in a professional layout.

**Features:**
- ✅ 4 Stat cards with color-coded icons
- ✅ Subscription trend line chart (6 months)
- ✅ Product category bar chart
- ✅ Quick stats section with key metrics
- ✅ Loading skeletons for perceived performance

**Key Metrics Displayed:**
- Total Customers (with growth percentage)
- Total Products
- Active Subscriptions
- Total Revenue

**Customization:**
Update the mock data in the component:
```jsx
const stats = {
  totalCustomers: 1240,      // Update with API data
  totalProducts: 48,         // Update with API data
  activeSubscriptions: 892,  // Update with API data
  totalRevenue: 54320,       // Update with API data
};
```

---

### 3. Advanced DataTable

**Location:** `reactadmin/src/components/DataTable.jsx`

Production-ready table component with sorting, searching, pagination, and action buttons.

**Features:**
- ✅ Column sorting (ascending/descending)
- ✅ Global search/filter across all columns
- ✅ Pagination (10 rows/page configurable)
- ✅ Edit/Delete action buttons
- ✅ Loading skeleton states
- ✅ Empty state messaging
- ✅ Responsive with horizontal scroll on mobile

**Usage Example:**

```jsx
import DataTable from '../components/DataTable';
import { useState, useEffect } from 'react';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { 
      accessor: 'id', 
      Header: 'ID',
      width: '80px',
      sortable: false 
    },
    { 
      accessor: 'email', 
      Header: 'Email',
      sortable: true 
    },
    { 
      accessor: 'name', 
      Header: 'Full Name',
      sortable: true 
    },
    { 
      accessor: 'phone', 
      Header: 'Phone',
      sortable: false 
    },
    { 
      accessor: 'status', 
      Header: 'Status',
      sortable: true,
      Cell: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    { 
      accessor: 'joinDate', 
      Header: 'Join Date',
      sortable: true,
      Cell: (value) => new Date(value).toLocaleDateString()
    },
  ];

  const handleEdit = (row) => {
    console.log('Edit customer:', row);
    // Navigate to edit page or open modal
  };

  const handleDelete = (row) => {
    if (window.confirm('Are you sure?')) {
      console.log('Delete customer:', row);
      fetchCustomers(); // Refresh list
    }
  };

  return (
    <div className="page-container">
      <h1>Customers</h1>
      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No customers found. Start by adding a new customer."
        actionColumnWidth="140px"
      />
    </div>
  );
};

export default CustomerPage;
```

**Column Configuration:**
```jsx
{
  accessor: 'fieldName',           // Property to access in data object
  Header: 'Display Name',          // Column header text
  width: '150px',                  // Optional: Column width
  sortable: true,                  // Optional: Enable/disable sorting
  Cell: (value, row) => {          // Optional: Custom cell renderer
    return <CustomComponent />;
  }
}
```

---

## User Portal Components

### 1. ProductCard Component

**Location:** `reactuser/src/components/ProductCard.jsx`

Enhanced product display with interactive features and professional styling.

**Features:**
- ✅ Image with hover zoom effect
- ✅ Product badge (Popular, New, Sale)
- ✅ Favorite/wishlist toggle button
- ✅ 5-star rating display
- ✅ Review count
- ✅ Hover overlay with action buttons
- ✅ Category badge with color coding
- ✅ Loading skeleton state

**Props:**
```jsx
<ProductCard
  id="1"                           // Unique product ID
  name="Organic Milk 1L"          // Product name
  price={3.99}                     // Price in dollars
  image="https://..."              // Product image URL
  category="organic"               // milk, organic, yogurt, cheese, butter, cream
  rating={4.5}                     // 0-5 star rating
  reviewCount={128}                // Number of reviews
  badge="Popular"                  // "Popular", "New", "Sale"
  isFavorite={false}               // Is favorited
  onFavoriteToggle={handler}       // (productId, isFavorite) => {}
  onViewDetails={handler}          // (productId) => {}
  onAddToCart={handler}            // (productId) => {}
  isLoading={false}                // Show loading skeleton
/>
```

**Integration Example:**

```jsx
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = (productId, isFavorite) => {
    // Update favorites in your context or database
    console.log(`Product ${productId} favorite: ${isFavorite}`);
  };

  const handleViewDetails = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    // Add to cart in your context
    console.log('Added to cart:', product);
  };

  return (
    <div className="products-container">
      <h1>Our Products</h1>
      <div className="products-grid">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <ProductCard key={i} isLoading={true} />
          ))
        ) : (
          products.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              onFavoriteToggle={handleFavoriteToggle}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

**Styling the Grid:**
```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 12px;
  }
}
```

---

### 2. Form Components

**Location:** `reactuser/src/components/Form/`

Complete form solution with validation states, custom styling, and accessibility support.

#### FormInput

```jsx
import { FormInput } from '../components/Form';
import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length === 0) {
      // Submit form
      console.log('Form submitted:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        success={formData.email && validateEmail(formData.email)}
        required
        hint="We'll never share your email"
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        success={formData.password && validatePassword(formData.password)}
        required
        hint="Minimum 8 characters"
      />

      <button type="submit" className="btn-primary">
        Sign In
      </button>
    </form>
  );
};
```

#### FormSelect

```jsx
import { FormSelect } from '../components/Form';
import { useState } from 'react';

const SubscriptionForm = () => {
  const [category, setCategory] = useState('');

  const categoryOptions = [
    { value: 'milk', label: 'Regular Milk' },
    { value: 'organic', label: 'Organic Milk' },
    { value: 'yogurt', label: 'Yogurt' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'butter', label: 'Butter' },
    { value: 'cream', label: 'Cream' },
  ];

  return (
    <FormSelect
      label="Product Category"
      name="category"
      options={categoryOptions}
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      placeholder="Select a category..."
      required
      hint="Choose the type of product you want"
    />
  );
};
```

#### FormTextarea

```jsx
import { FormTextarea } from '../components/Form';
import { useState } from 'react';

const ReviewForm = () => {
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const value = e.target.value;
    setReview(value);
    
    // Validate minimum length
    if (value.length < 10) {
      setErrors({ ...errors, review: 'Review must be at least 10 characters' });
    } else {
      setErrors({});
    }
  };

  return (
    <FormTextarea
      label="Product Review"
      name="review"
      value={review}
      onChange={handleChange}
      error={errors.review}
      success={review.length >= 10}
      maxLength={500}
      rows={5}
      placeholder="Share your experience with this product..."
      required
      hint="Helpful reviews get more visibility"
    />
  );
};
```

---

### 3. ProgressStepper Component

**Location:** `reactuser/src/components/ProgressStepper.jsx`

Visual progress indicator for multi-step processes with step numbering and completion tracking.

**Features:**
- ✅ Numbered step circles
- ✅ Current step highlighting
- ✅ Completed step checkmarks
- ✅ Connection lines between steps
- ✅ Step labels with optional descriptions
- ✅ Responsive layout

**Integration Example:**

```jsx
import ProgressStepper from '../components/ProgressStepper';
import { useLocation } from 'react-router-dom';

const SubscriptionWizard = () => {
  const location = useLocation();

  const stepMap = {
    '/subscribe/category': 1,
    '/subscribe/product': 2,
    '/subscribe/quantity': 3,
    '/subscribe/duration': 4,
    '/subscribe/slot': 5,
    '/subscribe/address': 6,
    '/subscribe/confirm': 7,
    '/subscribe/success': 8,
  };

  const currentStep = stepMap[location.pathname] || 1;

  const steps = [
    { 
      id: 'category', 
      label: 'Category', 
      description: 'Choose product type' 
    },
    { 
      id: 'product', 
      label: 'Product', 
      description: 'Select specific product' 
    },
    { 
      id: 'quantity', 
      label: 'Quantity', 
      description: 'Pick amount' 
    },
    { 
      id: 'duration', 
      label: 'Duration', 
      description: 'Subscription length' 
    },
    { 
      id: 'slot', 
      label: 'Delivery', 
      description: 'Select time slot' 
    },
    { 
      id: 'address', 
      label: 'Address', 
      description: 'Shipping location' 
    },
    { 
      id: 'confirm', 
      label: 'Confirm', 
      description: 'Review order' 
    },
    { 
      id: 'success', 
      label: 'Success', 
      description: 'Order complete' 
    },
  ];

  return (
    <div className="subscription-wizard">
      <ProgressStepper
        currentStep={currentStep}
        steps={steps}
        orientation="horizontal"
      />
      
      {/* Page-specific content */}
      <div className="step-content">
        {/* Route-specific component */}
      </div>
    </div>
  );
};
```

---

### 4. Skeleton Loading Component

**Location:** `reactuser/src/components/Skeleton.jsx`

Shimmer loading placeholders for improved perceived performance.

**Usage:**

```jsx
import Skeleton from '../components/Skeleton';

const ProductGrid = ({ isLoading, products }) => {
  if (isLoading) {
    return (
      <div className="products-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <Skeleton height="200px" borderRadius="8px" />
            <Skeleton height="16px" style={{ marginTop: '12px' }} />
            <Skeleton height="14px" count={2} style={{ marginTop: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
```

---

## Form Validation Patterns

### Complete Form Example with All Validations

```jsx
import { useState } from 'react';
import { FormInput, FormSelect, FormTextarea } from '../components/Form';

const CompleteForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    category: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is modified
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value) {
          newErrors.firstName = 'First name is required';
        } else if (value.length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (!value) {
          newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone must be 10 digits';
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
    });

    // If no errors, submit
    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <FormInput
          label="First Name"
          name="firstName"
          type="text"
          placeholder="John"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && errors.firstName}
          success={touched.firstName && formData.firstName && !errors.firstName}
          required
        />

        <FormInput
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Doe"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && errors.lastName}
          required
        />
      </div>

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
        success={touched.email && formData.email && !errors.email}
        required
      />

      <FormSelect
        label="Category"
        name="category"
        options={[
          { value: 'milk', label: 'Milk' },
          { value: 'yogurt', label: 'Yogurt' },
        ]}
        value={formData.category}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.category && errors.category}
        required
      />

      <FormTextarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={500}
        error={touched.message && errors.message}
        required
      />

      <button type="submit" className="btn-primary">
        Submit
      </button>
    </form>
  );
};

export default CompleteForm;
```

---

## Common Integration Examples

### Converting Bootstrap Tables to DataTable

**Before:**
```jsx
<table className="table table-striped">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**After:**
```jsx
import DataTable from '../components/DataTable';

const columns = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' },
  { accessor: 'email', Header: 'Email' },
];

<DataTable
  columns={columns}
  data={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### Creating a Product Grid with ProductCard

```jsx
const styles = `
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
`;

<div className="product-grid">
  {products.map(product => (
    <ProductCard
      key={product.id}
      {...product}
      onFavoriteToggle={handleFavorite}
      onViewDetails={handleView}
      onAddToCart={handleCart}
    />
  ))}
</div>
```

## Styling Guidelines

### CSS Variables

All components use CSS custom properties for theming:

```css
:root {
  --primary-blue: #3b82f6;
  --dark-blue: #1e40af;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --shadow-light: 0 4px 12px rgba(0, 0, 0, 0.08);
  --transition: 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

### Responsive Grid

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
```

---

## Best Practices

1. **Always provide loading states** - Use Skeleton component or loading prop
2. **Handle errors gracefully** - Show error messages clearly
3. **Test on mobile** - All components are responsive by default
4. **Use semantic HTML** - Components include proper ARIA labels
5. **Optimize performance** - Use React.memo for lists, lazy load if needed
6. **Validate early** - Use onBlur for form validation feedback
7. **Provide feedback** - Show success states, loading states, and errors

---

For questions or updates, refer to the main COMPONENT_INTEGRATION_GUIDE.md file.
