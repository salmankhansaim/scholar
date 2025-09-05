// js/fellowships.js
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Function to fetch ONLY fellowships
const getFellowships = async () => {
try {
const { data: fellowships, error } = await supabase
.from('scholarships')
.select('*')
.eq('category', 'fellowship') // Filter for fellowship only
.order('created_at', { ascending: false });

if (error) {
throw error;
}
return fellowships;

} catch (error) {
console.error("Error getting fellowships: ", error);
return [];
}
};

// Function to display fellowships
function displayFellowships(fellowships) {
const container = document.getElementById('fellowshipsContainer');
container.innerHTML = '';

if (fellowships.length === 0) {
container.innerHTML = '<p class="text-center w-100">No fellowships found. Check back later!</p>';
return;
}

fellowships.forEach((fellowship) => {
const deadlineText = getDaysUntilDeadline(fellowship.deadline);

const card = `
<div class="col-md-6 col-lg-4 mb-4">
    <div class="card h-100 shadow-sm">
        <img src="${fellowship.image_url || 'https://via.placeholder.com/300x150?text=No+Image'}" class="card-img-top"
            alt="${fellowship.title}" style="height: 150px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${fellowship.title}</h5>
            <p class="card-text"><strong>Host:</strong> ${fellowship.host_university}, ${fellowship.host_country}</p>
            <p class="card-text"><strong>Deadline:</strong> ${deadlineText}</p>
            <div class="mt-auto">
                <a href="detail.html?id=${fellowship.id}" class="btn btn-outline-primary me-2">View Details</a>
                <a href="${fellowship.apply_link}" target="_blank" class="btn btn-primary">Apply Now</a>
            </div>
        </div>
    </div>
</div>
`;
container.innerHTML += card;
});
}

// Highlight the current page in navigation
function highlightCurrentPage() {
const currentPage = 'fellowships.html';
const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');

navLinks.forEach(link => {
if (link.getAttribute('href') === currentPage) {
link.classList.add('active');
}
});
}

// When the page loads
document.addEventListener('DOMContentLoaded', async () => {
highlightCurrentPage();
const fellowships = await getFellowships();
displayFellowships(fellowships);
});