export function formatDateCustom(dateInput) {
    var date = new Date(dateInput);
  
    if (isNaN(date.getTime())) return 'Invalid date'; // Check if the date is valid
  
    var day = date.getDate();
    var month = date.toLocaleString('en-GB', { month: 'long' }); // Get full month name
    var year = date.getFullYear();
  
    return day + ' ' + month + ' ' + year;
  }
  
 