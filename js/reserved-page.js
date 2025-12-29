// Reserved Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Select all reservations checkbox
    document.getElementById('selectAllReserved').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.reservation-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // Select individual reservation row
    document.querySelectorAll('.reservation-row').forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't trigger if checkbox was clicked
            if (e.target.type === 'checkbox') return;
            
            // Remove selected class from all rows
            document.querySelectorAll('.reservation-row').forEach(r => {
                r.classList.remove('selected');
            });
            
            // Add selected class to clicked row
            this.classList.add('selected');
            
            // Check the checkbox
            const checkbox = this.querySelector('.reservation-checkbox');
            if (checkbox) checkbox.checked = true;
            
            // Load reservation details
            const reservationId = this.dataset.id;
            loadReservationDetails(reservationId);
        });
    });
    
    // Search button
    document.getElementById('searchReservedBtn').addEventListener('click', searchReservations);
    
    // Pagination buttons
    document.getElementById('prevPageBtn').addEventListener('click', prevPage);
    document.getElementById('nextPageBtn').addEventListener('click', nextPage);
    
    // Add service button
    document.getElementById('addServiceBtn').addEventListener('click', addService);
    
    // Reset service button
    document.getElementById('resetServiceBtn').addEventListener('click', resetServiceForm);
    
    // Add payment button
    document.getElementById('addPaymentBtn').addEventListener('click', addPayment);
    
    // Reset payment button
    document.getElementById('resetPaymentBtn').addEventListener('click', resetPaymentForm);
    
    // Print receipt button
    document.getElementById('printReceiptBtn').addEventListener('click', printReceipt);
    
    // Check in button
    document.getElementById('checkInBtn').addEventListener('click', showCheckInModal);
    
    // Check in all selected button
    document.getElementById('checkInAllBtn').addEventListener('click', checkInSelected);
    
    // Save reservation button
    document.getElementById('saveReservationBtn').addEventListener('click', saveReservation);
    
    // Cancel reservation button
    document.getElementById('cancelReservationBtn').addEventListener('click', showCancelModal);
    
    // Reset all button
    document.getElementById('resetAllBtn').addEventListener('click', resetAllForms);
    
    // Confirm check in button (modal)
    document.getElementById('confirmCheckInBtn').addEventListener('click', confirmCheckIn);
    
    // Real-time search
    document.getElementById('lastNameSearch').addEventListener('input', searchReservations);
    
    // Load first reservation by default
    if (document.querySelector('.reservation-row')) {
        document.querySelector('.reservation-row').click();
    }
    
    // Update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function loadReservationDetails(reservationId) {
    // Sample data for reservations
    const reservationData = {
        'REC100113': {
            firstName: 'Inojan 93',
            lastName: 'Maheswaran',
            adults: 2,
            children: 0,
            numberOfNights: 2,
            numberOfRooms: 2,
            roomCategory: 'standard',
            roomFrom: '201',
            roomTo: '202',
            roomType: 'double',
            mealPlan: 'bb',
            discountPercent: 0,
            adultCount: 2,
            extraPersonCharges: 0,
            extraPersonsCount: 0,
            subTotal: '650.00',
            advancePaid: '325.00',
            totalTaxInc: '650.00',
            balanceDue: '325.00',
            services: [
                { code: 'TR001', name: 'Airport Pickup', qty: 1, amount: '50.00' }
            ],
            payments: [
                { receiptNo: 'RCT001235', type: 'Cash', date: '2025-12-19', amount: '325.00' }
            ]
        },
        'REC100112': {
            firstName: 'Inojan 03',
            lastName: 'Maheswaran',
            adults: 1,
            children: 0,
            numberOfNights: 2,
            numberOfRooms: 1,
            roomCategory: 'deluxe',
            roomFrom: '101',
            roomTo: '101',
            roomType: 'single',
            mealPlan: 'bb',
            discountPercent: 0,
            adultCount: 1,
            extraPersonCharges: 0,
            extraPersonsCount: 0,
            subTotal: '300.00',
            advancePaid: '150.00',
            totalTaxInc: '300.00',
            balanceDue: '150.00',
            services: [],
            payments: [
                { receiptNo: 'RCT001236', type: 'Card', date: '2025-12-19', amount: '150.00' }
            ]
        },
        'REC100111': {
            firstName: 'Inojan',
            lastName: 'Maheswaran',
            adults: 2,
            children: 1,
            numberOfNights: 7,
            numberOfRooms: 1,
            roomCategory: 'standard',
            roomFrom: '102',
            roomTo: '102',
            roomType: 'double',
            mealPlan: 'hb',
            discountPercent: 10,
            adultCount: 2,
            extraPersonCharges: 25,
            extraPersonsCount: 1,
            subTotal: '800.00',
            advancePaid: '400.00',
            totalTaxInc: '800.00',
            balanceDue: '400.00',
            services: [
                { code: 'SPA001', name: 'Spa Treatment', qty: 2, amount: '80.00' }
            ],
            payments: [
                { receiptNo: 'RCT001237', type: 'Bank Transfer', date: '2025-12-19', amount: '400.00' }
            ]
        }
    };
    
    const data = reservationData[reservationId] || reservationData['REC100113'];
    
    // Update form fields
    document.getElementById('guestFirstName').value = data.firstName;
    document.getElementById('guestLastName').value = data.lastName;
    document.getElementById('adultsCount').value = data.adults;
    document.getElementById('childrenCount').value = data.children;
    document.getElementById('numberOfNights').value = data.numberOfNights;
    document.getElementById('numberOfRooms').value = data.numberOfRooms;
    document.getElementById('roomCategory').value = data.roomCategory;
    document.getElementById('roomFrom').value = data.roomFrom;
    document.getElementById('roomTo').value = data.roomTo;
    document.getElementById('roomType').value = data.roomType;
    document.getElementById('mealPlan').value = data.mealPlan;
    document.getElementById('discountPercent').value = data.discountPercent;
    document.getElementById('adultCount').value = data.adultCount;
    document.getElementById('extraPersonCharges').value = data.extraPersonCharges;
    document.getElementById('extraPersonsCount').value = data.extraPersonsCount;
    
    // Update balance
    updateBalance(data.subTotal, data.advancePaid, data.totalTaxInc, data.balanceDue);
    
    // Update services table
    updateServicesTable(data.services);
    
    // Update payments table
    updatePaymentsTable(data.payments);
    
    // Update added rooms table
    updateAddedRoomsTable(data);
    
    showAlert(`Loaded reservation ${reservationId} details`, 'info');
}

