let stripe;
let elements;
let appointmentId;

document.addEventListener('DOMContentLoaded', async () => {
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

    await initializeStripe();
    loadPaymentDetails();
    setupPaymentForm();
});

async function initializeStripe() {
    try {
        const response = await fetch('https://localhost:3000/payments/config');
        const { publishableKey } = await response.json();
        
        stripe = Stripe(publishableKey);
        elements = stripe.elements();

        const card = elements.create('card');
        card.mount('#card-element');

        card.addEventListener('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    } catch (error) {
        console.error('Error initializing Stripe:', error);
        alert('Failed to initialize payment system');
    }
}

async function loadPaymentDetails() {
    try {
        const response = await fetch(`https://localhost:3000/appointments/${appointmentId}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const appointment = await response.json();
        document.getElementById('paymentDetails').innerHTML = `
            <div class="bg-gray-50 p-4 rounded mb-4">
                <h3 class="font-bold text-lg mb-2">${appointment.Service.name}</h3>
                <p class="text-gray-600">with ${appointment.Staff.name}</p>
                <p class="text-sm text-gray-500">
                    ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}
                </p>
                <div class="mt-4 text-xl font-bold">
                    Total: $${appointment.Service.price}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading payment details:', error);
        alert('Failed to load payment details');
    }
}

function setupPaymentForm() {
    document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Create payment intent
            const intentResponse = await fetch('https://localhost:3000/payments/create-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ appointmentId })
            });

            const { clientSecret } = await intentResponse.json();

            // Confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement('card')
                }
            });

            if (result.error) {
                alert(result.error.message);
            } else {
                // Payment successful
                await confirmPayment(result.paymentIntent.id);
                alert('Payment successful!');
                window.location.href = '../dashboard/user/index.html';
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed');
        }
    });
}

async function confirmPayment(paymentIntentId) {
    try {
        await fetch(`https://localhost:3000/payments/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                appointmentId,
                paymentIntentId
            })
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
}