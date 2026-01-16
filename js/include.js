// Function to load HTML components
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        
        if (file) {
            fetch(file)
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(html => {
                    element.innerHTML = html;
                    // Reinitialize any Bootstrap components in the loaded content
                    const dropdownElements = element.querySelectorAll('.dropdown-toggle');
                    dropdownElements.forEach(dropdown => {
                        new bootstrap.Dropdown(dropdown);
                    });
                    
                    // Initialize location selector if included
                    if (element.querySelector('#locationSelect')) {
                        initLocationSelector();
                    }
                    
                    // Dispatch event that content has been loaded
                    element.dispatchEvent(new CustomEvent('contentLoaded', { 
                        bubbles: true,
                        detail: { element: element, file: file }
                    }));
                })
                .catch(error => {
                    console.error('Error loading component:', error);
                    element.innerHTML = `<div class="alert alert-danger">Error loading component: ${file}</div>`;
                });
        }
    });
}

// Location and Database Management Functions
function initLocationSelector() {
    const locationSelect = document.getElementById('locationSelect');
    const dbNameElement = document.getElementById('dbName');
    const currentLocationBadge = document.getElementById('currentLocationBadge');
    
    // If elements don't exist (user dropdown not loaded), exit
    if (!locationSelect || !dbNameElement || !currentLocationBadge) {
        return;
    }
    
    // Load saved location from localStorage or default to first option
    const savedLocation = localStorage.getItem('currentHotelLocation') || 'newyork';
    const savedDb = localStorage.getItem('currentHotelDB') || 'ny_hotel_db';
    
    // Set initial values
    locationSelect.value = savedLocation;
    updateLocationDisplay(savedLocation, savedDb);
    
    // Handle location change
    locationSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const locationName = selectedOption.text;
        const locationValue = selectedOption.value;
        const dbName = selectedOption.getAttribute('data-db');
        
        // Update display
        updateLocationDisplay(locationName, dbName);
        
        // Save to localStorage
        localStorage.setItem('currentHotelLocation', locationValue);
        localStorage.setItem('currentHotelDB', dbName);
        
        // Switch database connection
        switchDatabase(locationValue, dbName, locationName);
    });
    
    function updateLocationDisplay(locationName, dbName) {
        currentLocationBadge.textContent = locationName;
        dbNameElement.textContent = dbName;
    }
    
    function switchDatabase(locationId, dbName, locationName) {
        // Show loading state
        const originalContent = dbNameElement.innerHTML;
        dbNameElement.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Switching...';
        
        // Simulate API call to switch database
        setTimeout(() => {
            // Make API call to switch database on the server
            fetch('/api/switch-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    locationId: locationId,
                    database: dbName,
                    locationName: locationName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update display with new database name
                    dbNameElement.textContent = dbName;
                    currentLocationBadge.textContent = locationName;
                    
                    // Show success message
                    showNotification('success', `Switched to ${locationName} database`);
                    
                    // Refresh relevant page data
                    refreshPageData();
                    
                    // Dispatch location changed event for other components
                    document.dispatchEvent(new CustomEvent('locationChanged', {
                        detail: {
                            locationId: locationId,
                            database: dbName,
                            locationName: locationName,
                            timestamp: new Date().toISOString()
                        }
                    }));
                } else {
                    showNotification('error', 'Failed to switch database');
                    // Revert to previous selection
                    const prevLocation = localStorage.getItem('currentHotelLocation');
                    locationSelect.value = prevLocation || 'newyork';
                    updateLocationDisplay(
                        prevLocation ? locationSelect.options[locationSelect.selectedIndex].text : 'New York',
                        localStorage.getItem('currentHotelDB') || 'ny_hotel_db'
                    );
                }
            })
            .catch(error => {
                console.error('Error switching database:', error);
                showNotification('error', 'Error switching database');
                // Revert to previous selection
                const prevLocation = localStorage.getItem('currentHotelLocation');
                locationSelect.value = prevLocation || 'newyork';
                updateLocationDisplay(
                    prevLocation ? locationSelect.options[locationSelect.selectedIndex].text : 'New York',
                    localStorage.getItem('currentHotelDB') || 'ny_hotel_db'
                );
            });
        }, 500);
    }
    
    function refreshPageData() {
        // This function should refresh data that depends on the location
        // Customize based on your application's needs
        
        // Dispatch event for other components to update
        document.dispatchEvent(new CustomEvent('databaseSwitched', {
            detail: {
                location: locationSelect.value,
                db: locationSelect.options[locationSelect.selectedIndex].getAttribute('data-db')
            }
        }));
        
        // You can add more specific refresh logic here
        console.log('Refreshing page data for new location...');
    }
    
    function showNotification(type, message) {
        // Create or use existing toast container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(container);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Initialize and show toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        bsToast.show();
        
        // Remove toast from DOM after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
    
    // Initialize Bootstrap tooltips for location selector
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Utility Functions
function getCurrentLocation() {
    return localStorage.getItem('currentHotelLocation') || 'newyork';
}

function getCurrentDatabase() {
    return localStorage.getItem('currentHotelDB') || 'ny_hotel_db';
}

function setCurrentLocation(locationId, dbName) {
    localStorage.setItem('currentHotelLocation', locationId);
    localStorage.setItem('currentHotelDB', dbName);
    
    // Update UI if location selector is present
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        locationSelect.value = locationId;
        initLocationSelector(); // Reinitialize to update UI
    }
}

// Event Listeners for dynamic content
document.addEventListener('contentLoaded', function(e) {
    // Check if the loaded content contains location selector
    if (e.detail.element.querySelector('#locationSelect')) {
        initLocationSelector();
    }
});

// Global event listener for location changes
document.addEventListener('locationChanged', function(e) {
    console.log('Location changed to:', e.detail);
    // You can add global handlers here that respond to location changes
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load HTML components
    includeHTML();
    
    // Initialize location selector if already in DOM (not loaded via includeHTML)
    setTimeout(() => {
        if (document.getElementById('locationSelect')) {
            initLocationSelector();
        }
    }, 100);
});

// Make functions available globally
window.includeHTML = includeHTML;
window.initLocationSelector = initLocationSelector;
window.getCurrentLocation = getCurrentLocation;
window.getCurrentDatabase = getCurrentDatabase;
window.setCurrentLocation = setCurrentLocation;