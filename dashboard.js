/**
 * Visual Website Builder Logic (Figma-like)
 */

// Global State
let selectedElement = null; // Currently selected element in iframe
const iframe = document.getElementById('site-frame');
const sidebarContent = document.getElementById('sidebar-content');
const panelTitle = document.getElementById('panel-title');
const backBtn = document.getElementById('back-btn'); // Repurposed for "Deselect" or "Back to Global"

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render - Show Global Settings by default
    renderGlobalSettings();

    // Save Button Logic
    document.getElementById('saveBtn').addEventListener('click', saveChanges);

    // Back/Home Button Logic
    if (backBtn) {
        backBtn.onclick = () => {
            deselectElement();
            renderGlobalSettings();
        };
    }

    // Iframe Interaction
    iframe.onload = () => {
        injectVisualEditor();
    };
});

// --- EDITOR INJECTION ---
function injectVisualEditor() {
    const doc = iframe.contentDocument;
    if (!doc) return;

    // 1. Inject Styles for Editor UI (Hover/Selection)
    const style = doc.createElement('style');
    style.textContent = `
        [id] {
            cursor: default; /* Reset to arrow */
            transition: outline 0.1s;
        }
        /* Hover State */
        [id]:hover {
            outline: 2px solid #3699ff !important;
            outline-offset: 2px; 
        }
        /* Selected State */
        [data-editor-selected="true"] {
            outline: 3px solid #3699ff !important;
            outline-offset: 2px;
            position: relative;
            z-index: 1000;
        }
        /* Editable Text Cursor */
        [contenteditable="true"] {
            cursor: text;
        }
        [contenteditable="true"]:focus {
            outline: none; /* Let the selection state handle it */
        }
    `;
    doc.head.appendChild(style);

    // 2. Identify and Prepare Elements
    // We target anything with an ID as potential candidate
    const editables = doc.querySelectorAll('[id]');
    editables.forEach(el => {
        // Skip wrapper/layout IDs if needed, but for now allow all.
        // Identify Text
        if (isTextElement(el)) {
            el.setAttribute('contenteditable', 'true');
        }
    });

    // 3. Event Listeners
    doc.body.addEventListener('click', handleElementClick);
    doc.body.addEventListener('input', handleTextInput);
}

function isTextElement(el) {
    // Simple heuristic: tags that usually contain text
    const tags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'BUTTON', 'LABEL'];
    return tags.includes(el.tagName);
}

function handleElementClick(e) {
    // 1. Find the closest element with an ID
    const target = e.target.closest('[id]');
    if (!target) {
        // Clicked on nothing significant -> deselect
        deselectElement();
        renderGlobalSettings();
        return;
    }

    // Prevent default links unless we are in "Preview Mode" (impl later)
    if (target.tagName === 'A') {
        e.preventDefault();
    }

    e.stopPropagation(); // Stop bubbling
    selectElement(target);
}

function handleTextInput(e) {
    // Auto-save logic can go here (debounce recommended)
    // For now, we update local storage on every input for simplicity in this demo
    const target = e.target;
    if (target.id) {
        localStorage.setItem('cpp_content_' + target.id, target.innerHTML);
    }
}

// --- SELECTION LOGIC ---
function selectElement(el) {
    if (selectedElement) {
        selectedElement.removeAttribute('data-editor-selected');
    }
    selectedElement = el;
    el.setAttribute('data-editor-selected', 'true');

    // Update Sidebar
    renderPropertyInspector(el);
    backBtn.classList.remove('hidden');
}

function deselectElement() {
    if (selectedElement) {
        selectedElement.removeAttribute('data-editor-selected');
        selectedElement = null;
    }
    backBtn.classList.add('hidden');
}

// --- SIDEBAR: PROPERTY INSPECTOR ---
function renderPropertyInspector(el) {
    sidebarContent.innerHTML = '';

    // Header
    panelTitle.textContent = `${el.tagName} #${el.id}`;

    // 1. Common Info
    createFieldGroup('ID / Metadata', [
        { label: 'Element ID', value: el.id, readonly: true }
    ]);

    // 2. Specific Properties
    if (isTextElement(el)) {
        renderTextProperties(el);
    } else if (el.tagName === 'IMG') {
        renderImageProperties(el);
    } else {
        renderContainerProperties(el); // Sections, Divs
    }
}

