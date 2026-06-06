/**
 * Loads content from localStorage to update the website dynamically.
 */

document.addEventListener('DOMContentLoaded', function () {
    // --- 0. Load Full Layout (If Exists) ---
    // Identify current page
    const pathname = window.location.pathname.split('/').pop() || 'index.html';
    const storageKey = 'cpp_layout_' + pathname;
    const savedLayout = localStorage.getItem(storageKey);

    if (savedLayout) {
        console.log('Restoring saved layout for:', pathname);
        document.body.innerHTML = savedLayout;
    }

    // --- 1. Load Theme Colors ---
    const themeVars = ['--primary', '--secondary', '--accent', '--dark', '--gray'];
    const themeIds = ['theme-primary', 'theme-secondary', 'theme-accent', 'theme-text', 'theme-grey'];

    themeIds.forEach((id, index) => {
        const val = localStorage.getItem('cpp_content_' + id);
        if (val) {
            document.documentElement.style.setProperty(themeVars[index], val);
        }
    });

    // --- 2. Fallback: Content Loader for specific IDs ---
    // If we loaded the full layout, the IDs should already have their content.
    // But we run this anyway to catch any "loose" values or if layout wasn't saved but valid details were.
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cpp_content_')) {
            const id = key.replace('cpp_content_', '');
            const val = localStorage.getItem(key);

            if (themeIds.includes(id)) return; // Skip them

            const element = document.getElementById(id);
            if (element && val) {
                if (element.tagName === 'IMG') {
                    // Check if it's already set by layout load? 
                    // If layout loaded, src is probably correct.
                    // But if val is newer? 
                    // Let's assume layout is master if it exists.
                    if (!savedLayout) element.src = val;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = val;
                } else {
                    if (!savedLayout) element.innerHTML = val;
                }
            }
        }
    });

    // --- 3. Background Image Loaders ---
    // (Legacy support for specific gradients - if layout saved, these styles are inline and preserved)
    if (!savedLayout) {
        // Load Hero Image
        loadBgImage('cpp_content_hero-image', '.hero', 'linear-gradient(135deg, rgba(26, 95, 122, 0.9), rgba(42, 157, 143, 0.85))');

        // Load Faculties Hero Image
        loadBgImage('cpp_content_faculties-hero', 'faculties-hero', 'linear-gradient(rgba(26, 95, 122, 0.8), rgba(42, 157, 143, 0.8))');

        // Load Students Hero Image
        loadBgImage('cpp_content_students-hero', 'students-hero', 'linear-gradient(rgba(26, 95, 122, 0.8), rgba(42, 157, 143, 0.8))');

        // Load Alumni Hero Image
        loadBgImage('cpp_content_alumni-hero', 'alumni-hero', 'linear-gradient(rgba(26, 95, 122, 0.85), rgba(42, 157, 143, 0.8))');
    }

    // Helper for loading background images
    function loadBgImage(storageKey, elementId, defaultGradient) {
        const savedImage = localStorage.getItem(storageKey);
        if (savedImage) {
            const element = document.getElementById(elementId) || document.querySelector(elementId);
            if (element) {
                // If a gradient is provided, prepend it
                const bgStyle = defaultGradient
                    ? `${defaultGradient}, url('${savedImage}')`
                    : `url('${savedImage}')`;
                element.style.backgroundImage = bgStyle;
            }
        }
    }
});
