// Cancel Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tabs
    const triggerTabList = document.querySelectorAll('#cancellationTabs button')
    triggerTabList.forEach(triggerEl => {
        const tabTrigger = new bootstrap.Tab(triggerEl)
        
        triggerEl.addEventListener('click', event => {
            event.preventDefault()
            tabTrigger.show()
        })
    })
    
    // Select cancelled reservation row
    document.querySelectorAll('.cancelled-row').forEach(row => {
        row.addEventListener('click', function() {
            // Remove active class from all rows
            document.querySelectorAll('.cancelled-row').forEach(r => {
                r.classList.remove('table-active');
            });
            
            // Add active class to clicked row
            this.classList.add('table-active');
            
            // Load reservation details
            const reservationId = this.dataset.id;
            loadCancelledReservation(reservationId);
        });
    });
    
    // Search functionality
    document.getElementById('cancelSearchBtn').addEventListener('click', function() {
        searchCancelledReservations();
    });
    
    // Process cancellation button
    document.getElementById('processCancelBtn').addEventListener('click', function() {
        processCancellation();
    });
    
    // Confirm cancellation button
    document.getElementById('confirmCancellationBtn').addEventListener('click', function() {
        confirmCancellation();
    });
    
    // Add service button
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Add') && btn.closest('.card').querySelector('h6').textContent.includes('Add Services')) {
            btn.addEventListener('click', function() {
                addService();
            });
        }
    });
    
    // Add payment button
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Add') && btn.closest('.card').querySelector('h6').textContent.includes('Add Payments')) {
            btn.addEventListener('click', function() {
                addPayment();
            });
        }
    });
    
    // Save button
    document.querySelectorAll('.btn-success').forEach(btn => {
        if (btn.textContent.includes('Save')) {
            btn.addEventListener('click', function() {
                saveCancellation();
            });
        }
    });
    
    // Cancellation button
    document.querySelectorAll('.btn-danger').forEach(btn => {
        if (btn.textContent.includes('Cancellation') && !btn.id) {
            btn.addEventListener('click', function() {
                showCancelConfirmation();
            });
        }
    });
    
    // Reset buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        if (btn.textContent.includes('Reset')) {
            btn.addEventListener('click', function() {
                resetForm();
            });
        }
    });
    
    // Print receipt button
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.textContent.includes('Print')) {
            btn.addEventListener('click', function() {
                printReceipt();
            });
        }
    });
    
    // Auto-calculate total amount
    document.querySelectorAll('input[type="number"]').forEach(input => {
        if (input.placeholder.includes('Qty') || input.placeholder.includes('Amount')) {
            input.addEventListener('input', calculateTotal);
        }
    });
    
    // Load first reservation by default
    if (document.querySelector('.cancelled-row')) {
        document.querySelector('.cancelled-row').click();
    }
});

