// Import the supabase client from our config file
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Function to get scholarship ID from URL parameters
function getScholarshipIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to fetch a single scholarship by ID
const getScholarshipById = async (id) => {
    try {
        const { data: scholarship, error } = await supabase
            .from('scholarships')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return scholarship;

    } catch (error) {
        console.error("Error getting scholarship details: ", error);
        return null;
    }
};

// Function to display scholarship details
function displayScholarshipDetails(scholarship) {
    const container = document.getElementById('scholarshipDetailContainer');
    
    if (!scholarship) {
        container.innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h4 class="alert-heading">Scholarship Not Found</h4>
                <p>The scholarship you're looking for doesn't exist or may have been removed.</p>
                <hr>
                <a href="index.html" class="btn btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }

    const deadlineText = getDaysUntilDeadline(scholarship.deadline);
    const deadlineClass = deadlineText.includes('Past') ? 'danger' : 'success';
    
    const detailContent = `
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <!-- Scholarship Image -->
                <img src="${scholarship.image_url || 'https://via.placeholder.com/800x400?text=No+Image'}" 
                     alt="${scholarship.title}" 
                     class="scholarship-image rounded mb-4">

                <!-- Header Section -->
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <span class="badge bg-info fs-6">${scholarship.category || 'General'}</span>
                    <span class="badge bg-${deadlineClass} deadline-badge">${deadlineText}</span>
                </div>

                <!-- Title -->
                <h1 class="mb-4">${scholarship.title}</h1>

                <!-- Details Card -->
                <div class="card detail-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Scholarship Details</h5>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>🏫 Host University:</strong><br>${scholarship.host_university || 'Not specified'}</p>
                                <p><strong>🌍 Host Country:</strong><br>${scholarship.host_country || 'Not specified'}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>📅 Application Deadline:</strong><br>${new Date(scholarship.deadline).toLocaleDateString()}</p>
                                <p><strong>📋 Scholarship Type:</strong><br>${scholarship.category || 'General'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="card detail-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title mb-3">Description</h5>
                        <div class="scholarship-details" style="white-space: pre-wrap; line-height: 1.6;">
                            ${scholarship.details || scholarship.description || 'No detailed description available for this scholarship.'}
                        </div>
                        ${scholarship.details && scholarship.description ? `
                            <div class="mt-4">
                                <h6><strong>Short Summary:</strong></h6>
                                <p class="mb-0">${scholarship.description}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-center mb-5">
                    <a href="${scholarship.apply_link}" target="_blank" class="btn btn-primary btn-lg me-md-2">
                        📝 Apply Now
                    </a>
                    <a href="index.html" class="btn btn-outline-secondary btn-lg">
                        ← Back to Scholarships
                    </a>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = detailContent;
    
    // Update page title
    document.title = `${scholarship.title} - Scholarships Hub`;
}

// When the page loads, fetch and display the scholarship details
document.addEventListener('DOMContentLoaded', async () => {
    const scholarshipId = getScholarshipIdFromUrl();
    
    if (!scholarshipId) {
        displayScholarshipDetails(null);
        return;
    }

    const scholarship = await getScholarshipById(scholarshipId);
    displayScholarshipDetails(scholarship);
});