document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Add some retro hover effects to links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = '#FF8C00';
        });
        link.addEventListener('mouseout', () => {
            link.style.color = '';
        });
    });

    const fileIcons = document.querySelectorAll('.file-icon');
    
    fileIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            const preview = icon.querySelector('.image-preview');
            if (preview) {
                preview.style.opacity = '0';
                preview.style.display = 'block';
                setTimeout(() => {
                    preview.style.opacity = '1';
                }, 10);
            }
        });

        icon.addEventListener('mouseleave', (e) => {
            const preview = icon.querySelector('.image-preview');
            if (preview) {
                preview.style.opacity = '0';
                setTimeout(() => {
                    preview.style.display = 'none';
                }, 200);
            }
        });
    });
});