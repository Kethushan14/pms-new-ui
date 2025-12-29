// Main JavaScript file for Ovia PMS Dashboard

// Update current time and date
function updateDateTime() {
    const now = new Date();
    
    // Format time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = formattedTime;
    }
    
    // Format system time (24-hour format)
    const systemTimeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const systemTime = now.toLocaleTimeString('en-US', systemTimeOptions);
    const systemTimeElement = document.getElementById('systemTime');
    if (systemTimeElement) {
        systemTimeElement.textContent = systemTime;
    }
    
    // Format date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = formattedDate;
    }
}

// Update user status
function updateUserStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    if (!statusIndicator) return;
    
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');
    
    switch(status) {
        case 'online':
            statusDot.style.backgroundColor = '#4ade80';
            statusText.textContent = 'Online';
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('away', 'offline');
            break;
        case 'away':
            statusDot.style.backgroundColor = '#f59e0b';
            statusText.textContent = 'Away';
            statusIndicator.classList.add('away');
            statusIndicator.classList.remove('online', 'offline');
            break;
        case 'offline':
            statusDot.style.backgroundColor = '#ef4444';
            statusText.textContent = 'Offline';
            statusIndicator.classList.add('offline');
            statusIndicator.classList.remove('online', 'away');
            break;
    }
    
    // Update status in footer
    const footerStatus = document.querySelector('footer .text-success');
    if (footerStatus) {
        footerStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        footerStatus.className = `text-${status === 'online' ? 'success' : status === 'away' ? 'warning' : 'danger'}`;
    }
    
    // Store status in localStorage
    localStorage.setItem('userStatus', status);
}

// Switch user role
function switchUserRole(role) {
    console.log(`Switching to ${role} role`);
    
    // Update UI based on role
    const roleElements = document.querySelectorAll('[data-role]');
    roleElements.forEach(element => {
        if (element.dataset.role === role || !element.dataset.role) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
    
    // Update user permissions message
    showToast(`Switched to ${role} role. ${role === 'admin' ? 'Full access granted.' : 'Limited access enabled.'}`, 'info');
    
    // Store role in localStorage
    localStorage.setItem('userRole', role);
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ovia PMS Dashboard v4.5 initialized');
    
    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize dashboard components
    initializeDashboard();
    
    // Load saved preferences
    loadUserPreferences();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('Dashboard components initialized');
    
    // Check system health periodically
    setInterval(checkSystemHealth, 30000);
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize event listeners
    initEventListeners();
}

// Load user preferences from localStorage
function loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark' && themeToggle) {
        themeToggle.classList.add('active');
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#1a1d28';
        document.body.style.color = '#e2e8f0';
        
        // Update dark mode switch
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        if (darkModeSwitch) {
            darkModeSwitch.checked = true;
        }
    }
    
    // Load user status
    const savedStatus = localStorage.getItem('userStatus');
    if (savedStatus) {
        updateUserStatus(savedStatus);
        
        // Update radio buttons
        const statusRadio = document.querySelector(`input[name="userStatus"][value="${savedStatus}"]`);
        if (statusRadio) {
            statusRadio.checked = true;
        }
        
        const sidebarStatusRadio = document.querySelector(`input[name="currentStatus"][id="status${savedStatus.charAt(0).toUpperCase() + savedStatus.slice(1)}"]`);
        if (sidebarStatusRadio) {
            sidebarStatusRadio.checked = true;
        }
    }
    
    // Load user role
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        const roleRadio = document.querySelector(`input[name="userRole"][value="${savedRole}"]`);
        if (roleRadio) {
            roleRadio.checked = true;
        }
        switchUserRole(savedRole);
    }
}

// Check system health
function checkSystemHealth() {
    // This is a simulation - in a real app, you would make an API call
    const cpuUsage = Math.floor(Math.random() * 30) + 30; // 30-60%
    const memoryUsage = Math.floor(Math.random() * 30) + 50; // 50-80%
    
    // Update progress bars if they exist
    const cpuProgress = document.querySelector('.progress-bar[data-type="cpu"]');
    const memoryProgress = document.querySelector('.progress-bar[data-type="memory"]');
    
    if (cpuProgress) {
        cpuProgress.style.width = `${cpuUsage}%`;
        cpuProgress.textContent = `${cpuUsage}%`;
    }
    
    if (memoryProgress) {
        memoryProgress.style.width = `${memoryUsage}%`;
        memoryProgress.textContent = `${memoryUsage}%`;
    }
    
    // Log system health (for debugging)
    if (cpuUsage > 80 || memoryUsage > 85) {
        console.warn(`System health warning: CPU ${cpuUsage}%, Memory ${memoryUsage}%`);
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize event listeners
function initEventListeners() {
    // Status radio buttons
    const statusRadios = document.querySelectorAll('input[name="userStatus"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateUserStatus(this.value);
        });
    });
    
    // Sidebar status radio buttons
    const sidebarStatusRadios = document.querySelectorAll('input[name="currentStatus"]');
    sidebarStatusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const status = this.id.replace('status', '').toLowerCase();
            updateUserStatus(status);
        });
    });
    
    // Role radio buttons
    const roleRadios = document.querySelectorAll('input[name="userRole"]');
    roleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            switchUserRole(this.value);
        });
    });
    
    // ONLINE/ADMIN toggle buttons
    const statusToggleButtons = document.querySelectorAll('[data-status]');
    statusToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            statusToggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.dataset.status;
            showToast(`${status.toUpperCase()} mode activated`, 'info');
        });
    });
    
    // Settings switches
    const settingsSwitches = document.querySelectorAll('.form-switch input');
    settingsSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const settingName = this.id.replace('Switch', '');
            const isEnabled = this.checked;
            
            console.log(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`);
            
            // Handle specific settings
            if (settingName === 'darkMode') {
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    if (isEnabled) {
                        themeToggle.click();
                    } else if (document.body.classList.contains('dark-mode')) {
                        themeToggle.click();
                    }
                }
            }
            
            // Store setting
            localStorage.setItem(`setting_${settingName}`, isEnabled);
        });
        
        // Load saved switch state
        const savedState = localStorage.getItem(`setting_${switchEl.id.replace('Switch', '')}`);
        if (savedState !== null) {
            switchEl.checked = savedState === 'true';
        }
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast-notification toast-${type}`;
    
    // Get appropriate icon
    const icons = {
        'success': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'danger': 'fa-times-circle',
        'info': 'fa-info-circle'
    };
    const icon = icons[type] || 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon} me-2"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toastId);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
}

// Remove toast with animation
function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateDateTime,
        updateUserStatus,
        switchUserRole,
        initializeDashboard,
        loadUserPreferences,
        checkSystemHealth,
        initTooltips,
        initEventListeners,
        showToast,
        removeToast
    };
}