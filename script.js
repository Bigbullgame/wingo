// Welcome Screen Animation
const welcomeText = "Welcome To Earning Loot";
const welcomeElement = document.getElementById('welcomeText');
let index = 0;

function typeWelcomeText() {
    if (index < welcomeText.length) {
        welcomeElement.innerHTML += welcomeText.charAt(index);
        index++;
        setTimeout(typeWelcomeText, 160); // Speed of typing
    } else {
        setTimeout(() => {
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('loginPanel').style.display = 'block';
        }, 1000); // Wait 1 second before showing login panel
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

// Predefined Users with their initial balances
const predefinedUsers = [
    { id: "user1", password: "pass1", balance: 30, lastEarned: 0 },
    { id: "user2", password: "pass2", balance: 30, lastEarned: 0 },
    { id: "user3", password: "pass3", balance: 30, lastEarned: 0 },
    { id: "user4", password: "pass4", balance: 30, lastEarned: 0 },
    { id: "user5", password: "pass5", balance: 30, lastEarned: 0 },
    { id: "user6", password: "pass6", balance: 30, lastEarned: 0 },
    { id: "user7", password: "pass7", balance: 30, lastEarned: 0 },
    { id: "user8", password: "pass8", balance: 30, lastEarned: 0 },
    { id: "user9", password: "pass9", balance: 30, lastEarned: 0 },
    { id: "user10", password: "pass10", balance: 30, lastEarned: 0 }
];

// Save predefined users to localStorage on first load
if (!localStorage.getItem('predefinedUsers')) {
    localStorage.setItem('predefinedUsers', JSON.stringify(predefinedUsers));
}

// Withdraw Requests Data
if (!localStorage.getItem('withdrawRequests')) {
    localStorage.setItem('withdrawRequests', JSON.stringify([]));
}

// Login Function
function login() {
    const mobile = document.getElementById('loginMobile').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('predefinedUsers'));

    const user = users.find(u => u.id === mobile && u.password === password);

    if (user) {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateBalance();
        startTimer();
        loadWithdrawHistory();
    } else {
        showCustomAlert('Invalid ID or password.');
    }
}

// Open YouTube and Add Balance
function openYouTube() {
    const users = JSON.parse(localStorage.getItem('predefinedUsers'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        const lastEarned = users[userIndex].lastEarned;
        const currentTime = new Date().getTime();

        if (!lastEarned || (currentTime - lastEarned) >= 24 * 60 * 60 * 1000) {
            window.open('https://www.youtube.com', '_blank');
            users[userIndex].balance += 200; // Add 200 rupees
            users[userIndex].lastEarned = currentTime;
            localStorage.setItem('predefinedUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            updateBalance();
            startTimer();
        } else {
            showCustomAlert('You can only earn once every 24 hours.');
        }
    }
}

// Update Balance Display
function updateBalance() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('balance').innerText = currentUser.balance;
    }
}

// Open Withdraw Form
function openWithdrawForm() {
    document.getElementById('withdrawFormPopup').style.display = 'flex';
}

// Close Withdraw Form
function closeWithdrawForm() {
    document.getElementById('withdrawFormPopup').style.display = 'none';
}

// Submit Withdraw Form
function submitWithdrawForm(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get form values
    const amount = parseFloat(document.getElementById('amount').value);
    const name = document.getElementById('name').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const ifscCode = document.getElementById('ifscCode').value;

    // Check if amount is valid
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (amount > currentUser.balance) {
        showCustomAlert('Insufficient balance!');
        return;
    }

    // Subtract amount from balance
    const users = JSON.parse(localStorage.getItem('predefinedUsers'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].balance -= amount;
        localStorage.setItem('predefinedUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        updateBalance();
    }

    // Create withdraw request
    const withdrawRequest = {
        userId: currentUser.id,
        amount: amount,
        name: name,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        status: 'Pending', // Initial status
        timestamp: new Date().toLocaleString()
    };

    // Save withdraw request
    const withdrawRequests = JSON.parse(localStorage.getItem('withdrawRequests'));
    withdrawRequests.push(withdrawRequest);
    localStorage.setItem('withdrawRequests', JSON.stringify(withdrawRequests));

    // Show success message
    showCustomAlert('Withdraw request submitted successfully!');
    closeWithdrawForm();
    loadWithdrawHistory();
}

// Load Withdraw History
function loadWithdrawHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const withdrawRequests = JSON.parse(localStorage.getItem('withdrawRequests'));
    const userRequests = withdrawRequests.filter(request => request.userId === currentUser.id);

    const withdrawList = document.getElementById('withdrawList');
    withdrawList.innerHTML = '';

    userRequests.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.className = 'withdraw-item';
        requestItem.innerHTML = `
            <p>Amount: ₹${request.amount}</p>
            <p>Status: ${request.status}</p>
            <p>Date: ${request.timestamp}</p>
        `;
        withdrawList.appendChild(requestItem);
    });
}

