let currentUser = null;

async function checkAuth() {
  try {
    const response = await fetch('/api/user', {
      credentials: 'include'
    });
    
    if (response.ok) {
      currentUser = await response.json();
      updateUI();
    } else {
      currentUser = null;
      updateUI();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    currentUser = null;
    updateUI();
  }
}

function updateUI() {
  const userInfo = document.getElementById('user-info');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const commentForm = document.getElementById('comment-form');
  const commentLoginMessage = document.getElementById('comment-login-message');
  
  if (currentUser) {
    document.getElementById('user-email').textContent = currentUser.email;
    userInfo.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    commentForm.classList.remove('hidden');
    commentLoginMessage.classList.add('hidden');
  } else {
    userInfo.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.remove('hidden');
    commentForm.classList.add('hidden');
    commentLoginMessage.classList.remove('hidden');
  }
}

async function login() {
  console.log('Login button clicked');
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorElement = document.getElementById('login-error');
  
  console.log('Email:', email);
  
  if (!email || !password) {
    errorElement.textContent = 'Please enter both email and password';
    errorElement.classList.remove('hidden');
    return;
  }
  
  try {
    console.log('Sending login request...');
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    console.log('Login response status:', response.status);
    
    if (response.ok) {
      currentUser = await response.json();
      console.log('Login successful:', currentUser);
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
      errorElement.classList.add('hidden');
      updateUI();
      loadComments();
    } else {
      const error = await response.json();
      console.log('Login error:', error);
      errorElement.textContent = error.error || 'Login failed';
      errorElement.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Login exception:', error);
    errorElement.textContent = 'Login failed. Please try again. Error: ' + error.message;
    errorElement.classList.remove('hidden');
  }
}

async function register() {
  console.log('Register button clicked');
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const errorElement = document.getElementById('register-error');
  
  console.log('Register email:', email);
  
  if (!email || !password) {
    errorElement.textContent = 'Please fill in all fields';
    errorElement.classList.remove('hidden');
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorElement.textContent = 'Please enter a valid email address';
    errorElement.classList.remove('hidden');
    return;
  }
  
  if (password.length < 6) {
    errorElement.textContent = 'Password must be at least 6 characters';
    errorElement.classList.remove('hidden');
    return;
  }
  
  try {
    console.log('Sending registration request...');
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    
    console.log('Register response status:', response.status);
    
    if (response.ok) {
      currentUser = await response.json();
      console.log('Registration successful:', currentUser);
      document.getElementById('register-email').value = '';
      document.getElementById('register-password').value = '';
      errorElement.classList.add('hidden');
      updateUI();
      loadComments();
    } else {
      const error = await response.json();
      console.log('Registration error:', error);
      errorElement.textContent = error.error || 'Registration failed';
      errorElement.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Registration exception:', error);
    errorElement.textContent = 'Registration failed. Please try again. Error: ' + error.message;
    errorElement.classList.remove('hidden');
  }
}

async function logout() {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    currentUser = null;
    updateUI();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

async function loadComments() {
  try {
    const response = await fetch('/api/comments');
    const comments = await response.json();
    
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    
    if (comments.length === 0) {
      commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
      return;
    }
    
    comments.reverse().forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      
      const date = new Date(comment.timestamp).toLocaleString();
      
      commentDiv.innerHTML = `
        <div class="comment-meta">${escapeHtml(comment.userEmail)} - ${date}</div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      `;
      
      commentsList.appendChild(commentDiv);
    });
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

async function submitComment() {
  const text = document.getElementById('comment-input').value;
  const errorElement = document.getElementById('comment-error');
  
  if (!text || text.trim().length === 0) {
    errorElement.textContent = 'Please enter a comment';
    errorElement.classList.remove('hidden');
    return;
  }
  
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    });
    
    if (response.ok) {
      document.getElementById('comment-input').value = '';
      errorElement.classList.add('hidden');
      loadComments();
    } else {
      const error = await response.json();
      errorElement.textContent = error.error || 'Failed to post comment';
      errorElement.classList.remove('hidden');
    }
  } catch (error) {
    errorElement.textContent = 'Failed to post comment. Please try again.';
    errorElement.classList.remove('hidden');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

checkAuth();
loadComments();
