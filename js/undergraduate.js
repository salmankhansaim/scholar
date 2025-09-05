// js/undergraduate.js
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Function to fetch ONLY undergraduate scholarships
const getUndergraduateScholarships = async () => {
  try {
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('category', 'undergraduate')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return scholarships;

  } catch (error) {
    console.error("Error getting undergraduate scholarships: ", error);
    return [];
  }
};

// Function to display scholarships
function displayScholarships(scholarships) {
  const container = document.getElementById('scholarshipsContainer');
  
  // Clear the loading message and spinner
  container.innerHTML = '';

  if (scholarships.length === 0) {
    container.innerHTML = '<p class="text-center w-100">No undergraduate scholarships found. Check back later!</p>';
    return;
  }

  scholarships.forEach((scholarship) => {
    const deadlineText = getDaysUntilDeadline(scholarship.deadline);
    
    const card = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${scholarship.image_url || 'https://via.placeholder.com/300x150?text=No+Image'}" 
               class="card-img-top" 
               alt="${scholarship.title}" 
               style="height: 150px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${scholarship.title}</h5>
            <p class="card-text"><strong>Host:</strong> ${scholarship.host_university}, ${scholarship.host_country}</p>
            <p class="card-text"><strong>Deadline:</strong> ${deadlineText}</p>
            <div class="mt-auto">
              <a href="detail.html?id=${scholarship.id}" class="btn btn-outline-primary me-2">View Details</a>
              <a href="${scholarship.apply_link}" target="_blank" class="btn btn-primary">Apply Now</a>
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
  const currentPage = 'undergraduate.html'; // Since this is the undergraduate page
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// When the page loads
document.addEventListener('DOMContentLoaded', async () => {
  highlightCurrentPage(); // Highlight menu
  const scholarships = await getUndergraduateScholarships(); // Fetch data
  displayScholarships(scholarships); // Display data
});