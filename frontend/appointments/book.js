let currentStep = 1;
let bookingData = {
    serviceId: null,
    staffId: null,
    date: null,
    time: null
};

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Set minimum date to today
    document.getElementById('date').min = new Date().toISOString().split('T')[0];

    loadServices();
    setupNavigationButtons();
});

function setupNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep()) {
            if (currentStep < 4) {
                showStep(currentStep + 1);
            } else {
                submitBooking();
            }
        }
    });
}

function showStep(step) {
    document.querySelectorAll('.booking-step').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step${step}`).classList.remove('hidden');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.classList.toggle('hidden', step === 1);
    nextBtn.textContent = step === 4 ? 'Confirm Booking' : 'Next';

    currentStep = step;

    if (step === 2 && bookingData.serviceId) {
        loadStaffForService(bookingData.serviceId);
    } else if (step === 3 && bookingData.staffId) {
        loadAvailableTimeSlots();
    } else if (step === 4) {
        showBookingSummary();
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
            <div class="border rounded p-4 cursor-pointer hover:bg-gray-50 ${
                bookingData.serviceId === service.id ? 'border-blue-500' : ''
            }" onclick="selectService('${service.id}')">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold">${service.name}</h3>
                    <span class="text-green-600">$${service.price}</span>
                </div>
                <p class="text-gray-600 text-sm">${service.description}</p>
                <p class="text-gray-500 text-sm">Duration: ${service.duration} minutes</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function loadStaffForService(serviceId) {
    try {
        const response = await fetch(`https://localhost:3000/staff/available/${serviceId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const staff = await response.json();
        const staffList = document.getElementById('staffList');
        
        staffList.innerHTML = staff.map(member => `
            <div class="border rounded p-4 cursor-pointer hover:bg-gray-50 ${
                bookingData.staffId === member.id ? 'border-blue-500' : ''
            }" onclick="selectStaff('${member.id}')">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold">${member.name}</h3>
                    <span class="text-gray-600">${member.specialization}</span>
                </div>
                <p class="text-gray-500 text-sm">
                    Working Hours: ${member.workingHours.start} - ${member.workingHours.end}
                </p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading staff:', error);
    }
}

async function loadAvailableTimeSlots() {
    const selectedDate = document.getElementById('date').value;
    if (!selectedDate) return;

    try {
        const response = await fetch(`https://localhost:3000/appointments/available-slots`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                serviceId: bookingData.serviceId,
                staffId: bookingData.staffId,
                date: selectedDate
            })
        });

        const timeSlots = await response.json();
        const timeSlotsDiv = document.getElementById('timeSlots');
        
        timeSlotsDiv.innerHTML = timeSlots.map(slot => `
            <button type="button"
                    class="p-2 border rounded ${
                        bookingData.time === slot ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                    }"
                    onclick="selectTimeSlot('${slot}')">
                ${formatTime(slot)}
            </button>
        `).join('');
    } catch (error) {
        console.error('Error loading time slots:', error);
    }
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function selectService(serviceId) {
    bookingData.serviceId = serviceId;
    document.querySelectorAll('#servicesList > div').forEach(div => {
        div.classList.toggle('border-blue-500', div.getAttribute('onclick').includes(serviceId));
    });
}

function selectStaff(staffId) {
    bookingData.staffId = staffId;
    document.querySelectorAll('#staffList > div').forEach(div => {
        div.classList.toggle('border-blue-500', div.getAttribute('onclick').includes(staffId));
    });
}

function selectTimeSlot(time) {
    bookingData.time = time;
    bookingData.date = document.getElementById('date').value;
    document.querySelectorAll('#timeSlots button').forEach(button => {
        button.classList.toggle('bg-blue-500', button.textContent.trim() === formatTime(time));
        button.classList.toggle('text-white', button.textContent.trim() === formatTime(time));
    });
}

function validateStep() {
    switch (currentStep) {
        case 1:
            if (!bookingData.serviceId) {
                alert('Please select a service');
                return false;
            }
            break;
        case 2:
            if (!bookingData.staffId) {
                alert('Please select a staff member');
                return false;
            }
            break;
        case 3:
            if (!bookingData.date || !bookingData.time) {
                alert('Please select both date and time');
                return false;
            }
            break;
    }
    return true;
}

function showBookingSummary() {
    const summaryDiv = document.getElementById('bookingSummary');
    summaryDiv.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="font-bold text-gray-700">Selected Service</h3>
                <p id="summaryService">Loading...</p>
            </div>
            <div>
                <h3 class="font-bold text-gray-700">Selected Staff</h3>
                <p id="summaryStaff">Loading...</p>
            </div>
            <div>
                <h3 class="font-bold text-gray-700">Date & Time</h3>
                <p>${new Date(bookingData.date).toLocaleDateString()} at ${formatTime(bookingData.time)}</p>
            </div>
        </div>
    `;

    // Fetch service and staff details for summary
    fetchBookingSummaryDetails();
}

async function fetchBookingSummaryDetails() {
    try {
        const [serviceRes, staffRes] = await Promise.all([
            fetch(`https://localhost:3000/services/${bookingData.serviceId}`),
            fetch(`https://localhost:3000/staff/${bookingData.staffId}`)
        ]);

        const service = await serviceRes.json();
        const staff = await staffRes.json();

        document.getElementById('summaryService').textContent = 
            `${service.name} ($${service.price}) - ${service.duration} minutes`;
        document.getElementById('summaryStaff').textContent = 
            `${staff.name} - ${staff.specialization}`;
    } catch (error) {
        console.error('Error fetching summary details:', error);
    }
}

async function submitBooking() {
    try {
        const response = await fetch('https://localhost:3000/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Appointment booked successfully!');
            window.location.href = '../dashboard/user/index.html';
        } else {
            alert(data.message || 'Failed to book appointment');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Failed to book appointment');
    }
}