function renderTextProperties(el) {
    const computed = getComputedStyle(el);

    const fields = [
        {
            label: 'Color',
            type: 'color',
            value: rgbToHex(computed.color),
            onChange: (val) => el.style.color = val
        },
        {
            label: 'Font Size',
            type: 'text',
            value: computed.fontSize,
            onChange: (val) => el.style.fontSize = val
        },
        {
            label: 'Text Align',
            type: 'select',
            options: ['left', 'center', 'right', 'justify'],
            value: computed.textAlign,
            onChange: (val) => el.style.textAlign = val
        }
    ];

    createFieldGroup('Typography', fields);

    // Quick Content Edit (Duplicated from inline, but useful for long text)
    const contentGroup = document.createElement('div');
    contentGroup.className = 'editor-group';
    const label = document.createElement('label');
    label.className = 'editor-label';
    label.textContent = 'Content';
    const area = document.createElement('textarea');
    area.className = 'editor-textarea';
    area.value = el.innerText;
    area.oninput = (e) => {
        el.innerText = e.target.value;
        // Trigger save
        localStorage.setItem('cpp_content_' + el.id, el.innerHTML); // innerHTML to be safe
    };
    contentGroup.appendChild(label);
    contentGroup.appendChild(area);
    sidebarContent.appendChild(contentGroup);
}

function renderImageProperties(el) {
    const fields = [
        {
            label: 'Alt Text',
            type: 'text',
            value: el.alt,
            onChange: (val) => el.alt = val
        }
    ];
    createFieldGroup('Image Attributes', fields);

    // Image Uploader
    const group = document.createElement('div');
    group.className = 'editor-group';
    const label = document.createElement('label');
    label.className = 'editor-label';
    label.textContent = 'Source';

    // Preview
    const preview = document.createElement('div');
    preview.className = 'img-preview-box';
    preview.style.backgroundImage = `url(${el.src})`;

    // Upload Btn
    const uploadBtn = document.createElement('label');
    uploadBtn.className = 'btn-upload';
    uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Swap Image';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            el.src = evt.target.result;
            preview.style.backgroundImage = `url(${evt.target.result})`;
            localStorage.setItem('cpp_content_' + el.id, evt.target.result);
        };
        reader.readAsDataURL(file);
    };

    uploadBtn.appendChild(fileInput);
    group.appendChild(preview);
    group.appendChild(uploadBtn);
    sidebarContent.appendChild(group);
}

function renderContainerProperties(el) {
    // Check for background image (often used in heroes)
    const computed = getComputedStyle(el);
    const bgImage = computed.backgroundImage;
    const hasBgImage = bgImage !== 'none';

    if (hasBgImage) {
        const group = document.createElement('div');
        group.className = 'editor-group';
        const label = document.createElement('label');
        label.className = 'editor-label';
        label.textContent = 'Background Image';

        // Clean Up URL for preview
        let cleanUrl = bgImage;
        if (cleanUrl.includes('url("')) {
            cleanUrl = cleanUrl.replace(/^url\("?/, '').replace(/"?\)$/, '');
        }
        // Handle gradients... tricky to preview just image if gradient exists.
        // Simplification: Just show upload button

        const uploadBtn = document.createElement('label');
        uploadBtn.className = 'btn-upload';
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Change Background';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                // Heuristic: If it had a gradient, try to preserve it?
                // For this demo, we assume specific ID knowledge or just overwrite.
                // Better approach: Regex replace the url(...) part.
                let newBg = bgImage;
                if (newBg.includes('url(')) {
                    // Replace the content inside the last url() instance? 
                    // Simplest: Just set it.
                    // But for Hero sections we know we want Gradient + Url.
                    // Let's rely on the previous dashboard.js logic map? 
                    // OR just overwrite.

                    // CHECK if it's a known Hero Component
                    if (el.id.includes('hero')) {
                        // Hardcoded gradient preference for aesthetic
                        el.style.backgroundImage = `linear-gradient(rgba(26, 95, 122, 0.8), rgba(42, 157, 143, 0.8)), url('${evt.target.result}')`;
                    } else {
                        el.style.backgroundImage = `url('${evt.target.result}')`;
                    }
                } else {
                    el.style.backgroundImage = `url('${evt.target.result}')`;
                }

                localStorage.setItem('cpp_content_' + el.id, evt.target.result); // storing just URL usually
            };
            reader.readAsDataURL(file);
        };

        uploadBtn.appendChild(fileInput);
        group.appendChild(uploadBtn);
        sidebarContent.appendChild(group);
    }

    // Background Color
    createFieldGroup('Appearance', [
        {
            label: 'Background Color',
            type: 'color',
            value: rgbToHex(computed.backgroundColor),
            onChange: (val) => el.style.backgroundColor = val
        }
    ]);
}


