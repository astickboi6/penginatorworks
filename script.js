function showTime() {
  document.getElementById('currentTime').innerHTML = new Date().toUTCString();
}
showTime();
setInterval(function () {
  showTime();
}, 1000);

// -------------------- AUTH --------------------
function register() {
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    const error = document.getElementById("register-error");
    error.classList.add("hidden");

    if (!email || !password) {
        error.textContent = "Please enter an email and password.";
        error.classList.remove("hidden");
        return;
    }

    // Check if user already exists
    if (localStorage.getItem("user_" + email)) {
        error.textContent = "Account already exists!";
        error.classList.remove("hidden");
        return;
    }

    // Save user to localStorage
    localStorage.setItem("user_" + email, JSON.stringify({ email, password }));

    alert("Registered successfully! You can now log in.");
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
}

function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const error = document.getElementById("login-error");
    error.classList.add("hidden");

    const user = localStorage.getItem("user_" + email);

    if (!user) {
        error.textContent = "User not found. Please register.";
        error.classList.remove("hidden");
        return;
    }

    const userData = JSON.parse(user);

    if (userData.password !== password) {
        error.textContent = "Incorrect password.";
        error.classList.remove("hidden");
        return;
    }

    // Save login session
    localStorage.setItem("loggedInUser", email);
    updateUI();
}

function logout() {
    localStorage.removeItem("loggedInUser");
    updateUI();
}

// -------------------- COMMENTS --------------------
function submitComment() {
    const commentInput = document.getElementById("comment-input");
    const error = document.getElementById("comment-error");
    error.classList.add("hidden");

    const text = commentInput.value.trim();
    if (!text) {
        error.textContent = "Comment cannot be empty.";
        error.classList.remove("hidden");
        return;
    }

    const userEmail = localStorage.getItem("loggedInUser");
    const comments = JSON.parse(localStorage.getItem("comments") || "[]");

    comments.push({
        email: userEmail,
        text: text,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("comments", JSON.stringify(comments));
    commentInput.value = "";
    renderComments();
}

// -------------------- UI UPDATES --------------------
function updateUI() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const userInfo = document.getElementById("user-info");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const commentForm = document.getElementById("comment-form");
    const commentLoginMessage = document.getElementById("comment-login-message");

    if (loggedInUser) {
        document.getElementById("user-email").textContent = loggedInUser;
        userInfo.classList.remove("hidden");
        loginForm.classList.add("hidden");
        registerForm.classList.add("hidden");

        commentForm.classList.remove("hidden");
        commentLoginMessage.classList.add("hidden");
    } else {
        userInfo.classList.add("hidden");
        loginForm.classList.remove("hidden");
        registerForm.classList.remove("hidden");

        commentForm.classList.add("hidden");
        commentLoginMessage.classList.remove("hidden");
    }

    renderComments();
}

function renderComments() {
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

    const comments = JSON.parse(localStorage.getItem("comments") || "[]");

    comments.forEach(comment => {
        const div = document.createElement("div");
        div.classList.add("comment");

        div.innerHTML = `
            <div class="comment-meta">${comment.email} - ${comment.date}</div>
            <div class="comment-text">${comment.text}</div>
        `;

        commentsList.appendChild(div);
    });
}

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", updateUI);
