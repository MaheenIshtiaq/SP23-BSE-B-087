// Global variables
let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 5;
let cart = [];

// Fetch products from admin API
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    products = data;
    filteredProducts = [...products]; // Initialize filtered products
    displayProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Display products on the page
function displayProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Clear the product list

  // Paginate the products
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

  productsToDisplay.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-item');

    productDiv.innerHTML = `
      <img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">$${product.price}</p>
      <button onclick="addToCart('${product._id}')">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });

  // Update pagination info
  document.getElementById('page-info').textContent = `Page ${currentPage}`;
}

// Change page for pagination
function changePage(direction) {
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next' && currentPage * productsPerPage < filteredProducts.length) {
    currentPage++;
  }
  displayProducts();
}

// Filter products by search
function filterProducts() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchInput) || product.description.toLowerCase().includes(searchInput)
  );
  currentPage = 1; // Reset to the first page when search is applied
  displayProducts();
}

// Sort products by price
function sortProducts() {
  const priceFilter = document.getElementById('priceFilter').value;

  if (priceFilter === 'low-to-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceFilter === 'high-to-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  displayProducts();
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  cart.push(product);
  updateCart();
}

// Update cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = ''; // Clear existing cart items

  let total = 0;
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <p>${item.name}</p>
      <p>$${item.price}</p>
    `;
    cartItems.appendChild(cartItem);
    total += item.price;
  });

  // Display total price
  document.querySelector('.cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Handle user authentication (placeholder)
function toggleAuthForm() {
  const authForm = document.getElementById('auth-form');
  const registerFields = document.getElementById('register-fields');
  const authFormTitle = document.getElementById('auth-form-title');
  
  if (registerFields.style.display === 'none') {
    registerFields.style.display = 'block';
    authFormTitle.textContent = 'Register';
  } else {
    registerFields.style.display = 'none';
    authFormTitle.textContent = 'Sign In';
  }
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});
