let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 4; // Show 4 products per page

// Check if user is signed in
const isUserSignedIn = JSON.parse(localStorage.getItem('user')) !== null;

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.querySelector('.cart-total');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = ` 
      <div class="item-name">${item.name}</div>
      <div class="item-details">Quantity: ${item.quantity}</div>
      <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(cartItemDiv);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = function() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  if (products.length === 0) {
    document.getElementById('product-list').innerHTML = '<p>No products available</p>';
  } else {
    displayProducts(products);
  }

  // Show user info if signed in
  if (isUserSignedIn) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('user-info').textContent = `Hello, ${user.username}`;
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('auth-form').style.display = 'none';
  } else {
    document.getElementById('auth-form').style.display = 'block';
  }
};

function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);

  productsToDisplay.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-item');
    productDiv.innerHTML = `
      <img src="${product.image}" alt="Product Image">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p class="price">$${product.price}</p>
      <p class="quantity">Available: ${product.quantity}</p>
      <select class="quantity-selector">
        ${Array.from({ length: product.quantity }, (_, i) => i + 1).map(q => `<option value="${q}">${q}</option>`).join('')}
      </select>
      <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}', ${product.quantity})">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });

  // Update page info
  document.getElementById('page-info').textContent = `Page ${currentPage}`;
}

function addToCart(name, price, image, quantity) {
  if (!isUserSignedIn) {
    document.getElementById('auth-form').style.display = 'block';
    return;
  }

  const quantitySelector = document.querySelector('select.quantity-selector');
  const selectedQuantity = parseInt(quantitySelector.value);

  if (isNaN(selectedQuantity) || selectedQuantity <= 0) return;

  const existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += selectedQuantity;
  } else {
    cart.push({ name, price, image, quantity: selectedQuantity });
  }

  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function filterProducts() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const filteredProducts = JSON.parse(localStorage.getItem('products')).filter(product => product.name.toLowerCase().includes(searchQuery));
  displayProducts(filteredProducts);
}

function sortProducts() {
  const priceOrder = document.getElementById('priceFilter').value;
  let products = JSON.parse(localStorage.getItem('products'));

  if (priceOrder === 'low-to-high') {
    products.sort((a, b) => a.price - b.price);
  } else {
    products.sort((a, b) => b.price - a.price);
  }

  displayProducts(products);
}

// Pagination functionality
function changePage(direction) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next' && currentPage < totalPages) {
    currentPage++;
  }

  displayProducts(products);
}

// Handle sign-in or registration
document.getElementById('user-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const user = { username, password };

  const allUsers = JSON.parse(localStorage.getItem('users')) || [];

  // Check if user is registering or logging in
  const isRegistering = document.getElementById('auth-form-title').textContent.includes('Register');
  if (isRegistering) {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;

    if (allUsers.find(u => u.username === username)) {
      alert('Username already exists!');
    } else {
      allUsers.push({ username, password, fullName, email });
      localStorage.setItem('users', JSON.stringify(allUsers));
      alert('Registration successful. You can now sign in.');
    }
  } else {
    const existingUser = allUsers.find(u => u.username === username && u.password === password);
    if (existingUser) {
      localStorage.setItem('user', JSON.stringify(existingUser));
      window.location.reload();
    } else {
      alert('Incorrect username or password');
    }
  }
});

function toggleAuthForm() {
  const title = document.getElementById('auth-form-title');
  const registerFields = document.getElementById('register-fields');

  if (title.textContent === 'Sign In or Register') {
    title.textContent = 'Register';
    registerFields.style.display = 'block';
  } else {
    title.textContent = 'Sign In or Register';
    registerFields.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('user');
  window.location.reload();
}