// Open Telegram
function openTelegram() {
    window.open('https://t.me/Earninglooter9099', '_blank');
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPanel').style.display = 'block';
}

// Custom Alert Box
function showCustomAlert(message) {
    const alertBox = document.getElementById('customAlert');
    document.getElementById('alertMessage').innerText = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

// Timer Function with Announcement
function startTimer() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const lastEarned = currentUser.lastEarned;
    const timerElement = document.getElementById('timer');

    const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const nextEarnTime = parseInt(lastEarned) + 24 * 60 * 60 * 1000;
        const remainingTime = nextEarnTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerElement.innerText = 'You can earn now!';
            return;
        }

        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        timerElement.innerText = `Next earn in: ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);

    // Create Announcement Bar
    const announcementBar = document.createElement('div');
    announcementBar.id = 'announcementBar';
    announcementBar.style.position = 'fixed';
    announcementBar.style.top = '0';
    announcementBar.style.left = '0';
    announcementBar.style.width = '100%';
    announcementBar.style.backgroundColor = 'black';
    announcementBar.style.color = 'white';
    announcementBar.style.textAlign = 'center';
    announcementBar.style.padding = '10px';
    announcementBar.style.fontSize = '1.2em';
    announcementBar.style.zIndex = '1000';
    document.body.prepend(announcementBar); // Add announcement bar to the top of the body

    // Random Announcement Function
    function showRandomAnnouncement() {
        const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Random 10-digit number
        const maskedNumber = `+91${'*'.repeat(7)}`; // Masked number (+91*******)
        const randomAmount = Math.floor(500 + Math.random() * 1500); // Random amount between 500 and 2000

        const announcements = [
            `User ${randomNumber} just earned 200!`,
            `Withdrawn: ${randomAmount} by ${maskedNumber}`,
            `New withdrawal: ${randomAmount} by ${maskedNumber}`,
            `User ${maskedNumber} earned 200!`,
            `Withdrawn: ${randomAmount} by User ${randomNumber}`
        ];

        const randomIndex = Math.floor(Math.random() * announcements.length);
        announcementBar.innerText = announcements[randomIndex];
    }

    // Show random announcement every 2 seconds
    setInterval(showRandomAnnouncement, 2000);
    showRandomAnnouncement(); // Show immediately
}

// Admin Panel Functions
const ADMIN_PASSWORD = "admin123"; // Change this to a strong password

// Admin Login Function
function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLoginPanel').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadWithdrawRequests();
    } else {
        showCustomAlert('Invalid Admin Password!');
    }
}

// Admin Logout Function
function adminLogout() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginPanel').style.display = 'block';
}

// Load Withdraw Requests in Admin Panel
function loadWithdrawRequests() {
    const withdrawRequests = JSON.parse(localStorage.getItem('withdrawRequests'));
    const withdrawRequestsDiv = document.getElementById('withdrawRequests');
    withdrawRequestsDiv.innerHTML = '';

    withdrawRequests.forEach((request, index) => {
        const requestItem = document.createElement('div');
        requestItem.className = 'withdraw-request-item';
        requestItem.innerHTML = `
            <p>User ID: ${request.userId}</p>
            <p>Amount: ₹${request.amount}</p>
            <p>Status: ${request.status}</p>
            <p>Date: ${request.timestamp}</p>
            <select id="status-${index}" onchange="updateWithdrawStatus(${index})">
                <option value="Pending" ${request.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Success" ${request.status === 'Success' ? 'selected' : ''}>Success</option>
                <option value="Rejected" ${request.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
        `;
        withdrawRequestsDiv.appendChild(requestItem);
    });
}

// Update Withdraw Request Status
function updateWithdrawStatus(index) {
    const withdrawRequests = JSON.parse(localStorage.getItem('withdrawRequests'));
    const status = document.getElementById(`status-${index}`).value;
    withdrawRequests[index].status = status;
    localStorage.setItem('withdrawRequests', JSON.stringify(withdrawRequests));
    loadWithdrawRequests();
}