function loadCancelledReservation(reservationId) {
    // Sample data for different reservations
    const reservationData = {
        'REC100070': {
            firstName: 'Villas',
            lastName: 'Special',
            adults: 4,
            children: 0,
            numberOfDays: 2,
            roomType: 'suite',
            numberOfRooms: 6,
            checkIn: '2016-03-05',
            checkOut: '2016-03-07',
            subTotal: '2450.00',
            advancePaid: '1225.00',
            totalTaxInc: '2450.00',
            balanceDue: '1225.00',
            services: [
                { code: 'TR001', name: 'Airport Pickup', qty: 1, amount: '50.00' }
            ],
            payments: [
                { receiptNo: 'RCT001234', type: 'Cash', date: '2025-12-19', amount: '1225.00' }
            ]
        },
        'REC100037': {
            firstName: 'Natural',
            lastName: 'Season',
            adults: 2,
            children: 0,
            numberOfDays: 27,
            roomType: 'deluxe',
            numberOfRooms: 2,
            checkIn: '2015-12-15',
            checkOut: '2016-01-11',
            subTotal: '3200.00',
            advancePaid: '1600.00',
            totalTaxInc: '3200.00',
            balanceDue: '1600.00',
            services: [],
            payments: [
                { receiptNo: 'RCT001235', type: 'Credit Card', date: '2025-12-19', amount: '1600.00' }
            ]
        },
        'REC100036': {
            firstName: 'Peak',
            lastName: 'PeakSeason',
            adults: 3,
            children: 2,
            numberOfDays: 27,
            roomType: 'standard',
            numberOfRooms: 7,
            checkIn: '2015-12-15',
            checkOut: '2016-01-11',
            subTotal: '4800.00',
            advancePaid: '2400.00',
            totalTaxInc: '4800.00',
            balanceDue: '2400.00',
            services: [
                { code: 'SPA001', name: 'Spa Treatment', qty: 2, amount: '100.00' },
                { code: 'TR002', name: 'City Tour', qty: 1, amount: '75.00' }
            ],
            payments: [
                { receiptNo: 'RCT001236', type: 'Bank Transfer', date: '2025-12-19', amount: '2400.00' }
            ]
        },
        'REC100035': {
            firstName: 'Linares',
            lastName: 'aaa',
            adults: 1,
            children: 0,
            numberOfDays: 2,
            roomType: 'standard',
            numberOfRooms: 2,
            checkIn: '2015-12-19',
            checkOut: '2015-12-21',
            subTotal: '400.00',
            advancePaid: '200.00',
            totalTaxInc: '400.00',
            balanceDue: '200.00',
            services: [],
            payments: [
                { receiptNo: 'RCT001237', type: 'Cash', date: '2025-12-19', amount: '200.00' }
            ]
        }
    };
    
    const data = reservationData[reservationId] || reservationData['REC100070'];
    
    // Update form fields
    document.getElementById('guestFirstName').value = data.firstName;
    document.getElementById('guestLastName').value = data.lastName;
    document.getElementById('adultsCount').value = data.adults;
    document.getElementById('childrenCount').value = data.children;
    document.getElementById('numberOfDays').value = data.numberOfDays;
    document.getElementById('numberOfRooms').value = data.numberOfRooms;
    
    // Update check-in date
    const checkInInput = document.querySelector('input[value="2016-03-05"]');
    if (checkInInput) checkInInput.value = data.checkIn;
    
    // Update balance information
    updateBalance(data.subTotal, data.advancePaid, data.totalTaxInc, data.balanceDue);
    
    // Update services table
    updateServicesTable(data.services);
    
    // Update payments table
    updatePaymentsTable(data.payments);
    
    // Calculate refund amount
    calculateRefund(data.advancePaid);
    
    showAlert(`Loaded reservation ${reservationId} details`, 'info');
}

