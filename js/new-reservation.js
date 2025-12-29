// New Reservation Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    document.getElementById('checkIn').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('checkOut').value = threeDaysLater.toISOString().split('T')[0];
    
    // Calculate nights
    calculateNights();
    
    // Event listeners for date changes
    document.getElementById('checkIn').addEventListener('change', function() {
        calculateNights();
        updateSummary();
    });
    
    document.getElementById('checkOut').addEventListener('change', function() {
        calculateNights();
        updateSummary();
    });
    
    // Event listeners for other form changes
    document.getElementById('noOfRooms').addEventListener('input', updateSummary);
    document.getElementById('adults').addEventListener('input', updateSummary);
    document.getElementById('children').addEventListener('input', updateSummary);
    document.getElementById('roomCategory').addEventListener('change', updateSummary);
    document.getElementById('roomType').addEventListener('change', updateSummary);
    document.getElementById('mealPlan').addEventListener('change', updateSummary);
    
    // Calculate estimate button
    document.getElementById('calculateEstimateBtn').addEventListener('click', calculateEstimate);
    
    // Assign room button
    document.getElementById('assignRoomBtn').addEventListener('click', function() {
        const assignRoomModal = new bootstrap.Modal(document.getElementById('assignRoomModal'));
        assignRoomModal.show();
    });
    
    // Add services button
    document.getElementById('addServicesBtn').addEventListener('click', function() {
        const addServicesModal = new bootstrap.Modal(document.getElementById('addServicesModal'));
        addServicesModal.show();
    });
    
    // Send confirmation button
    document.getElementById('sendConfirmationBtn').addEventListener('click', sendConfirmation);
    
    // Cancel reservation button
    document.getElementById('cancelReservationBtn').addEventListener('click', cancelReservation);
    
    // Quick save button
    document.getElementById('quickReservationBtn').addEventListener('click', quickSaveReservation);
    
    // Reset guest form button
    document.getElementById('resetGuestForm').addEventListener('click', resetGuestForm);
    
    // Confirm guest button
    document.getElementById('confirmGuestBtn').addEventListener('click', confirmGuest);
    
    // Add extra charge button
    document.getElementById('addExtraChargeBtn').addEventListener('click', addExtraCharge);
    
    // Select guest buttons
    document.querySelectorAll('.select-guest').forEach(button => {
        button.addEventListener('click', function() {
            selectGuest(this.closest('tr'));
        });
    });
    
    // Initialize summary
    updateSummary();
});

function calculateNights() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        document.getElementById('nights').value = nights > 0 ? nights : 0;
    } else {
        document.getElementById('nights').value = 0;
    }
}

function calculateEstimate() {
    const nights = parseInt(document.getElementById('nights').value) || 0;
    const noOfRooms = parseInt(document.getElementById('noOfRooms').value) || 1;
    const roomCategory = document.getElementById('roomCategory').value;
    const roomType = document.getElementById('roomType').value;
    const mealPlan = document.getElementById('mealPlan').value;
    
    if (nights === 0) {
        showAlert('Please select check-in and check-out dates', 'warning');
        return;
    }
    
    if (!roomCategory || !roomType || !mealPlan) {
        showAlert('Please select room category, type and meal plan', 'warning');
        return;
    }
    
    // Calculate base room rate
    let roomRate = 0;
    switch(roomCategory) {
        case 'standard': roomRate = 100; break;
        case 'deluxe': roomRate = 150; break;
        case 'suite': roomRate = 250; break;
        case 'executive': roomRate = 300; break;
        default: roomRate = 100;
    }
    
    // Adjust for room type
    switch(roomType) {
        case 'single': roomRate *= 1.0; break;
        case 'double': roomRate *= 1.5; break;
        case 'twin': roomRate *= 1.3; break;
        case 'family': roomRate *= 2.0; break;
    }
    
    // Add meal plan cost
    let mealRate = 0;
    switch(mealPlan) {
        case 'bed-breakfast': mealRate = 20; break;
        case 'half-board': mealRate = 40; break;
        case 'full-board': mealRate = 60; break;
        case 'all-inclusive': mealRate = 80; break;
    }
    
    const subTotal = (roomRate + mealRate) * nights * noOfRooms;
    const vat = subTotal * 0.15;
    const serviceCharge = subTotal * 0.10;
    const tdl = subTotal * 0.02;
    const nbt = subTotal * 0.02;
    const other = parseFloat(document.getElementById('other').value) || 0;
    const total = subTotal + vat + serviceCharge + tdl + nbt + other;
    
    // Update estimate fields
    document.getElementById('subTotal').value = subTotal.toFixed(2);
    document.getElementById('vat').value = vat.toFixed(2);
    document.getElementById('serviceCharge').value = serviceCharge.toFixed(2);
    document.getElementById('tdl').value = tdl.toFixed(2);
    document.getElementById('nbt').value = nbt.toFixed(2);
    document.getElementById('total').value = total.toFixed(2);
    
    // Update summary
    updateSummary();
    
    showAlert('Estimate calculated successfully', 'success');
}

