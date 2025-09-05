// js/courses.js
import { supabase } from './supabase-config.js';
import { getDaysUntilDeadline } from './utilities.js';

// Debug function to see all categories in your database
const debugCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('scholarships')
            .select('category');
            
        if (error) {
            console.error("Error fetching categories:", error);
            return;
        }
        
        // Get unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        console.log("All categories in database:", uniqueCategories);
        
    } catch (error) {
        console.error("Debug error:", error);
    }
};

// Function to fetch ONLY online courses
const getOnlineCourses = async () => {
  try {
    console.log("Fetching online courses...");
    
    // First, let's see what categories exist
    await debugCategories();
    
    // Try different possible category values that might be used
    const { data: courses, error } = await supabase
      .from('scholarships')
      .select('*')
      .or('category.ilike.%online course%,category.ilike.%online-course%,category.ilike.%course%,category.ilike.%coursera%,category.ilike.%edx%,category.ilike.%udemy%')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Found courses:", courses);
    return courses;

  } catch (error) {
    console.error("Error getting online courses: ", error);
    return [];
  }
};

// Function to display online courses
function displayCourses(courses) {
  const container = document.getElementById('coursesContainer');
  container.innerHTML = '';

  console.log("Displaying courses:", courses);

  if (!courses || courses.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-info">
          <h5>No online courses available at the moment</h5>
          <p>Check back later for new online learning opportunities!</p>
        </div>
      </div>
    `;
    return;
  }

  courses.forEach((course) => {
    const deadlineText = getDaysUntilDeadline(course.deadline);
    
    const card = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${course.image_url || 'https://via.placeholder.com/300x150?text=No+Image'}" 
               class="card-img-top" 
               alt="${course.title}" 
               style="height: 150px; object-fit: cover;"
               loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-info mb-2">${course.category || 'Online Course'}</span>
            <h5 class="card-title">${course.title}</h5>
            <p class="card-text"><strong>Provider:</strong> ${course.host_university || 'Various'}</p>
            <p class="card-text"><strong>Deadline:</strong> ${deadlineText}</p>
            <div class="mt-auto">
              <a href="detail.html?id=${course.id}" class="btn btn-outline-primary me-2">View Details</a>
              <a href="${course.apply_link}" target="_blank" class="btn btn-success">Enroll Now</a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// When the page loads
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Courses page loaded");
  const courses = await getOnlineCourses();
  displayCourses(courses);
});