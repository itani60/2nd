// Sidebar.js - Mobile Sidebar Functionality
// Global variables
let isSidebarOpen = false;
let isLoggedIn = false;

// Toggle sidebar function
window.toggleSidebar = function() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    console.log('toggleSidebar called, current state:', isSidebarOpen);

    if (!sidebar) {
        console.error('Mobile sidebar element not found!');
        return;
    }

    isSidebarOpen = !isSidebarOpen;

    if (isSidebarOpen) {
        // Open sidebar
        sidebar.classList.add('active');
        if (overlay) {
            overlay.classList.add('active');
        }
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        console.log('Sidebar opened');
    } else {
        // Close sidebar
        sidebar.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
        // Restore body scroll
        document.body.style.overflow = '';
        console.log('Sidebar closed');
    }
}

// Close sidebar function
function closeSidebar() {
    if (isSidebarOpen) {
        toggleSidebar();
    }
}

// Toggle login state function
window.toggleLoginState = function() {
    console.log('toggleLoginState called');
    // This function should open the login modal
    // For now, we'll just log it - you can integrate with your login modal
    if (typeof openLoginModal === 'function') {
        openLoginModal();
    } else {
        console.log('Login modal function not found');
        // Fallback: show alert
        alert('Login functionality will be implemented');
    }
    // Close sidebar after login attempt
    closeSidebar();
}

// Show logout confirmation
window.showLogoutConfirmation = function() {
    if (confirm('Are you sure you want to sign out?')) {
        // Perform logout
        isLoggedIn = false;
        updateLoginState();
        closeSidebar();
        console.log('User logged out');
    }
}

// Update login state display
function updateLoginState() {
    const loggedOutState = document.getElementById('loggedOutState');
    const loggedInState = document.getElementById('loggedInState');

    if (isLoggedIn) {
        if (loggedOutState) loggedOutState.style.display = 'none';
        if (loggedInState) loggedInState.style.display = 'block';
    } else {
        if (loggedOutState) loggedOutState.style.display = 'block';
        if (loggedInState) loggedInState.style.display = 'none';
    }
}

// Toggle submenu function
window.toggleSubmenu = function(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other submenus
    document.querySelectorAll('.menu-items .item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });

    // Toggle current submenu
    if (isActive) {
        item.classList.remove('active');
    } else {
        item.classList.add('active');
    }
}

// Initialize sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar) {
        console.error('Mobile sidebar element not found!');
        return;
    }

    // Ensure sidebar starts in closed state
    sidebar.classList.remove('active');
    if (overlay) {
        overlay.classList.remove('active');
    }

    // Add click event to overlay to close sidebar
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeSidebar();
        });
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isSidebarOpen) {
            closeSidebar();
        }
    });

    // Handle window resize - close sidebar on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && isSidebarOpen) {
            closeSidebar();
        }
    });

    // Add event listeners to sidebar links to close sidebar when clicked
    const sidebarLinks = document.querySelectorAll('.mobile-sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow the click action to complete
            setTimeout(() => {
                if (isSidebarOpen) {
                    closeSidebar();
                }
            }, 100);
        });
    });

    // Add event listener to close button inside sidebar
    const closeButton = sidebar.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeSidebar();
        });
    }

    // Initialize login state
    updateLoginState();

    console.log('Sidebar initialized successfully');
});

// Make functions globally available
window.closeSidebar = closeSidebar;
window.updateLoginState = updateLoginState;

