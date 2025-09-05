// js/utilities.js

// Function to calculate days until deadline
export const getDaysUntilDeadline = (deadlineDate) => {
  if (!deadlineDate) return 'N/A';
  
  const now = new Date();
  const deadline = new Date(deadlineDate);
  
  if (isNaN(deadline.getTime())) return 'N/A';
  
  const timeDiff = deadline - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return 'Deadline Passed';
  } else if (daysDiff === 0) {
    return 'Last Day';
  } else if (daysDiff === 1) {
    return 'Tomorrow';
  } else {
    return `${daysDiff} Days Left`;
  }
};

// Function to create a "Urgent" badge HTML if deadline is close
export const createUrgentBadge = (daysDiff) => {
  if (typeof daysDiff === 'string') {
    if (daysDiff === 'Deadline Passed') return '';
    if (daysDiff === 'Last Day' || daysDiff === 'Tomorrow') {
      return '<span class="badge bg-danger">Urgent</span>';
    }
    // Try extracting number if string is like "3 Days Left"
    const match = daysDiff.match(/(\d+)/);
    if (match) daysDiff = parseInt(match[1]);
    else return '';
  }

  if (daysDiff <= 3) {
    return '<span class="badge bg-danger">Urgent</span>';
  }
  return '';
};
