document.addEventListener('DOMContentLoaded', () => {
    loadServices('all');
    setupCategoryFilters();
});

function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('#categoryFilters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter styling
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200');
            });
            button.classList.remove('bg-gray-200');
            button.classList.add('bg-blue-500', 'text-white');

            // Load services for selected category
            const category = button.dataset.category;
            loadServices(category);
        });
    });
}

async function loadServices(category) {
    try {
        const response = await fetch(`https://localhost:3000/services?category=${category}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });

        const services = await response.json();
        const servicesList = document.getElementById('servicesList');
        
        servicesList.innerHTML = services.map(service => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                ${service.image ? `
                    <img src="${service.image}" alt="${service.name}" 
                         class="w-full h-48 object-cover">
                ` : ''}
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold">${service.name}</h3>
                        <span class="text-green-600 font-bold">$${service.price}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${service.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">
                            Duration: ${service.duration} minutes
                        </span>
                        <a href="../appointments/book.html?service=${service.id}" 
                           class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}