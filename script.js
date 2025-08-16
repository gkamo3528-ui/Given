// Global variables
let userData = {
    totalEarnings: 0,
    todayEarnings: 0,
    adsWatched: 0,
    activities: [],
    referralCode: 'EARN2024ADX'
};

// DOM Elements
const elements = {
    totalEarnings: document.getElementById('totalEarnings'),
    todayEarnings: document.getElementById('todayEarnings'),
    adsWatched: document.getElementById('adsWatched'),
    totalBalance: document.getElementById('totalBalance'),
    activityList: document.getElementById('activityList'),
    referralCode: document.getElementById('referralCode'),
    copyBtn: document.getElementById('copyBtn'),
    shareBtn: document.getElementById('shareBtn'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    historyBtn: document.getElementById('historyBtn'),
    profileBtn: document.getElementById('profileBtn')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserData();
    initializeEventListeners();
    initializeAdSense();
});

// Initialize application
function initializeApp() {
    console.log('AdEarn App Initializing...');
    updateUI();
    generateRandomStats();
}

// Load user data
function loadUserData() {
    const savedData = localStorage.getItem('adEarnUserData');
    if (savedData) {
        userData = { ...userData, ...JSON.parse(savedData) };
    }

    // Demo activity if first time
    if (userData.activities.length === 0) {
        userData.activities = [
            { description: 'Video Advertisement Watched', amount: 0.05, time: new Date().toLocaleTimeString() }
        ];
    }

    updateUI();
}

// Save data
function saveUserData() {
    localStorage.setItem('adEarnUserData', JSON.stringify(userData));
}

// Update UI
function updateUI() {
    elements.totalEarnings.textContent = userData.totalEarnings.toFixed(2);
    elements.todayEarnings.textContent = userData.todayEarnings.toFixed(2);
    elements.adsWatched.textContent = userData.adsWatched;
    elements.totalBalance.textContent = userData.totalEarnings.toFixed(2);
    updateActivityList();
}

// Update activity list
function updateActivityList() {
    elements.activityList.innerHTML = '';
    userData.activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            <div class="activity-amount">+$${activity.amount.toFixed(2)}</div>
        `;
        elements.activityList.appendChild(item);
    });
}

// Generate random active users
function generateRandomStats() {
    const totalUsers = document.getElementById('totalUsers');
    if (totalUsers) {
        const randomUsers = 12000 + Math.floor(Math.random() * 2000);
        totalUsers.textContent = randomUsers.toLocaleString();
    }
}

// Event listeners
function initializeEventListeners() {
    document.querySelectorAll('.watch-ad-btn').forEach(btn => {
        btn.addEventListener('click', handleWatchAd);
    });

    elements.copyBtn.addEventListener('click', copyReferralCode);
    elements.shareBtn.addEventListener('click', shareReferralLink);
    elements.withdrawBtn.addEventListener('click', handleWithdraw);
    elements.historyBtn.addEventListener('click', showHistory);
    elements.profileBtn.addEventListener('click', showProfile);
}

// Initialize AdSense
function initializeAdSense() {
    if (typeof window.adsbygoogle !== 'undefined') {
        console.log('AdSense loaded ✅');
        setInterval(refreshAds, 60000); // refresh every 60s
    } else {
        console.log('AdSense not loaded, retrying...');
        setTimeout(initializeAdSense, 2000);
    }
}

// Refresh AdSense banners
function refreshAds() {
    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.log('Ad refresh error:', error);
    }
}

// Handle watch ad click
function handleWatchAd(e) {
    const button = e.target;
    const card = button.closest('.ad-card');
    const reward = parseFloat(card.dataset.reward);
    const adTitle = card.querySelector('h4').textContent;

    button.disabled = true;
    let countdown = adTitle.includes("Video") ? 30 :
                    adTitle.includes("Banner") ? 15 :
                    adTitle.includes("Interactive") ? 20 : 45;

    button.textContent = `Watching... ${countdown}s`;

    const timer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            button.textContent = `Watching... ${countdown}s`;
        } else {
            clearInterval(timer);
            button.textContent = "Watched ✅";
            completeAdView(reward, adTitle);
        }
    }, 1000);
}

// Complete ad reward
function completeAdView(reward, adTitle) {
    userData.totalEarnings += reward;
    userData.todayEarnings += reward;
    userData.adsWatched++;

    userData.activities.unshift({
        description: `${adTitle} Watched (+$${reward.toFixed(2)})`,
        amount: reward,
        time: new Date().toLocaleTimeString()
    });

    if (userData.activities.length > 10) {
        userData.activities = userData.activities.slice(0, 10);
    }

    saveUserData();
    updateUI();
    showToast(`You earned $${reward.toFixed(2)} 🎉`);
    triggerConfetti();
}

// Copy referral code
function copyReferralCode() {
    elements.referralCode.select();
    elements.referralCode.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showToast('Referral code copied!');
}

// Share referral link
function shareReferralLink() {
    const referralLink = window.location.href + "?ref=" + userData.referralCode;
    if (navigator.share) {
        navigator.share({ title: 'Join AdEarn', text: 'Earn money by watching ads!', url: referralLink });
    } else {
        navigator.clipboard.writeText(referralLink);
        showToast('Referral link copied!');
    }
} document.getElementById("withdrawBtn").addEventListener("click", function() {
        let totalBalance = parseFloat(document.getElementById("totalBalance").innerText);

        if (totalBalance < 10) {
            alert("Withdrawal minimum is $10. Keep earning!");
        } else {
            alert("Withdrawal request submitted! Processing...");
            // Here you could add more code to actually process withdrawal (if you build that system)
        }
    });
// History
function showHistory() {
    alert('Earnings History:\n\n' +
        userData.activities.map(a => `${a.description} - ${a.time}`).join('\n'));
}

// Profile
function showProfile() {
    alert(`Profile:\nTotal Earnings: $${userData.totalEarnings.toFixed(2)}\nAds Watched: ${userData.adsWatched}\nReferral Code: ${userData.referralCode}`);
}

// Toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Confetti
function triggerConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = '50%';
    confetti.style.left = '50%';
    confetti.style.transform = 'translate(-50%, -50%)';
    confetti.style.fontSize = '2rem';
    confetti.style.zIndex = '9999';
    confetti.innerHTML = '🎉 💰 🎊';
    confetti.style.animation = 'bounce 2s ease-out forwards';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);

    if (!document.getElementById('bounceAnimation')) {
        const style = document.createElement('style');
        style.id = 'bounceAnimation';
        style.textContent = `
            @keyframes bounce {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1) translateY(-100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Daily reset
function checkDailyReset() {
    const lastReset = localStorage.getItem('lastDailyReset');
    const today = new Date().toDateString();
    if (lastReset !== today) {
        userData.todayEarnings = 0;
        localStorage.setItem('lastDailyReset', today);
        saveUserData();
        updateUI();
    }
}
checkDailyReset();
setInterval(saveUserData, 30000);
