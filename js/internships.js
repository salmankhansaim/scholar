// js/internships.js
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Function to fetch ONLY internships
const getInternships = async () => {
  try {
    const { data: internships, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('category', 'internship') // Filter for internship only
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return internships;

  } catch (error) {
    console.error("Error getting internships: ", error);
    return [];
  }
};

// Function to display internships
function displayInternships(internships) {
  const container = document.getElementById('internshipsContainer');
  container.innerHTML = '';

  if (internships.length === 0) {
    container.innerHTML = '<p class="text-center w-100">No internships found. Check back later!</p>';
    return;
  }

  internships.forEach((internship) => {
    const deadlineText = getDaysUntilDeadline(internship.deadline);
    
    const card = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${internship.image_url || 'https://via.placeholder.com/300x150?text=No+Image'}" 
               class="card-img-top" 
               alt="${internship.title}" 
               style="height: 150px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${internship.title}</h5>
            <p class="card-text"><strong>Host:</strong> ${internship.host_university}, ${internship.host_country}</p>
            <p class="card-text"><strong>Deadline:</strong> ${deadlineText}</p>
            <div class="mt-auto">
              <a href="detail.html?id=${internship.id}" class="btn btn-outline-primary me-2">View Details</a>
              <a href="${internship.apply_link}" target="_blank" class="btn btn-primary">Apply Now</a>
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
  const currentPage = 'internships.html';
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
  const internships = await getInternships();
  displayInternships(internships);
});