// Dashboard-specific JavaScript functions for Ovia PMS

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// Initialize all dashboard functionality
function initDashboard() {
    // Initialize submenus
    initSubmenus();
    
    // Initialize sidebar toggle
    initSidebarToggle();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize quick actions
    initQuickActions();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize logout
    initLogout();
    
    // Initialize real-time updates
    initRealTimeUpdates();
    
    // Initialize card hover effects
    initCardHoverEffects();
    
    // Load last accessed sections
    loadLastAccessedSections();
}

// Initialize submenus
function initSubmenus() {
    const submenuItems = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.closest('.nav-item.has-submenu');
            const wasActive = parent.classList.contains('active');
            
            // Close all other submenus
            document.querySelectorAll('.nav-item.has-submenu').forEach(el => {
                if (el !== parent) {
                    el.classList.remove('active');
                }
            });
            
            // Toggle current submenu
            if (!wasActive) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
            
            // Update active nav link
            const allNavLinks = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
            allNavLinks.forEach(link => {
                if (link !== this) {
                    link.classList.remove('active');
                }
            });
            this.classList.add('active');
            
            // Update page title
            const sectionName = this.querySelector('span:not(.nav-icon):not(.badge):not(.submenu-toggle)').textContent;
            document.title = `${sectionName} - Ovia PMS`;
            
            // Show toast notification
            showToast(`Loading ${sectionName}...`, 'info');
        });
    });
    
    // Handle submenu item clicks
    const submenuLinks = document.querySelectorAll('.submenu a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const subsection = this.dataset.subsection || 'item';
            const parentSection = this.closest('.nav-item.has-submenu').querySelector('.nav-link').dataset.section;
            
            // Update active states
            const allSubmenuItems = document.querySelectorAll('.submenu a');
            allSubmenuItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Show loading message
            const subsectionName = this.textContent;
            showToast(`Opening ${subsectionName}...`, 'info');
            
            // Simulate loading content
            setTimeout(() => {
                showToast(`${subsectionName} loaded successfully`, 'success');
            }, 800);
            
            // Store last accessed subsection
            localStorage.setItem(`lastSubsection_${parentSection}`, subsection);
        });
    });
}

// Initialize sidebar toggle
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active');
            }
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Close sidebar when clicking on overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            if (sidebar) sidebar.classList.remove('active');
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close sidebar on window resize if it's desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            if (sidebar) {
                sidebar.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        }
    });
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                document.body.style.backgroundColor = '#1a1d28';
                document.body.style.color = '#e2e8f0';
                
                // Update dark mode switch
                const darkModeSwitch = document.getElementById('darkModeSwitch');
                if (darkModeSwitch) {
                    darkModeSwitch.checked = true;
                }
                
                // Store theme preference
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.style.backgroundColor = '#f5f7fb';
                document.body.style.color = '#4a5568';
                
                // Update dark mode switch
                const darkModeSwitch = document.getElementById('darkModeSwitch');
                if (darkModeSwitch) {
                    darkModeSwitch.checked = false;
                }
                
                // Store theme preference
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Initialize quick actions
function initQuickActions() {
    const quickActionButtons = document.querySelectorAll('.quick-stat .btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const actionText = this.closest('.quick-stat').querySelector('h5').textContent;
            console.log(`Quick action clicked: ${actionText}`);
            
            // Show a toast notification
            showToast(`Initiating: ${actionText}`, 'info');
            
            // Simulate action
            simulateAction(actionText);
        });
    });
    
    // Quick stat items in sidebar
    const quickStatItems = document.querySelectorAll('.quick-stat-item');
    quickStatItems.forEach(item => {
        item.addEventListener('click', function() {
            const statType = this.querySelector('small').textContent.toLowerCase();
            console.log(`Quick stat clicked: ${statType}`);
            
            // Navigate to appropriate section
            navigateToStat(statType);
        });
    });
}

// Initialize notifications
function initNotifications() {
    const notificationItems = document.querySelectorAll('.notification-badge, .list-group-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('notification-badge')) {
                e.preventDefault();
                console.log('Notifications dropdown opened');
                
                // Mark notifications as read
                markNotificationsAsRead();
            }
        });
    });
}

// Initialize logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            confirmLogout();
        });
    }
}

// Initialize real-time updates
function initRealTimeUpdates() {
    // Simulate real-time updates for metrics
    setInterval(() => {
        updateRandomMetrics();
    }, 30000); // Update every 30 seconds
    
    // Simulate new notifications
    setInterval(() => {
        simulateNewNotification();
    }, 60000); // Every minute
}

