// js/main.js
// Import the supabase client from our config file
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Function to fetch ALL scholarships, ordered by creation date (newest first)
const getAllScholarships = async () => {
  try {
    // Use Supabase to query the 'scholarships' table
    // Select ALL columns explicitly for clarity
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select('id, created_at, title, host_university, host_country, deadline, apply_link, image_url, category, description, details')
      .order('created_at', { ascending: false }); // Newest first

    // If there's an error, throw it to be caught in the catch block
    if (error) {
      throw error;
    }

    // If successful, return the data
    return scholarships;

  } catch (error) {
    console.error("Error getting scholarships: ", error);
    return []; // Return empty array if there's an error
  }
};

// Function to display scholarships on the homepage
function displayScholarships(scholarships) {
  const container = document.getElementById('scholarshipsContainer');
  container.innerHTML = ''; // Clear the "Loading..." text

  if (scholarships.length === 0) {
    container.innerHTML = '<p class="text-center w-100">No scholarships found. Check back later!</p>';
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
            <!-- Show Category as a Badge -->
            <span class="badge bg-info mb-2">${scholarship.category || 'General'}</span>
            <h5 class="card-title">${scholarship.title}</h5>
            <!-- Show Host University and Country -->
            <p class="card-text"><strong>Host:</strong> ${scholarship.host_university}, ${scholarship.host_country}</p>
            <!-- Show Short Description (first 100 chars) -->
            <p class="card-text">${scholarship.description ? scholarship.description.substring(0, 100) + '...' : 'No description available.'}</p>
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

// When the page loads, fetch and display all scholarships
document.addEventListener('DOMContentLoaded', async () => {
  const scholarships = await getAllScholarships();
  displayScholarships(scholarships);
});