// History Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates for search
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    document.getElementById('fromDateSearch').value = oneMonthAgo.toISOString().split('T')[0];
    document.getElementById('toDateSearch').value = today.toISOString().split('T')[0];
    
    // Search button
    document.getElementById('searchHistoryBtn').addEventListener('click', searchHistory);
    
    // Refresh button
    document.getElementById('refreshHistoryBtn').addEventListener('click', refreshHistory);
    
    // Export button
    document.getElementById('exportHistoryBtn').addEventListener('click', exportHistory);
    
    // Period filter buttons
    document.querySelectorAll('[data-period]').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('[data-period]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const period = this.dataset.period;
            filterByPeriod(period);
        });
    });
    
    // View history details buttons
    document.querySelectorAll('.view-history-details').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reservationId = row.querySelector('.badge').textContent;
            viewHistoryDetails(reservationId, row);
        });
    });
    
    // Print history buttons
    document.querySelectorAll('.print-history').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reservationId = row.querySelector('.badge').textContent;
            printHistory(reservationId);
        });
    });
    
    // Clone reservation buttons
    document.querySelectorAll('.clone-reservation').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reservationId = row.querySelector('.badge').textContent;
            cloneReservation(reservationId);
        });
    });
    
    // Print full details button (modal)
    document.getElementById('printFullDetailsBtn').addEventListener('click', printFullDetails);
    
    // Row click to view details
    document.querySelectorAll('#historyTable tbody tr').forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if button was clicked
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            
            const reservationId = this.querySelector('.badge').textContent;
            viewHistoryDetails(reservationId, this);
        });
    });
    
    // Initialize with all records
    loadHistoryData();
});

function loadHistoryData() {
    // In a real application, you would fetch data from an API
    // For now, we'll use the static data in the table
    
    showAlert('History data loaded', 'info');
}

function searchHistory() {
    const reservationNo = document.getElementById('reservationNoSearch').value.toLowerCase();
    const fromDate = document.getElementById('fromDateSearch').value;
    const toDate = document.getElementById('toDateSearch').value;
    const status = document.getElementById('statusFilter').value;
    const guestName = document.getElementById('guestNameSearch').value.toLowerCase();
    const roomNumber = document.getElementById('roomNumberSearch').value.toLowerCase();
    
    const rows = document.querySelectorAll('#historyTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const resNo = row.querySelector('td:nth-child(1) .badge').textContent.toLowerCase();
        const fromDateCell = row.querySelector('td:nth-child(2)').textContent;
        const toDateCell = row.querySelector('td:nth-child(3)').textContent;
        const guestNameCell = row.querySelector('td:nth-child(4) .fw-medium').textContent.toLowerCase();
        const roomNo = row.querySelector('td:nth-child(5) .badge').textContent.toLowerCase();
        const statusCell = row.querySelector('td:nth-child(8) .badge').textContent.toLowerCase();
        
        let show = true;
        
        // Apply filters
        if (reservationNo && !resNo.includes(reservationNo)) show = false;
        if (fromDate && fromDateCell < fromDate) show = false;
        if (toDate && toDateCell > toDate) show = false;
        if (status && !statusCell.includes(status)) show = false;
        if (guestName && !guestNameCell.includes(guestName)) show = false;
        if (roomNumber && !roomNo.includes(roomNumber)) show = false;
        
        if (show) {
            row.style.display = '';
            visibleCount++;
            
            // Highlight search terms
            if (reservationNo && resNo.includes(reservationNo)) {
                highlightText(row.querySelector('td:nth-child(1)'), reservationNo);
            }
            if (guestName && guestNameCell.includes(guestName)) {
                highlightText(row.querySelector('td:nth-child(4)'), guestName);
            }
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update showing count
    document.querySelector('.card-footer span').textContent = `Showing ${visibleCount} of ${rows.length} records`;
    
    if (visibleCount === 0) {
        showAlert('No matching records found', 'warning');
    } else {
        showAlert(`Found ${visibleCount} matching record(s)`, 'success');
    }
}

function filterByPeriod(period) {
    const today = new Date();
    let fromDate = new Date();
    
    switch(period) {
        case 'month':
            fromDate.setMonth(today.getMonth() - 1);
            break;
        case 'week':
            fromDate.setDate(today.getDate() - 7);
            break;
        case 'all':
            // Show all records
            document.querySelectorAll('#historyTableBody tr').forEach(row => {
                row.style.display = '';
            });
            document.querySelector('.card-footer span').textContent = `Showing 5 of 5 records`;
            return;
    }
    
    document.getElementById('fromDateSearch').value = fromDate.toISOString().split('T')[0];
    document.getElementById('toDateSearch').value = today.toISOString().split('T')[0];
    
    // Trigger search
    searchHistory();
}

function refreshHistory() {
    // Show loading animation
    const refreshBtn = document.getElementById('refreshHistoryBtn');
    const originalHtml = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner refresh-animation me-1"></i> Refreshing';
    refreshBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset search filters
        document.getElementById('reservationNoSearch').value = '';
        document.getElementById('guestNameSearch').value = '';
        document.getElementById('roomNumberSearch').value = '';
        document.getElementById('statusFilter').value = '';
        
        // Show all rows
        document.querySelectorAll('#historyTableBody tr').forEach(row => {
            row.style.display = '';
        });
        
        // Update showing count
        document.querySelector('.card-footer span').textContent = 'Showing 5 of 5 records';
        
        // Reset button
        refreshBtn.innerHTML = originalHtml;
        refreshBtn.disabled = false;
        
        showAlert('History refreshed', 'success');
    }, 1000);
}

