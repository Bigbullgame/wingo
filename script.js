// Welcome Screen Animation
const welcomeText = "Welcome To Earning Loot";
const welcomeElement = document.getElementById('welcomeText');
let index = 0;

function typeWelcomeText() {
    if (index < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(index);
        index++;
        setTimeout(typeWelcomeText, 120); // Speed of typing
    } else {
        setTimeout(() => {
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('loginPanel').style.display = 'block';
        }, 1000); // Wait 2 seconds before showing login panel
    }
}

// Start Welcome Animation
typeWelcomeText();

// Show Register Panel
function showRegister() {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('registerPanel').style.display = 'block';
}

// Show Login Panel
function showLogin() {
    document.getElementById('registerPanel').style.display = 'none';
    document.getElementById('loginPanel').style.display = 'block';
}

// Register Function
function register() {
    const mobile = document.getElementById('registerMobile').value;
    const password = document.getElementById('registerPassword').value;

    if (mobile && password) {
        localStorage.setItem('mobile', mobile);
        localStorage.setItem('password', password);
        localStorage.setItem('balance', 0);
        localStorage.setItem('lastEarned', 0);
        alert('Account created successfully!');
        showLogin();
    } else {
        alert('Please fill in all fields.');
    }
}

// Login Function
function login() {
    const mobile = document.getElementById('loginMobile').value;
    const password = document.getElementById('loginPassword').value;

    const storedMobile = localStorage.getItem('mobile');
    const storedPassword = localStorage.getItem('password');

    if (mobile === storedMobile && password === storedPassword) {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        updateBalance();
    } else {
        alert('Invalid mobile number or password.');
    }
}

// Open YouTube and Add Balance
function openYouTube() {
    const lastEarned = localStorage.getItem('lastEarned');
    const currentTime = new Date().getTime();

    if (!lastEarned || (currentTime - lastEarned) >= 24 * 60 * 60 * 1000) {
        window.open('https://www.youtube.com', '_blank');
        addBalance();
        localStorage.setItem('lastEarned', currentTime);
    } else {
        alert('You can only earn once every 24 hours.');
    }
}

// Add Balance
function addBalance() {
    let balance = parseInt(localStorage.getItem('balance')) || 0;
    balance += 500;
    localStorage.setItem('balance', balance);
    updateBalance();
}

// Update Balance Display
function updateBalance() {
    const balance = parseInt(localStorage.getItem('balance')) || 0;
    document.getElementById('balance').innerText = balance;
}

// Show Withdraw Popup
function showWithdrawPopup() {
    document.getElementById('withdrawPopup').style.display = 'flex';
}

// Close Withdraw Popup
function closeWithdrawPopup() {
    document.getElementById('withdrawPopup').style.display = 'none';
}

// Open Telegram
function openTelegram() {
    window.open('https://t.me/', '_blank');
}

// Logout
function logout() {
    localStorage.removeItem('mobile');
    localStorage.removeItem('password');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPanel').style.display = 'block';
}