function searchCancelledReservations() {
    const lastNameSearch = document.getElementById('lastNameCancelSearch').value.toLowerCase();
    const roomIdSearch = document.getElementById('roomIdSearch').value.toLowerCase();
    
    const rows = document.querySelectorAll('.cancelled-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const lastName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const reservationId = row.querySelector('td:nth-child(1) .badge').textContent.toLowerCase();
        
        let show = true;
        
        if (lastNameSearch && !lastName.includes(lastNameSearch)) {
            show = false;
        }
        
        if (roomIdSearch && !reservationId.includes(roomIdSearch)) {
            show = false;
        }
        
        if (show) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update showing count
    const footer = document.querySelector('.card-footer span');
    if (footer) {
        footer.textContent = `Showing ${visibleCount} of ${rows.length}`;
    }
    
    if (visibleCount === 0) {
        showAlert('No matching reservations found', 'warning');
    }
}

function processCancellation() {
    const activeRow = document.querySelector('.cancelled-row.table-active');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    const guestName = activeRow.querySelector('td:nth-child(3)').textContent + ' ' + 
                      activeRow.querySelector('td:nth-child(2)').textContent;
    const totalAmount = document.querySelector('.balance-summary span:last-child').textContent;
    const advancePaid = document.querySelector('.balance-summary span.text-success').textContent;
    
    // Calculate refund (50% of advance paid)
    const refundAmount = parseFloat(advancePaid.replace('$', '')) * 0.5;
    
    // Update modal content
    document.getElementById('modalReservationId').textContent = reservationId;
    document.getElementById('modalGuestName').textContent = guestName;
    document.getElementById('modalTotalAmount').textContent = totalAmount;
    document.getElementById('modalRefundAmount').textContent = `$${refundAmount.toFixed(2)}`;
    
    // Show modal
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelConfirmModal'));
    cancelModal.show();
}

function confirmCancellation() {
    const reservationId = document.getElementById('modalReservationId').textContent;
    const reason = document.getElementById('cancellationReason').value;
    const processRefund = document.getElementById('processRefundCheckbox').checked;
    const notifyGuest = document.getElementById('notifyGuestCheckbox').checked;
    
    if (!reason.trim()) {
        showAlert('Please enter a cancellation reason', 'warning');
        return;
    }
    
    // Process cancellation
    showAlert(`Reservation ${reservationId} cancelled successfully`, 'success');
    
    if (processRefund) {
        showAlert('Refund processed and sent to guest', 'info');
    }
    
    if (notifyGuest) {
        showAlert('Cancellation notification sent to guest', 'info');
    }
    
    // Update reservation status
    const statusSelect = document.getElementById('reservationStatus');
    if (statusSelect) {
        statusSelect.value = 'cancelled';
    }
    
    // Close modal
    const cancelModal = bootstrap.Modal.getInstance(document.getElementById('cancelConfirmModal'));
    cancelModal.hide();
    
    // Reset modal form
    document.getElementById('cancellationReason').value = '';
    document.getElementById('processRefundCheckbox').checked = true;
    document.getElementById('notifyGuestCheckbox').checked = true;
    
    // Add to cancellation history
    addCancellationToHistory(reservationId, reason);
}

function addService() {
    const serviceCode = document.querySelector('input[placeholder="SVC001"]').value;
    const serviceName = document.querySelector('input[placeholder="Airport Transfer"]').value;
    const qty = document.querySelector('input[placeholder*="Qty"]').value || 1;
    const amount = document.querySelector('input[placeholder*="Amount"]').value || 0;
    
    if (!serviceCode || !serviceName) {
        showAlert('Please enter service code and name', 'warning');
        return;
    }
    
    const total = (parseFloat(qty) * parseFloat(amount)).toFixed(2);
    
    // Add to services table
    const servicesTable = document.querySelector('.table-sm tbody');
    if (servicesTable) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${serviceCode}</td>
            <td>${serviceName}</td>
            <td>${qty}</td>
            <td>$${amount}</td>
            <td>$${total}</td>
        `;
        servicesTable.appendChild(newRow);
        
        // Update balance
        updateBalanceWithService(parseFloat(total));
        
        // Clear form
        document.querySelector('input[placeholder="SVC001"]').value = '';
        document.querySelector('input[placeholder="Airport Transfer"]').value = '';
        
        showAlert('Service added successfully', 'success');
    }
}

function addPayment() {
    const receiptNo = document.querySelector('input[value="RCT001234"]').value;
    const paymentType = document.querySelector('select').value;
    const amount = document.querySelector('input[placeholder*="Amount"]').nextElementSibling.value;
    const date = document.querySelector('input[type="date"]').value;
    
    if (!receiptNo || !paymentType || !amount) {
        showAlert('Please fill in all payment details', 'warning');
        return;
    }
    
    // Add to payments table
    const paymentsTable = document.querySelector('.table-sm:last-of-type tbody');
    if (paymentsTable) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${receiptNo}</td>
            <td><span class="badge bg-success">${paymentType}</span></td>
            <td>${date}</td>
            <td class="text-success">$${parseFloat(amount).toFixed(2)}</td>
        `;
        paymentsTable.appendChild(newRow);
        
        // Update balance
        updateBalanceWithPayment(parseFloat(amount));
        
        // Generate new receipt number
        const newReceiptNo = 'RCT' + (parseInt(receiptNo.replace('RCT', '')) + 1).toString().padStart(6, '0');
        document.querySelector('input[value="RCT001234"]').value = newReceiptNo;
        
        showAlert('Payment added successfully', 'success');
    }
}

function saveCancellation() {
    const activeRow = document.querySelector('.cancelled-row.table-active');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    
    // In a real application, you would save to database
    showAlert(`Cancellation details for ${reservationId} saved successfully`, 'success');
    
    // Mark as saved
    activeRow.classList.add('saved');
    
    // Add timestamp
    const timeInput = document.querySelector('input[type="time"]');
    if (timeInput) {
        const now = new Date();
        timeInput.value = now.toTimeString().split(' ')[0];
    }
}

function showCancelConfirmation() {
    processCancellation();
}