// --- SIDEBAR: GLOBAL SETTINGS ---
function renderGlobalSettings() {
    sidebarContent.innerHTML = '';
    panelTitle.textContent = 'Global Settings';
    backBtn.classList.add('hidden'); // We are at root

    // Theme Colors Section
    const themeFields = [
        { label: 'Primary Color', variable: '--primary' },
        { label: 'Secondary Color', variable: '--secondary' },
        { label: 'Accent Color', variable: '--accent' },
        { label: 'Text Color', variable: '--dark' }
    ];

    const group = document.createElement('div');
    group.className = 'editor-group';
    group.innerHTML = '<h3 style="font-size:0.9rem; margin-bottom:10px; color:var(--text-primary);">Theme Colors</h3>';

    themeFields.forEach(theme => {
        // Get current value from iframe root
        const doc = iframe.contentDocument;
        let startVal = '#000000';
        if (doc) {
            startVal = getComputedStyle(doc.documentElement).getPropertyValue(theme.variable).trim();
        }

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '8px';
        row.style.alignItems = 'center';

        const label = document.createElement('label');
        label.textContent = theme.label;
        label.style.fontSize = '0.85rem';
        label.style.color = 'var(--text-secondary)';

        const input = document.createElement('input');
        input.type = 'color';
        input.value = startVal;
        input.style.border = 'none';
        input.style.width = '30px';
        input.style.height = '30px';
        input.style.cursor = 'pointer';
        input.oninput = (e) => {
            if (doc) {
                doc.documentElement.style.setProperty(theme.variable, e.target.value);
                // Save immediately
                localStorage.setItem('cpp_content_theme-' + theme.variable.replace('--', ''), e.target.value);
            }
        };

        row.appendChild(label);
        row.appendChild(input);
        group.appendChild(row);
    });
    sidebarContent.appendChild(group);

    // Navigation Helper
    const navGroup = document.createElement('div');
    navGroup.className = 'editor-group';
    navGroup.innerHTML = '<h3 style="margin-top:20px; font-size:0.9rem; margin-bottom:10px; color:var(--text-primary);">Navigation</h3>';
    navGroup.innerHTML += '<p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">Select a page/section to navigate into it for editing.</p>';

    // Quick Links to crucial pages
    const pages = [
        { name: 'Home', url: 'index.html' },
        { name: 'Gallery', url: 'gallery.html' },
        { name: 'Faculties', url: 'Faculties.html' },
        { name: 'Students', url: 'students.html' },
        { name: 'Alumni', url: 'Alumni.html' }
    ];

    pages.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'section-item';
        btn.innerHTML = `<span class="section-name">${p.name}</span> <span class="section-actions"><i class="fas fa-external-link-alt"></i></span>`;
        btn.onclick = () => {
            iframe.src = p.url;
            selection = null; // Clear selection on nav
        };
        navGroup.appendChild(btn);
    });
    sidebarContent.appendChild(navGroup);
}


// --- HELPER WRAPPERS ---

function createFieldGroup(title, fields) {
    const group = document.createElement('div');
    group.className = 'editor-group';
    if (title) {
        group.innerHTML = `<h3 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; color:var(--text-secondary);">${title}</h3>`;
    }

    fields.forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.className = 'editor-label';
        label.textContent = field.label;
        wrapper.appendChild(label);

        if (field.readonly) {
            const val = document.createElement('div');
            val.textContent = field.value;
            val.style.padding = '8px';
            val.style.background = 'rgba(255,255,255,0.05)';
            val.style.borderRadius = '4px';
            val.style.fontSize = '0.85rem';
            val.style.fontFamily = 'monospace';
            wrapper.appendChild(val);
        } else if (field.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'editor-input';
            input.value = field.value || '';
            input.oninput = (e) => field.onChange(e.target.value);
            wrapper.appendChild(input);
        } else if (field.type === 'color') {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '10px';

            const input = document.createElement('input');
            input.type = 'color';
            input.value = field.value || '#000000';
            input.style.border = 'none';
            input.style.cursor = 'pointer';
            input.oninput = (e) => field.onChange(e.target.value);

            const hex = document.createElement('span');
            hex.textContent = field.value;
            hex.style.fontSize = '0.85rem';

            row.appendChild(input);
            row.appendChild(hex);
            wrapper.appendChild(row);
        } else if (field.type === 'select') {
            const select = document.createElement('select');
            select.className = 'editor-input'; // Reuse style
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                if (opt === field.value) option.selected = true;
                select.appendChild(option);
            });
            select.onchange = (e) => field.onChange(e.target.value);
            wrapper.appendChild(select);
        }

        group.appendChild(wrapper);
    });

    sidebarContent.appendChild(group);
}

// Utility: RGB to Hex
function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb;
    // Turn "rgb(r, g, b)" into #rrggbb
    const sep = rgb.indexOf(",") > -1 ? "," : " ";
    const arr = rgb.substr(4).split(")")[0].split(sep);

    let r = (+arr[0]).toString(16),
        g = (+arr[1]).toString(16),
        b = (+arr[2]).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
}

function saveChanges() {
    // Saving is automatic via localStorage for this demo.
    // But we can show a toast to reassure the user.
    const btn = document.getElementById('saveBtn');
    btn.textContent = 'Saved!';
    setTimeout(() => btn.textContent = 'Save Changes', 2000);

    const toast = document.getElementById('statusMsg');
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
}
