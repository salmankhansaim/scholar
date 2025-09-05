// js/admin.js
import { supabase } from './supabase-config.js';

// Check if user is admin (for now, any logged-in user can access)
async function checkAdminAccess() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const accessMessage = document.getElementById('accessMessage');
        const adminContent = document.getElementById('adminContent');

        if (!user) {
            accessMessage.classList.remove('d-none');
            accessMessage.innerHTML = `
                <h4>Login Required</h4>
                <p>Please <a href="login.html">login</a> to access the admin dashboard.</p>
            `;
            return false;
        }

        // For now, allow any logged-in user to access admin
        // Later we'll add proper admin role checking
        accessMessage.classList.add('d-none');
        adminContent.classList.remove('d-none');
        return true;

    } catch (error) {
        console.log('Admin access check error:', error);
        return false;
    }
}

// Load all scholarships
async function loadScholarships() {
    try {
        const { data: scholarships, error } = await supabase
            .from('scholarships')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        updateStatistics(scholarships);
        displayScholarshipsTable(scholarships);

    } catch (error) {
        console.log('Error loading scholarships:', error);
        document.getElementById('scholarshipsTableBody').innerHTML = `
            <tr><td colspan="5" class="text-center text-danger">Error loading scholarships</td></tr>
        `;
    }
}

// Update statistics cards
function updateStatistics(scholarships) {
    const now = new Date();
    
    const total = scholarships.length;
    const active = scholarships.filter(s => new Date(s.deadline) > now).length;
    const expired = total - active;
    
    // Get unique categories
    const categories = [...new Set(scholarships.map(s => s.category))].length;

    document.getElementById('totalScholarships').textContent = total;
    document.getElementById('activeScholarships').textContent = active;
    document.getElementById('expiredScholarships').textContent = expired;
    document.getElementById('totalCategories').textContent = categories;
}

// Display scholarships in table
function displayScholarshipsTable(scholarships) {
    const tableBody = document.getElementById('scholarshipsTableBody');
    const now = new Date();
    
    if (!scholarships || scholarships.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No scholarships found.</td></tr>';
        return;
    }

    tableBody.innerHTML = scholarships.map(scholarship => {
        const deadline = new Date(scholarship.deadline);
        const isExpired = deadline < now;
        const status = isExpired ? 
            '<span class="badge bg-danger">Expired</span>' : 
            '<span class="badge bg-success">Active</span>';

        return `
            <tr>
                <td>${scholarship.title || 'No title'}</td>
                <td><span class="badge bg-info">${scholarship.category || 'N/A'}</span></td>
                <td>${deadline.toLocaleDateString()}</td>
                <td>${status}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editScholarship('${scholarship.id}')">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteScholarship('${scholarship.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Add new scholarship
async function addScholarship(scholarshipData) {
    try {
        const { error } = await supabase
            .from('scholarships')
            .insert([scholarshipData]);

        if (error) throw error;

        alert('✅ Scholarship added successfully!');
        
        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('addScholarshipModal')).hide();
        await loadScholarships();

    } catch (error) {
        console.log('Error adding scholarship:', error);
        alert('❌ Error: ' + error.message);
    }
}

// Refresh data
async function refreshData() {
    await loadScholarships();
    alert('Data refreshed!');
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', async function() {
    const hasAccess = await checkAdminAccess();
    
    if (hasAccess) {
        await loadScholarships();
        
        // Add event listener for form submission
        document.getElementById('submitScholarshipBtn').addEventListener('click', async function() {
    const form = document.getElementById('addScholarshipForm');
    const formData = new FormData(form);
    
    const scholarshipData = {
        title: formData.get('title'),
        category: formData.get('category'),
        host_university: formData.get('host_university'),
        host_country: formData.get('host_country'),
        apply_link: formData.get('apply_link'),
        deadline: new Date(formData.get('deadline')).toISOString(),
        image_url: formData.get('image_url') || '',
        description: formData.get('description') || '',
        details: formData.get('details') || '',
    };

    const editId = form.getAttribute('data-edit-id');

    if (editId) {
        // Update existing
        try {
            const { error } = await supabase
                .from('scholarships')
                .update(scholarshipData)
                .eq('id', editId);

            if (error) throw error;

            alert('✅ Scholarship updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('addScholarshipModal')).hide();
            form.reset();
            form.removeAttribute('data-edit-id');
            document.getElementById('submitScholarshipBtn').textContent = 'Add Scholarship';
            await loadScholarships();
        } catch (error) {
            console.log('Error updating scholarship:', error);
            alert('❌ Error: ' + error.message);
        }
    } else {
        // Add new
        scholarshipData.created_at = new Date().toISOString();
        await addScholarship(scholarshipData);
    }
});
    }
});

window.editScholarship = async function(id) {
    try {
        const { data, error } = await supabase
            .from('scholarships')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        const form = document.getElementById('addScholarshipForm');
        form.querySelector('[name="title"]').value = data.title;
        form.querySelector('[name="category"]').value = data.category;
        form.querySelector('[name="host_university"]').value = data.host_university;
        form.querySelector('[name="host_country"]').value = data.host_country;
        form.querySelector('[name="apply_link"]').value = data.apply_link;
        form.querySelector('[name="deadline"]').value = new Date(data.deadline).toISOString().slice(0,16);
        form.querySelector('[name="image_url"]').value = data.image_url || '';
        form.querySelector('[name="description"]').value = data.description || '';
        form.querySelector('[name="details"]').value = data.details || '';

        // Store ID so we know we’re editing
        form.setAttribute('data-edit-id', id);

        // Change button text
        document.getElementById('submitScholarshipBtn').textContent = 'Update Scholarship';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addScholarshipModal'));
        modal.show();

    } catch (error) {
        console.log('Error loading scholarship for edit:', error);
        alert('❌ Could not load scholarship for editing.');
    }
};

window.deleteScholarship = async function(id) {
    if (confirm('Are you sure you want to delete this scholarship?')) {
        try {
            console.log('Attempting to delete scholarship ID:', id);
            
            const { error } = await supabase
                .from('scholarships')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Supabase delete error:', error);
                throw error;
            }

            alert('✅ Scholarship deleted successfully!');
            await loadScholarships();
            
        } catch (error) {
            console.log('Error deleting scholarship:', error);
            alert('❌ Error: ' + error.message);
        }
    }
};

window.refreshData = refreshData;