function resetForm() {
    // Reset all form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        if (!field.classList.contains('no-reset')) {
            if (field.type === 'text' || field.type === 'number' || field.type === 'textarea') {
                field.value = '';
            } else if (field.type === 'select-one') {
                field.selectedIndex = 0;
            }
        }
    });
    
    showAlert('Form has been reset', 'info');
}

function printReceipt() {
    const activeRow = document.querySelector('.cancelled-row.table-active');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    showAlert(`Printing receipt for ${reservationId}...`, 'info');
    
    // In a real application, this would open print dialog
    setTimeout(() => {
        window.print();
    }, 1000);
}

function calculateTotal() {
    const qty = parseFloat(document.querySelector('input[placeholder*="Qty"]').value) || 0;
    const amount = parseFloat(document.querySelector('input[placeholder*="Amount"]').value) || 0;
    const total = qty * amount;
    
    const totalInput = document.querySelector('input[placeholder*="Total Amount"]');
    if (totalInput) {
        totalInput.value = total.toFixed(2);
    }
}

function updateBalance(subTotal, advancePaid, totalTaxInc, balanceDue) {
    const balanceElements = document.querySelectorAll('.balance-summary span');
    if (balanceElements.length >= 4) {
        balanceElements[0].nextSibling.textContent = `$${subTotal}`;
        balanceElements[1].nextSibling.textContent = `$${advancePaid}`;
        balanceElements[2].nextSibling.textContent = `$${totalTaxInc}`;
        balanceElements[3].nextSibling.textContent = `$${balanceDue}`;
    }
}

function updateServicesTable(services) {
    const servicesTable = document.querySelector('.table-sm tbody');
    if (servicesTable) {
        servicesTable.innerHTML = '';
        
        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.code}</td>
                <td>${service.name}</td>
                <td>${service.qty}</td>
                <td>$${service.amount}</td>
                <td>$${(parseFloat(service.qty) * parseFloat(service.amount)).toFixed(2)}</td>
            `;
            servicesTable.appendChild(row);
        });
    }
}

function updatePaymentsTable(payments) {
    const paymentsTable = document.querySelector('.table-sm:last-of-type tbody');
    if (paymentsTable) {
        paymentsTable.innerHTML = '';
        
        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.receiptNo}</td>
                <td><span class="badge bg-success">${payment.type}</span></td>
                <td>${payment.date}</td>
                <td class="text-success">$${payment.amount}</td>
            `;
            paymentsTable.appendChild(row);
        });
    }
}

function calculateRefund(advancePaid) {
    const refundAmount = parseFloat(advancePaid) * 0.5;
    // You could update a refund display element here
    console.log(`Refund amount: $${refundAmount.toFixed(2)}`);
    return refundAmount;
}

function updateBalanceWithService(serviceAmount) {
    const balanceElements = document.querySelectorAll('.balance-summary span');
    if (balanceElements.length >= 4) {
        const currentSubTotal = parseFloat(balanceElements[0].nextSibling.textContent.replace('$', ''));
        const currentTotal = parseFloat(balanceElements[2].nextSibling.textContent.replace('$', ''));
        const currentBalance = parseFloat(balanceElements[3].nextSibling.textContent.replace('$', ''));
        
        balanceElements[0].nextSibling.textContent = `$${(currentSubTotal + serviceAmount).toFixed(2)}`;
        balanceElements[2].nextSibling.textContent = `$${(currentTotal + serviceAmount).toFixed(2)}`;
        balanceElements[3].nextSibling.textContent = `$${(currentBalance + serviceAmount).toFixed(2)}`;
    }
}

function updateBalanceWithPayment(paymentAmount) {
    const balanceElements = document.querySelectorAll('.balance-summary span');
    if (balanceElements.length >= 4) {
        const currentAdvance = parseFloat(balanceElements[1].nextSibling.textContent.replace('$', ''));
        const currentBalance = parseFloat(balanceElements[3].nextSibling.textContent.replace('$', ''));
        
        balanceElements[1].nextSibling.textContent = `$${(currentAdvance + paymentAmount).toFixed(2)}`;
        balanceElements[3].nextSibling.textContent = `$${(currentBalance - paymentAmount).toFixed(2)}`;
    }
}

function addCancellationToHistory(reservationId, reason) {
    // In a real application, you would save to database
    console.log(`Cancellation added to history: ${reservationId} - ${reason}`);
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