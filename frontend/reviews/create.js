let currentRating = 0;
let appointmentId = null;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Get appointment ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    appointmentId = urlParams.get('appointment');
    
    if (!appointmentId) {
        alert('No appointment specified');
        window.location.href = '../dashboard/user/index.html';
        return;
    }

    initializeRatingStars();
    loadAppointmentDetails();
    setupFormSubmission();
});

function initializeRatingStars() {
    const ratingStars = document.getElementById('ratingStars');
    ratingStars.innerHTML = Array(5).fill().map((_, index) => `
        <button type="button" 
                class="star-btn text-3xl focus:outline-none"
                data-rating="${index + 1}">
            ★
        </button>
    `).join('');

    // Add event listeners to stars
    document.querySelectorAll('.star-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            currentRating = parseInt(e.target.dataset.rating);
            updateStarDisplay();
        });
    });
}

function updateStarDisplay() {
    document.querySelectorAll('.star-btn').forEach((star, index) => {
        star.style.color = index < currentRating ? '#FFD700' : '#D1D5DB';
    });
}

async function loadAppointmentDetails() {
    try {
        const response = await fetch(`https://localhost:3000/appointments/${appointmentId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const appointment = await response.json();
        document.getElementById('appointmentDetails').innerHTML = `
            <div class="bg-gray-50 p-4 rounded">
                <h3 class="font-bold text-lg mb-2">${appointment.Service.name}</h3>
                <p class="text-gray-600">with ${appointment.Staff.name}</p>
                <p class="text-sm text-gray-500">
                    ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}
                </p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading appointment details:', error);
        alert('Failed to load appointment details');
    }
}

function setupFormSubmission() {
    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        if (currentRating === 0) {
            alert('Please select a rating');
            return;
        }

        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch('https://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    appointmentId,
                    rating: currentRating,
                    comment
                })
            });

            if (response.ok) {
                alert('Review submitted successfully!');
                window.location.href = '../dashboard/user/index.html';
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    });
}