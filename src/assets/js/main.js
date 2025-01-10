document.addEventListener('DOMContentLoaded', () => {
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