// Global variables
let userData = {
    totalEarnings: 0,
    todayEarnings: 0,
    adsWatched: 0,
    activities: [],
    referralCode: 'EARN2024ADX'
};

// AdMob Configuration - Replace with your actual IDs
const adMobConfig = {
    publisherId: 'ca-pub-3304308602726227', // Replace with your AdSense Publisher ID
    bannerAdId: '6405996717',         // Replace with your Banner Ad Unit ID
    interstitialAdId: '6934294535'    // Replace with your Interstitial Ad Unit ID
};

// DOM Elements
const elements = {
    totalEarnings: document.getElementById('totalEarnings'),
    todayEarnings: document.getElementById('todayEarnings'),
    adsWatched: document.getElementById('adsWatched'),
    totalBalance: document.getElementById('totalBalance'),
    activityList: document.getElementById('activityList'),
    adModal: document.getElementById('adModal'),
    closeModal: document.getElementById('closeModal'),
    adTimer: document.getElementById('adTimer'),
    adContent: document.getElementById('adContent'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    referralCode: document.getElementById('referralCode'),
    copyBtn: document.getElementById('copyBtn'),
    shareBtn: document.getElementById('shareBtn'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    historyBtn: document.getElementById('historyBtn'),
    profileBtn: document.getElementById('profileBtn')
};

// Initialize the app
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

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('adEarnUserData');
    if (savedData) {
        userData = { ...userData, ...JSON.parse(savedData) };
    }
    
    // Initialize with demo data if first time
    if (userData.activities.length === 0) {
        userData.activities = [
            {
                description: 'Video Advertisement Watched',
                amount: 0.05,
                time: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString()
            },
            {
                description: 'Banner Ad Viewed',
                amount: 0.03,
                time: new Date(Date.now() - 1000 * 60 * 60).toLocaleTimeString()
            },
            {
                description: 'Interactive Ad Completed',
                amount: 0.08,
                time: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleTimeString()
            }
        ];
    }
    
    updateUI();
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('adEarnUserData', JSON.stringify(userData));
}

// Update UI elements
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
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            <div class="activity-amount">+$${activity.amount.toFixed(2)}</div>
        `;
        elements.activityList.appendChild(activityItem);
    });
}

// Generate random stats for demo
function generateRandomStats() {
    const totalUsers = document.getElementById('totalUsers');
    if (totalUsers) {
        const randomUsers = 12000 + Math.floor(Math.random() * 2000);
        totalUsers.textContent = randomUsers.toLocaleString();
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Watch ad buttons
    document.querySelectorAll('.watch-ad-btn').forEach(btn => {
        btn.addEventListener('click', handleWatchAd);
    });
    
    // Modal controls
    elements.closeModal.addEventListener('click', closeAdModal);
    elements.adModal.addEventListener('click', function(e) {
        if (e.target === elements.adModal) {
            closeAdModal();
        }
    });
    
    // Referral controls
    elements.copyBtn.addEventListener('click', copyReferralCode);
    elements.shareBtn.addEventListener('click', shareReferralLink);
    
    // Account controls
    elements.withdrawBtn.addEventListener('click', handleWithdraw);
    elements.historyBtn.addEventListener('click', showHistory);
    elements.profileBtn.addEventListener('click', showProfile);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAdModal();
        }
    });
}

// Initialize AdSense
function initializeAdSense() {
    // Check if AdSense is loaded
    if (typeof window.adsbygoogle !== 'undefined') {
        console.log('AdSense loaded successfully');
        
        // Refresh ads periodically
        setInterval(refreshAds, 60000); // Refresh every minute
        
        // Load interstitial ads
        loadInterstitialAd();
    } else {
        console.log('AdSense not loaded, retrying...');
        setTimeout(initializeAdSense, 2000);
    }
}

// Refresh banner ads
function refreshAds() {
    try {
        // Push new ad requests
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.log('Ad refresh error:', error);
    }
}

// Load interstitial ad
function loadInterstitialAd() {
    // In a real implementation, you would load actual interstitial ads
    console.log('Loading interstitial ad...');
    
    // Simulate ad loading
    setTimeout(() => {
        console.log('Interstitial ad loaded and ready');
    }, 2000);
}

// Handle watch ad button click
function handleWatchAd(e) {
    const button = e.target;
    const card = button.closest('.ad-card');
    const reward = parseFloat(card.dataset.reward);
    const adType = button.dataset.type;
    
    button.disabled = true;
    button.textContent = 'Loading...';
    
    // Simulate ad loading delay
    setTimeout(() => {
        showAdModal(adType, reward);
        button.disabled = false;
        button.textContent = 'Watch Now';
    }, 1500);
}

// Show ad modal
function showAdModal(adType, reward) {
    elements.adModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    let timeLeft = adType === 'interstitial' ? 30 : 15;
    elements.adTimer.textContent = timeLeft;
    
    // Load ad content based on type
    loadAdContent(adType);
    
    // Start countdown
    const timer = setInterval(() => {
        timeLeft--;
        elements.adTimer.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            completeAdView(reward);
            closeAdModal();
        }
    }, 1000);
    
    // Store timer for cleanup
    elements.adModal.timer = timer;
}

// Load ad content
function loadAdContent(adType) {
    if (adType === 'interstitial') {
        // In real implementation, load actual interstitial ad
        elements.adContent.innerHTML = `
            <div class="interstitial-ad">
                <h3>🎮 Game Advertisement</h3>
                <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 2rem; border-radius: 12px; margin: 1rem 0;">
                    <h4>Epic Adventure Game</h4>
                    <p>Join millions of players in the ultimate RPG experience!</p>
                    <div style="margin-top: 1rem;">
                        <button style="background: rgba(255,255,255,0.2); border: none; padding: 0.5rem 1rem; border-radius: 6px; color: white; cursor: pointer;">
                            Download Now
                        </button>
                    </div>
                </div>
                <p style="color: #666; font-size: 0.9rem;">Advertisement will end in <span id="adCountdown"></span> seconds</p>
            </div>
        `;
    } else {
        // Banner ad content
        elements.adContent.innerHTML = `
            <div class="banner-ad-content">
                <div style="background: #f0f8ff; border: 2px dashed #4682b4; padding: 2rem; border-radius: 8px; text-align: center;">
                    <h4 style="color: #4682b4;">📱 Mobile App Advertisement</h4>
                    <p style="color: #666;">Discover amazing deals and offers!</p>
                    <small style="color: #999;">Banner Advertisement</small>
                </div>
            </div>
        `;
    }
}

// Complete ad view and reward user
function completeAdView(reward) {
    userData.totalEarnings += reward;
    userData.todayEarnings += reward;
    userData.adsWatched++;
    
    // Add activity
    userData.activities.unshift({
        description: `Advertisement Watched (+$${reward.toFixed(2)})`,
        amount: reward,
        time: new Date().toLocaleTimeString()
    });
    
    // Keep only last 10 activities
    if (userData.activities.length > 10) {
        userData.activities = userData.activities.slice(0, 10);
    }
    
    saveUserData();
    updateUI();
    showToast(`Congratulations! You earned $${reward.toFixed(2)}`, 'success');
    
    // Trigger confetti effect
    triggerConfetti();
}

// Close ad modal
function closeAdModal() {
    elements.adModal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Clear any running timers
    if (elements.adModal.timer) {
        clearInterval(elements.adModal.timer);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Copy referral code
function copyReferralCode() {
    elements.referralCode.select();
    document.execCommand('copy');
    showToast('Referral code copied to clipboard!');
}

// Share referral link
function shareReferralLink() {
    const referralLink = `https://adearn.com/ref/${userData.referralCode}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join AdEarn - Make Money Watching Ads',
            text: 'I\'m earning money watching ads on AdEarn. Join me and start earning too!',
            url: referralLink
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(referralLink).then(() => {
            showToast('Referral link copied to clipboard!');
        });
    }
}

