document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Add some retro hover effects to links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = '#ff00ff'; // Classic neon pink
        });
        link.addEventListener('mouseout', () => {
            link.style.color = '';
        });
    });
});