function updateSummary() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const noOfRooms = document.getElementById('noOfRooms').value;
    const adults = document.getElementById('adults').value;
    const children = document.getElementById('children').value;
    const nights = document.getElementById('nights').value;
    const total = document.getElementById('total').value;
    
    document.getElementById('summaryCheckIn').textContent = checkIn || '-';
    document.getElementById('summaryCheckOut').textContent = checkOut || '-';
    document.getElementById('summaryNights').textContent = nights;
    document.getElementById('summaryRooms').textContent = noOfRooms;
    document.getElementById('summaryGuests').textContent = parseInt(adults) + parseInt(children);
    document.getElementById('summaryTotal').textContent = total ? `$${parseFloat(total).toFixed(2)}` : '$0.00';
}

function selectGuest(row) {
    const cells = row.querySelectorAll('td');
    
    // Auto-fill guest form with selected guest data
    document.querySelector('select[required]').value = 'Mr';
    document.querySelectorAll('input[type="text"]')[0].value = cells[1].textContent;
    document.querySelectorAll('input[type="text"]')[1].value = cells[2].textContent;
    document.querySelector('input[type="email"]').value = cells[3].textContent;
    document.querySelector('input[type="tel"]').value = cells[5].textContent;
    
    // Highlight selected row
    document.querySelectorAll('tbody tr').forEach(r => {
        r.classList.remove('table-primary');
    });
    row.classList.add('table-primary');
    
    showAlert('Guest selected successfully', 'success');
}

function quickSaveReservation() {
    // Validate required fields
    const requiredFields = [
        'source', 'checkIn', 'checkOut', 'noOfRooms', 
        'roomCategory', 'roomType', 'adults', 'mealPlan'
    ];
    
    let isValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    // Generate new reservation ID
    const newReservationId = 'REC' + (100114 + Math.floor(Math.random() * 100));
    document.getElementById('reservationIdDisplay').textContent = newReservationId;
    
    // Show success message
    showAlert(`Reservation ${newReservationId} saved successfully`, 'success');
    
    // Update UI
    document.getElementById('quickReservationBtn').innerHTML = '<i class="fas fa-check me-1"></i> Saved';
    document.getElementById('quickReservationBtn').classList.remove('btn-primary');
    document.getElementById('quickReservationBtn').classList.add('btn-success');
    
    setTimeout(() => {
        document.getElementById('quickReservationBtn').innerHTML = '<i class="fas fa-bolt me-1"></i> Quick Save';
        document.getElementById('quickReservationBtn').classList.remove('btn-success');
        document.getElementById('quickReservationBtn').classList.add('btn-primary');
    }, 3000);
}

function sendConfirmation() {
    const reservationId = document.getElementById('reservationIdDisplay').textContent;
    showAlert(`Confirmation email sent for reservation ${reservationId}`, 'info');
}

function cancelReservation() {
    if (confirm('Are you sure you want to cancel this reservation?')) {
        showAlert('Reservation cancelled', 'danger');
        // Reset form
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

function resetGuestForm() {
    document.querySelectorAll('#guestForm input, #guestForm select, #guestForm textarea').forEach(field => {
        field.value = '';
    });
    showAlert('Guest form reset', 'info');
}

function confirmGuest() {
    // Validate guest form
    const guestForm = document.querySelector('#guestForm');
    if (!guestForm.checkValidity()) {
        showAlert('Please fill in all required guest information', 'warning');
        return;
    }
    
    showAlert('Guest information confirmed and saved', 'success');
}

function addExtraCharge() {
    const table = document.getElementById('extraChargesTable');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" placeholder="Charge description"></td>
        <td><input type="number" class="form-control form-control-sm" placeholder="0.00"></td>
        <td>
            <button class="btn btn-sm btn-outline-danger remove-charge">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    table.appendChild(newRow);
    
    // Add event listener to remove button
    newRow.querySelector('.remove-charge').addEventListener('click', function() {
        this.closest('tr').remove();
        updateEstimate();
    });
    
    // Add event listener to amount input
    newRow.querySelector('input[type="number"]').addEventListener('input', updateEstimate);
}

function updateEstimate() {
    // Recalculate total with extra charges
    calculateEstimate();
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