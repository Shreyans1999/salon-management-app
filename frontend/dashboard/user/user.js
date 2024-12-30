document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../auth/login.html';
        return;
    }

    loadAppointments();
    loadReviews();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../../auth/login.html';
    });
});

async function loadAppointments() {
    try {
        const response = await fetch('https://localhost:3000/appointments', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const appointments = await response.json();
        const appointmentsList = document.getElementById('appointmentsList');
        
        appointmentsList.innerHTML = appointments.map(appointment => `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="font-bold text-lg mb-2">
                    ${appointment.Service.name}
                </div>
                <p class="text-gray-700">
                    Date: ${new Date(appointment.date).toLocaleDateString()}
                </p>
                <p class="text-gray-700">
                    Time: ${appointment.time}
                </p>
                <p class="text-gray-700">
                    Status: <span class="font-semibold">${appointment.status}</span>
                </p>
                ${appointment.status === 'confirmed' ? `
                    <button onclick="cancelAppointment('${appointment.id}')"
                            class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                        Cancel
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function loadReviews() {
    try {
        const response = await fetch('https://localhost:3000/reviews', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const reviews = await response.json();
        const reviewsList = document.getElementById('reviewsList');
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center mb-2">
                    ${Array(5).fill().map((_, i) => `
                        <svg class="w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}" 
                             fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    `).join('')}
                </div>
                <p class="text-gray-700">${review.comment}</p>
                ${review.staffResponse ? `
                    <div class="mt-4 p-4 bg-gray-50 rounded">
                        <p class="text-sm font-semibold">Staff Response:</p>
                        <p class="text-gray-600">${review.staffResponse}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:3000/appointments/cancel/${appointmentId}`, {
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