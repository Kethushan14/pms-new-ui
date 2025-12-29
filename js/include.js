// Function to load HTML components
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        
        if (file) {
            fetch(file)
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(html => {
                    element.innerHTML = html;
                    // Reinitialize any Bootstrap components in the loaded content
                    const dropdownElements = element.querySelectorAll('.dropdown-toggle');
                    dropdownElements.forEach(dropdown => {
                        new bootstrap.Dropdown(dropdown);
                    });
                    
                    // Dispatch event that content has been loaded
                    element.dispatchEvent(new CustomEvent('contentLoaded', { 
                        bubbles: true,
                        detail: { element: element, file: file }
                    }));
                })
                .catch(error => {
                    console.error('Error loading component:', error);
                    element.innerHTML = `<div class="alert alert-danger">Error loading component: ${file}</div>`;
                });
        }
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', includeHTML);