// Initialize card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Load last accessed sections
function loadLastAccessedSections() {
    const sections = ['reservations', 'check-outs', 'partners', 'accounts', 'reports', 'inventory', 'admin'];
    sections.forEach(section => {
        const lastSubsection = localStorage.getItem(`lastSubsection_${section}`);
        if (lastSubsection) {
            const submenuLink = document.querySelector(`[data-subsection="${lastSubsection}"]`);
            if (submenuLink) {
                submenuLink.classList.add('active');
            }
        }
    });
}

// Simulate an action
function simulateAction(action) {
    const actions = {
        'New Booking': { duration: 2000, message: 'Opening reservation form...' },
        'Check In': { duration: 1500, message: 'Loading guest details...' },
        'Check Out': { duration: 2500, message: 'Preparing invoice...' },
        'Generate Invoice': { duration: 1800, message: 'Creating bill document...' }
    };
    
    const actionConfig = actions[action] || { duration: 1000, message: 'Processing request...' };
    
    showToast(actionConfig.message, 'info');
    
    // Simulate processing time
    setTimeout(() => {
        showToast(`${action} completed successfully!`, 'success');
    }, actionConfig.duration);
}

// Mark notifications as read
function markNotificationsAsRead() {
    const notificationBadges = document.querySelectorAll('.notification-badge');
    notificationBadges.forEach(badge => {
        badge.style.display = 'none';
    });
    
    // Update localStorage
    localStorage.setItem('notificationsRead', new Date().toISOString());
    
    showToast('Notifications marked as read', 'success');
}

// Navigate to stat section
function navigateToStat(statType) {
    const sections = {
        'messages': 'Reservations',
        'friends': 'Staff',
        'notifications': 'Dashboard',
        'pending tasks': 'Housekeeping'
    };
    
    const targetSection = sections[statType] || 'Dashboard';
    
    // Update active sidebar link
    const sidebarLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const linkText = link.querySelector('span:not(.nav-icon)').textContent;
        if (linkText === targetSection) {
            link.classList.add('active');
        }
    });
    
    showToast(`Navigating to ${targetSection} for ${statType}`, 'info');
}

// Confirm logout
function confirmLogout() {
    if (confirm('Are you sure you want to logout from Ovia PMS?')) {
        showToast('Logging out...', 'warning');
        
        // Simulate logout process
        setTimeout(() => {
            // Clear user data
            localStorage.removeItem('userStatus');
            localStorage.removeItem('userRole');
            
            // Show success message
            showToast('Successfully logged out. Redirecting to login page...', 'success');
            
            // Simulate redirect
            setTimeout(() => {
                window.location.href = '#'; // In real app, this would be login page
            }, 1500);
        }, 1000);
    }
}

// Update random metrics
function updateRandomMetrics() {
    const metrics = [
        { selector: '.metric-card.in-house .metric-number', min: 35, max: 50 },
        { selector: '.metric-card.checkouts .metric-number', min: 15, max: 25 },
        { selector: '.metric-card.arrivals .metric-number', min: 20, max: 30 },
        { selector: '.metric-card.changes .metric-number', min: 5, max: 10 }
    ];
    
    metrics.forEach(metric => {
        const element = document.querySelector(metric.selector);
        if (element) {
            const oldValue = parseInt(element.textContent);
            const newValue = Math.floor(Math.random() * (metric.max - metric.min + 1)) + metric.min;
            
            if (newValue !== oldValue) {
                // Animate the change
                element.style.transform = 'scale(1.1)';
                element.style.color = newValue > oldValue ? '#2ec4b6' : '#e71d36';
                
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.transform = 'scale(1)';
                    setTimeout(() => {
                        element.style.color = '';
                    }, 1000);
                }, 300);
            }
        }
    });
}

// Simulate new notification
function simulateNewNotification() {
    const notificationTypes = [
        { type: 'New Booking', message: 'New reservation received' },
        { type: 'Check-out', message: 'Guest checking out soon' },
        { type: 'Maintenance', message: 'New maintenance request' },
        { type: 'Message', message: 'New guest message received' }
    ];
    
    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    // Only show if user is online
    const userStatus = localStorage.getItem('userStatus') || 'online';
    if (userStatus === 'online') {
        showToast(`${randomNotification.type}: ${randomNotification.message}`, 'info');
        
        // Update notification badge
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            const currentCount = parseInt(notificationBadge.textContent) || 0;
            notificationBadge.textContent = currentCount + 1;
            notificationBadge.style.display = 'flex';
        }
    }
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        simulateAction,
        markNotificationsAsRead,
        navigateToStat,
        confirmLogout,
        updateRandomMetrics,
        simulateNewNotification
    };
}