function searchReservations() {
    const searchTerm = document.getElementById('lastNameSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.reservation-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const lastName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const firstName = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const resNo = row.querySelector('td:nth-child(2) .badge').textContent.toLowerCase();
        
        if (!searchTerm || 
            lastName.includes(searchTerm) || 
            firstName.includes(searchTerm) || 
            resNo.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Update showing count
    document.getElementById('showingCount').textContent = visibleCount;
    
    if (visibleCount === 0) {
        showAlert('No matching reservations found', 'warning');
    }
}

function prevPage() {
    let currentPage = parseInt(document.getElementById('currentPage').textContent);
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('currentPage').textContent = currentPage;
        // In a real app, you would fetch the previous page of data
        showAlert(`Loading page ${currentPage}...`, 'info');
    }
}

function nextPage() {
    let currentPage = parseInt(document.getElementById('currentPage').textContent);
    const totalPages = parseInt(document.getElementById('totalPages').textContent);
    
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById('currentPage').textContent = currentPage;
        // In a real app, you would fetch the next page of data
        showAlert(`Loading page ${currentPage}...`, 'info');
    }
}

function addService() {
    const serviceCode = document.querySelector('input[placeholder="SVC001"]').value;
    const serviceName = document.querySelector('input[placeholder="Service name"]').value;
    const qty = document.querySelector('input[placeholder*="Qty"]').value || 1;
    const amount = document.querySelector('input[placeholder*="Amount"]').value || 0;
    
    if (!serviceCode || !serviceName) {
        showAlert('Please enter service code and name', 'warning');
        return;
    }
    
    const total = (parseFloat(qty) * parseFloat(amount)).toFixed(2);
    
    // Add to services table
    const table = document.getElementById('addedServicesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${serviceCode}</td>
        <td>${serviceName}</td>
        <td>${qty}</td>
        <td>$${amount}</td>
        <td>$${total}</td>
        <td>
            <button class="btn btn-sm btn-outline-danger remove-service">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    
    // Add event listener to remove button
    newRow.querySelector('.remove-service').addEventListener('click', function() {
        this.closest('tr').remove();
        updateBalanceAfterServiceRemoval(parseFloat(total));
    });
    
    // Update balance
    updateBalanceWithService(parseFloat(total));
    
    // Clear form
    document.querySelector('input[placeholder="SVC001"]').value = '';
    document.querySelector('input[placeholder="Service name"]').value = '';
    
    showAlert('Service added successfully', 'success');
}

function resetServiceForm() {
    document.querySelectorAll('.card:has(.fa-concierge-bell) input, .card:has(.fa-concierge-bell) select').forEach(field => {
        if (!field.closest('table')) {
            field.value = '';
        }
    });
    showAlert('Service form reset', 'info');
}

function addPayment() {
    const receiptNo = document.querySelector('input[value="RCT001235"]').value;
    const paymentType = document.getElementById('paymentType').value;
    const amount = document.querySelector('input[placeholder*="Amount"]').nextElementSibling.value;
    const date = document.querySelector('input[type="date"]').value;
    
    if (!receiptNo || !paymentType || !amount) {
        showAlert('Please fill in all payment details', 'warning');
        return;
    }
    
    // Add to payments table
    const table = document.getElementById('paymentsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${receiptNo}</td>
        <td><span class="badge bg-success">${paymentType}</span></td>
        <td>${date}</td>
        <td class="text-success">$${parseFloat(amount).toFixed(2)}</td>
        <td>
            <button class="btn btn-sm btn-outline-danger remove-payment">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    
    // Add event listener to remove button
    newRow.querySelector('.remove-payment').addEventListener('click', function() {
        this.closest('tr').remove();
        updateBalanceAfterPaymentRemoval(parseFloat(amount));
    });
    
    // Update balance
    updateBalanceWithPayment(parseFloat(amount));
    
    // Generate new receipt number
    const newReceiptNo = 'RCT' + (parseInt(receiptNo.replace('RCT', '')) + 1).toString().padStart(6, '0');
    document.querySelector('input[value="RCT001235"]').value = newReceiptNo;
    
    showAlert('Payment added successfully', 'success');
}

function resetPaymentForm() {
    document.querySelectorAll('.card:has(.fa-credit-card) input, .card:has(.fa-credit-card) select').forEach(field => {
        field.value = '';
    });
    showAlert('Payment form reset', 'info');
}

function printReceipt() {
    const activeRow = document.querySelector('.reservation-row.selected');
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

function showCheckInModal() {
    const activeRow = document.querySelector('.reservation-row.selected');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    const guestName = activeRow.querySelector('td:nth-child(3)').textContent + ' ' + 
                      activeRow.querySelector('td:nth-child(4)').textContent;
    const roomFrom = document.getElementById('roomFrom').value;
    const roomTo = document.getElementById('roomTo').value;
    
    document.getElementById('modalReservationId').textContent = reservationId;
    document.getElementById('modalGuestName').textContent = guestName;
    document.getElementById('modalRoomNumber').textContent = roomFrom === roomTo ? roomFrom : `${roomFrom}-${roomTo}`;
    
    const checkInModal = new bootstrap.Modal(document.getElementById('checkInModal'));
    checkInModal.show();
}

function confirmCheckIn() {
    const reservationId = document.getElementById('modalReservationId').textContent;
    const assignKey = document.getElementById('assignRoomKeyCheckbox').checked;
    const printForm = document.getElementById('printRegistrationCheckbox').checked;
    
    // Update reservation status
    document.getElementById('reservationStatus').value = 'checked-in';
    
    // Update the selected row
    const activeRow = document.querySelector('.reservation-row.selected');
    if (activeRow) {
        activeRow.classList.add('checked-in');
        activeRow.style.opacity = '0.7';
    }
    
    // Close modal
    const checkInModal = bootstrap.Modal.getInstance(document.getElementById('checkInModal'));
    checkInModal.hide();
    
    // Show success message
    showAlert(`Guest ${reservationId} checked in successfully`, 'success');
    
    if (assignKey) {
        showAlert('Room key assigned to guest', 'info');
    }
    
    if (printForm) {
        showAlert('Registration form printed', 'info');
    }
}

function checkInSelected() {
    const selectedCheckboxes = document.querySelectorAll('.reservation-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        showAlert('Please select at least one reservation to check in', 'warning');
        return;
    }
    
    if (confirm(`Check in ${selectedCheckboxes.length} selected reservation(s)?`)) {
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('.reservation-row');
            row.classList.add('checked-in');
            row.style.opacity = '0.7';
        });
        
        showAlert(`${selectedCheckboxes.length} reservation(s) checked in successfully`, 'success');
    }
}

function saveReservation() {
    const activeRow = document.querySelector('.reservation-row.selected');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    
    // Update current time
    const now = new Date();
    document.getElementById('actionTime').value = now.toTimeString().split(' ')[0];
    
    // In a real application, you would save to database
    showAlert(`Reservation ${reservationId} saved successfully`, 'success');
}

function showCancelModal() {
    const activeRow = document.querySelector('.reservation-row.selected');
    if (!activeRow) {
        showAlert('Please select a reservation first', 'warning');
        return;
    }
    
    const reservationId = activeRow.dataset.id;
    
    if (confirm(`Cancel reservation ${reservationId}? This action cannot be undone.`)) {
        // Update status
        document.getElementById('reservationStatus').value = 'cancelled';
        
        // Remove row from table
        activeRow.remove();
        
        // Clear form
        resetAllForms();
        
        showAlert(`Reservation ${reservationId} cancelled`, 'danger');
    }
}

function resetAllForms() {
    // Reset all form fields except selected reservation
    document.querySelectorAll('input:not([type="checkbox"]), select, textarea').forEach(field => {
        if (!field.id.includes('Date') && !field.id.includes('Time')) {
            field.value = '';
        }
    });
    
    // Clear tables
    document.getElementById('addedServicesTable').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('paymentsTable').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('addedRoomsTable').innerHTML = '';
    
    // Reset balance
    updateBalance('0.00', '0.00', '0.00', '0.00');
    
    showAlert('All forms reset', 'info');
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

function updateBalanceAfterServiceRemoval(serviceAmount) {
    const balanceElements = document.querySelectorAll('.balance-summary span');
    if (balanceElements.length >= 4) {
        const currentSubTotal = parseFloat(balanceElements[0].nextSibling.textContent.replace('$', ''));
        const currentTotal = parseFloat(balanceElements[2].nextSibling.textContent.replace('$', ''));
        const currentBalance = parseFloat(balanceElements[3].nextSibling.textContent.replace('$', ''));
        
        balanceElements[0].nextSibling.textContent = `$${(currentSubTotal - serviceAmount).toFixed(2)}`;
        balanceElements[2].nextSibling.textContent = `$${(currentTotal - serviceAmount).toFixed(2)}`;
        balanceElements[3].nextSibling.textContent = `$${(currentBalance - serviceAmount).toFixed(2)}`;
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

function updateBalanceAfterPaymentRemoval(paymentAmount) {
    const balanceElements = document.querySelectorAll('.balance-summary span');
    if (balanceElements.length >= 4) {
        const currentAdvance = parseFloat(balanceElements[1].nextSibling.textContent.replace('$', ''));
        const currentBalance = parseFloat(balanceElements[3].nextSibling.textContent.replace('$', ''));
        
        balanceElements[1].nextSibling.textContent = `$${(currentAdvance - paymentAmount).toFixed(2)}`;
        balanceElements[3].nextSibling.textContent = `$${(currentBalance + paymentAmount).toFixed(2)}`;
    }
}

function updateServicesTable(services) {
    const table = document.getElementById('addedServicesTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    
    services.forEach(service => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${service.code}</td>
            <td>${service.name}</td>
            <td>${service.qty}</td>
            <td>$${service.amount}</td>
            <td>$${(parseFloat(service.qty) * parseFloat(service.amount)).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-service">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        
        // Add event listener to remove button
        row.querySelector('.remove-service').addEventListener('click', function() {
            this.closest('tr').remove();
            updateBalanceAfterServiceRemoval(parseFloat(service.qty) * parseFloat(service.amount));
        });
    });
}

function updatePaymentsTable(payments) {
    const table = document.getElementById('paymentsTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    
    payments.forEach(payment => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${payment.receiptNo}</td>
            <td><span class="badge bg-success">${payment.type}</span></td>
            <td>${payment.date}</td>
            <td class="text-success">$${payment.amount}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger remove-payment">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        
        // Add event listener to remove button
        row.querySelector('.remove-payment').addEventListener('click', function() {
            this.closest('tr').remove();
            updateBalanceAfterPaymentRemoval(parseFloat(payment.amount));
        });
    });
}

function updateAddedRoomsTable(data) {
    const table = document.getElementById('addedRoomsTable');
    table.innerHTML = `
        <tr>
            <td>${data.roomFrom}${data.roomFrom !== data.roomTo ? `-${data.roomTo}` : ''}</td>
            <td>${data.roomType}</td>
            <td>${data.mealPlan}</td>
            <td>2025-12-30</td>
            <td>2026-01-01</td>
            <td>$${data.subTotal}</td>
        </tr>
    `;
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    document.getElementById('actionTime').value = timeString;
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