function exportHistory() {
    const fromDate = document.getElementById('fromDateSearch').value;
    const toDate = document.getElementById('toDateSearch').value;
    
    // Show confirmation
    if (confirm(`Export reservation history from ${fromDate} to ${toDate}?`)) {
        // Show loading
        const exportBtn = document.getElementById('exportHistoryBtn');
        const originalHtml = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="fas fa-spinner refresh-animation me-1"></i> Exporting';
        exportBtn.disabled = true;
        
        // Simulate export process
        setTimeout(() => {
            // In a real application, this would generate and download a file
            showAlert('History exported successfully. Check your downloads.', 'success');
            
            // Reset button
            exportBtn.innerHTML = originalHtml;
            exportBtn.disabled = false;
        }, 1500);
    }
}

function viewHistoryDetails(reservationId, row) {
    // Remove selected class from all rows
    document.querySelectorAll('#historyTable tbody tr').forEach(r => {
        r.classList.remove('selected');
    });
    
    // Add selected class to clicked row
    if (row) {
        row.classList.add('selected');
    }
    
    // Sample data for different reservations
    const historyData = {
        'REC100106': {
            guestName: 'Amal Senarathna',
            customerId: 'CUS10056',
            checkIn: '2015-11-25',
            checkOut: '2015-11-28',
            roomNumber: '105',
            roomType: 'Standard Double',
            nights: 3,
            adults: 2,
            children: 0,
            mealPlan: 'Bed & Breakfast',
            totalAmount: '$450.00',
            paymentMethod: 'Credit Card',
            status: 'Completed',
            notes: 'Early check-in requested. Left positive review.'
        },
        'REC100105': {
            guestName: 'Ruchira Senanayake',
            customerId: 'CUS10055',
            checkIn: '2015-11-24',
            checkOut: '2015-11-26',
            roomNumber: '204',
            roomType: 'Deluxe Single',
            nights: 2,
            adults: 1,
            children: 0,
            mealPlan: 'Room Only',
            totalAmount: '$320.00',
            paymentMethod: 'Cash',
            status: 'Completed',
            notes: 'Business traveler. Requested quiet room.'
        },
        'REC100104': {
            guestName: 'John Peterson',
            customerId: 'CUS10054',
            checkIn: '2015-11-22',
            checkOut: '2015-11-25',
            roomNumber: '301',
            roomType: 'Executive Suite',
            nights: 3,
            adults: 2,
            children: 1,
            mealPlan: 'All Inclusive',
            totalAmount: '$480.00',
            paymentMethod: 'Bank Transfer',
            status: 'Cancelled',
            notes: 'Cancelled 2 days before arrival. Full refund issued.'
        }
    };
    
    const data = historyData[reservationId] || historyData['REC100106'];
    
    // Update modal content
    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="mb-3 text-primary">Reservation Information</h6>
                <table class="table table-sm">
                    <tr>
                        <th width="40%">Reservation ID:</th>
                        <td><span class="badge bg-primary">${reservationId}</span></td>
                    </tr>
                    <tr>
                        <th>Guest Name:</th>
                        <td>${data.guestName}</td>
                    </tr>
                    <tr>
                        <th>Customer ID:</th>
                        <td>${data.customerId}</td>
                    </tr>
                    <tr>
                        <th>Check-in Date:</th>
                        <td>${data.checkIn}</td>
                    </tr>
                    <tr>
                        <th>Check-out Date:</th>
                        <td>${data.checkOut}</td>
                    </tr>
                    <tr>
                        <th>Room Number:</th>
                        <td>${data.roomNumber}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6 class="mb-3 text-primary">Booking Details</h6>
                <table class="table table-sm">
                    <tr>
                        <th width="40%">Room Type:</th>
                        <td>${data.roomType}</td>
                    </tr>
                    <tr>
                        <th>Nights:</th>
                        <td>${data.nights}</td>
                    </tr>
                    <tr>
                        <th>Adults/Children:</th>
                        <td>${data.adults} / ${data.children}</td>
                    </tr>
                    <tr>
                        <th>Meal Plan:</th>
                        <td>${data.mealPlan}</td>
                    </tr>
                    <tr>
                        <th>Total Amount:</th>
                        <td class="text-success fw-bold">${data.totalAmount}</td>
                    </tr>
                    <tr>
                        <th>Payment Method:</th>
                        <td>${data.paymentMethod}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <h6 class="mb-3 text-primary">Status & Notes</h6>
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <strong>Status:</strong>
                                <span class="badge ${getStatusBadgeClass(data.status)} ms-2">${data.status}</span>
                            </div>
                            <div>
                                <strong>Booking Source:</strong>
                                <span class="ms-2">Hotel Website</span>
                            </div>
                        </div>
                        <div>
                            <strong>Notes:</strong>
                            <p class="mt-2 mb-0">${data.notes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-4">
            <div class="col-12">
                <h6 class="mb-3 text-primary">Payment History</h6>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${data.checkIn}</td>
                                <td>Room charges</td>
                                <td>${data.totalAmount}</td>
                                <td>${data.paymentMethod}</td>
                                <td><span class="badge bg-success">Paid</span></td>
                            </tr>
                            <tr>
                                <td>${data.checkIn}</td>
                                <td>Tax & Service</td>
                                <td>$72.00</td>
                                <td>${data.paymentMethod}</td>
                                <td><span class="badge bg-success">Paid</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalHistoryDetails').innerHTML = modalContent;
    
    // Show modal
    const historyModal = new bootstrap.Modal(document.getElementById('historyDetailsModal'));
    historyModal.show();
    
    // Also update the inline details section
    updateInlineDetails(reservationId, data);
}

function updateInlineDetails(reservationId, data) {
    const detailsContent = `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Showing details for reservation <strong>${reservationId}</strong>
        </div>
        
        <div class="row">
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-title text-primary">Guest Information</h6>
                        <p class="mb-1"><strong>Name:</strong> ${data.guestName}</p>
                        <p class="mb-1"><strong>Customer ID:</strong> ${data.customerId}</p>
                        <p class="mb-1"><strong>Room:</strong> ${data.roomNumber} (${data.roomType})</p>
                        <p class="mb-0"><strong>Meal Plan:</strong> ${data.mealPlan}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-title text-primary">Stay Details</h6>
                        <p class="mb-1"><strong>Check-in:</strong> ${data.checkIn}</p>
                        <p class="mb-1"><strong>Check-out:</strong> ${data.checkOut}</p>
                        <p class="mb-1"><strong>Nights:</strong> ${data.nights}</p>
                        <p class="mb-0"><strong>Guests:</strong> ${data.adults} Adult(s), ${data.children} Child(ren)</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h6 class="card-title text-primary">Financial Summary</h6>
                        <p class="mb-1"><strong>Total Amount:</strong> ${data.totalAmount}</p>
                        <p class="mb-1"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                        <p class="mb-1"><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(data.status)}">${data.status}</span></p>
                        <p class="mb-0"><strong>Notes:</strong> ${data.notes}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('historyDetailsContent').innerHTML = detailsContent;
    document.getElementById('historyDetailsSection').style.display = 'block';
}

function printHistory(reservationId) {
    showAlert(`Printing details for reservation ${reservationId}...`, 'info');
    
    // In a real application, this would generate a printable report
    setTimeout(() => {
        window.print();
    }, 1000);
}

function printFullDetails() {
    showAlert('Printing full reservation details...', 'info');
    
    // Close modal first
    const historyModal = bootstrap.Modal.getInstance(document.getElementById('historyDetailsModal'));
    historyModal.hide();
    
    // Then print
    setTimeout(() => {
        window.print();
    }, 500);
}

function cloneReservation(reservationId) {
    if (confirm(`Clone reservation ${reservationId} as a new reservation?`)) {
        // In a real application, this would clone the reservation in the database
        
        // Show success message
        showAlert(`Reservation ${reservationId} cloned. Redirecting to new reservation...`, 'success');
        
        // Simulate redirect
        setTimeout(() => {
            window.location.href = 'reservations-new.html';
        }, 1500);
    }
}

function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'completed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-warning';
        case 'no show':
            return 'bg-danger';
        case 'checked out':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<span class="highlight-search">$1</span>');
    
    // Only update if we found matches
    if (highlighted !== text) {
        element.innerHTML = highlighted;
    }
}

function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to body
    document.body.appendChild(alertDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}