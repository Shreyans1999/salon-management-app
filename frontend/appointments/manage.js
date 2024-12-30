let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    loadAppointments();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('applyFilters').addEventListener('click', () => {
        currentPage = 1;
        loadAppointments();
    });

    document.getElementById('statusFilter').addEventListener('change', () => {
        currentPage = 1;
        loadAppointments();
    });

    document.getElementById('dateFilter').addEventListener('change', () => {
        currentPage = 1;
        loadAppointments();
    });
}

async function loadAppointments() {
    const status = document.getElementById('statusFilter').value;
    const date = document.getElementById('dateFilter').value;

    try {
        const response = await fetch(`https://localhost:3000/appointments/list?page=${currentPage}&limit=${itemsPerPage}&status=${status}&date=${date}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const data = await response.json();
        renderAppointments(data.appointments);
        renderPagination(data.totalPages);
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

function renderAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    
    appointmentsList.innerHTML = appointments.map(appointment => `
        <div class="bg-white shadow rounded-lg p-6 ${getStatusColor(appointment.status)}">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-lg">${appointment.Service.name}</h3>
                    <p class="text-gray-600">with ${appointment.Staff.name}</p>
                    <p class="text-sm text-gray-500">
                        ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}
                    </p>
                </div>
                <div class="text-right">
                    <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold
                               ${getStatusBadgeColor(appointment.status)}">
                        ${appointment.status}
                    </span>
                </div>
            </div>
            
            <div class="mt-4 flex justify-end space-x-2">
                ${getActionButtons(appointment)}
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'pending': 'border-l-4 border-yellow-400',
        'confirmed': 'border-l-4 border-green-400',
        'completed': 'border-l-4 border-blue-400',
        'cancelled': 'border-l-4 border-red-400'
    };
    return colors[status] || '';
}

function getStatusBadgeColor(status) {
    const colors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || '';
}

function getActionButtons(appointment) {
    if (appointment.status === 'confirmed') {
        return `
            <button onclick="rescheduleAppointment('${appointment.id}')"
                    class="text-blue-500 hover:text-blue-700">
                Reschedule
            </button>
            <button onclick="cancelAppointment('${appointment.id}')"
                    class="text-red-500 hover:text-red-700">
                Cancel
            </button>
        `;
    }
    if (appointment.status === 'completed') {
        return `
            <button onclick="leaveReview('${appointment.id}')"
                    class="text-green-500 hover:text-green-700">
                Leave Review
            </button>
        `;
    }
    return '';
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    let buttons = '';

    if (currentPage > 1) {
        buttons += `
            <button onclick="changePage(${currentPage - 1})"
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
                Previous
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button onclick="changePage(${i})"
                    class="px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}">
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {
        buttons += `
            <button onclick="changePage(${currentPage + 1})"
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
                Next
            </button>
        `;
    }

    pagination.innerHTML = buttons;
}

function changePage(page) {
    currentPage = page;
    loadAppointments();
}

async function rescheduleAppointment(appointmentId) {
    // Redirect to booking page with pre-filled data
    window.location.href = `book.html?reschedule=${appointmentId}`;
}

async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:3000/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            alert('Appointment cancelled successfully');
            loadAppointments();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment');
    }
}

function leaveReview(appointmentId) {
    window.location.href = `../reviews/create.html?appointment=${appointmentId}`;
}