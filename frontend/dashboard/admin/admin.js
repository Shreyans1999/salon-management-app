document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'admin') {
        window.location.href = '../../auth/login.html';
        return;
    }

    loadServices();
    loadStaff();
    loadTodayAppointments();
    loadReviews();

    // Event Listeners
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);
    document.getElementById('staffForm').addEventListener('submit', handleStaffSubmit);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const serviceData = {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        duration: parseInt(document.getElementById('serviceDuration').value),
        price: parseFloat(document.getElementById('servicePrice').value)
    };

    try {
        const response = await fetch('https://localhost:3000/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(serviceData)
        });

        if (response.ok) {
            alert('Service added successfully');
            e.target.reset();
            loadServices();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error adding service:', error);
        alert('Failed to add service');
    }
}

async function handleStaffSubmit(e) {
    e.preventDefault();
    
    const staffData = {
        name: document.getElementById('staffName').value,
        specialization: document.getElementById('specialization').value,
        workingHours: {
            start: document.getElementById('workingHoursStart').value,
            end: document.getElementById('workingHoursEnd').value
        }
    };

    try {
        const response = await fetch('https://localhost:3000/staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(staffData)
        });

        if (response.ok) {
            alert('Staff member added successfully');
            e.target.reset();
            loadStaff();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error adding staff member:', error);
        alert('Failed to add staff member');
    }
}

async function loadServices() {
    try {
        const response = await fetch('https://localhost:3000/services', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const services = await response.json();
        const servicesList = document.getElementById('servicesList');
        
        servicesList.innerHTML = services.map(service => `
            <div class="border p-4 rounded">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold">${service.name}</h3>
                    <span class="text-green-600">$${service.price}</span>
                </div>
                <p class="text-gray-600 text-sm">${service.description}</p>
                <p class="text-gray-500 text-sm">Duration: ${service.duration} minutes</p>
                <div class="mt-2">
                    <button onclick="editService('${service.id}')"
                            class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                    <button onclick="deleteService('${service.id}')"
                            class="text-red-500 hover:text-red-700">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function loadStaff() {
    try {
        const response = await fetch('https://localhost:3000/staff', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const staff = await response.json();
        const staffList = document.getElementById('staffList');
        
        staffList.innerHTML = staff.map(member => `
            <div class="border p-4 rounded">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold">${member.name}</h3>
                    <span class="text-gray-600">${member.specialization}</span>
                </div>
                <p class="text-gray-500 text-sm">
                    Working Hours: ${member.workingHours.start} - ${member.workingHours.end}
                </p>
                <div class="mt-2">
                    <button onclick="editStaff('${member.id}')"
                            class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                    <button onclick="toggleStaffAvailability('${member.id}', ${!member.isAvailable})"
                            class="text-${member.isAvailable ? 'red' : 'green'}-500 
                                   hover:text-${member.isAvailable ? 'red' : 'green'}-700">
                        ${member.isAvailable ? 'Set Unavailable' : 'Set Available'}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading staff:', error);
    }
}

// ... continuing admin.js

async function loadTodayAppointments() {
    try {
        const response = await fetch('https://localhost:3000/appointments/today', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const appointments = await response.json();
        const appointmentsList = document.getElementById('appointmentsList');
        
        appointmentsList.innerHTML = appointments.map(appointment => `
            <div class="border p-4 rounded ${getStatusColor(appointment.status)}">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold">${appointment.Service.name}</h3>
                    <span class="text-sm font-semibold">${appointment.time}</span>
                </div>
                <p class="text-sm">Client: ${appointment.User.name}</p>
                <p class="text-sm">Staff: ${appointment.Staff.name}</p>
                <p class="text-sm">Status: ${appointment.status}</p>
                <div class="mt-2 space-x-2">
                    ${getActionButtons(appointment)}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-50',
        'confirmed': 'bg-green-50',
        'cancelled': 'bg-red-50',
        'completed': 'bg-blue-50'
    };
    return colors[status] || 'bg-gray-50';
}

function getActionButtons(appointment) {
    if (appointment.status === 'pending') {
        return `
            <button onclick="updateAppointmentStatus('${appointment.id}', 'confirmed')"
                    class="text-green-500 hover:text-green-700">Confirm</button>
            <button onclick="updateAppointmentStatus('${appointment.id}', 'cancelled')"
                    class="text-red-500 hover:text-red-700">Cancel</button>
        `;
    }
    if (appointment.status === 'confirmed') {
        return `
            <button onclick="updateAppointmentStatus('${appointment.id}', 'completed')"
                    class="text-blue-500 hover:text-blue-700">Mark Complete</button>
        `;
    }
    return '';
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        const response = await fetch(`https://localhost:3000/appointments/${appointmentId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            loadTodayAppointments();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../../auth/login.html';
}