// Handle withdraw
function handleWithdraw() {
    if (userData.totalEarnings < 10.00) {
        showToast('Minimum withdrawal amount is $10.00', 'error');
        return;
    }
    
    // Simulate withdrawal process
    showToast('Withdrawal request submitted! Processing may take 1-3 business days.', 'success');
    
    // Add withdrawal to activities
    userData.activities.unshift({
        description: `Withdrawal Request (-$${userData.totalEarnings.toFixed(2)})`,
        amount: -userData.totalEarnings,
        time: new Date().toLocaleTimeString()
    });
    
    userData.totalEarnings = 0;
    saveUserData();
    updateUI();
}

// Show history
function showHistory() {
    alert('Earnings History:\n\n' + 
          userData.activities.map(activity => 
              `${activity.description} - ${activity.time}`
          ).join('\n'));
}

// Show profile
function showProfile() {
    alert(`Profile Information:\n\n` +
          `Total Earnings: $${userData.totalEarnings.toFixed(2)}\n` +
          `Ads Watched: ${userData.adsWatched}\n` +
          `Referral Code: ${userData.referralCode}\n` +
          `Member Since: ${new Date().toLocaleDateString()}`);
}

// Trigger confetti effect
function triggerConfetti() {
    // Simple confetti effect using CSS
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = '50%';
    confetti.style.left = '50%';
    confetti.style.transform = 'translate(-50%, -50%)';
    confetti.style.fontSize = '2rem';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.innerHTML = '🎉 💰 🎊';
    confetti.style.animation = 'bounce 2s ease-out forwards';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
    
    // Add bounce animation if not exists
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

// Auto-save user data periodically
setInterval(saveUserData, 30000); // Save every 30 seconds

// Reset daily earnings at midnight
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

// Check for daily reset on load
checkDailyReset();

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Page loaded in:', performance.now(), 'ms');
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', function() {
    showToast('Connection restored! You can continue earning.', 'success');
});

window.addEventListener('offline', function() {
    showToast('You are offline. Some features may not work.', 'warning');
});

// Prevent right-click and console access (optional security)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        showToast('Developer tools are disabled for security.', 'warning');
    }
});

// Export functions for testing (development only)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        userData,
        updateUI,
        completeAdView,
        showToast
    };
}