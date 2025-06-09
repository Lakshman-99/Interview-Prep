document.addEventListener("DOMContentLoaded", () => {
    const tabsContainer = document.getElementById("repo-tabs");
    const fileListContainer = document.getElementById("file-list-container");
    let fileManifest = {};

    // Icons mapping for different file types
    const fileTypeIcons = {
        md: "fab fa-markdown",
        pdf: "fas fa-file-pdf",
        img: "fas fa-file-image",
        default: "fas fa-file-alt",
    };

    /**
     * Renders the list of files for a given category.
     * @param {string} categoryKey - The key for the category (e.g., 'dsa').
     */
    function renderFileList(categoryKey) {
        const category = fileManifest[categoryKey];
        if (!category || !category.files) {
            fileListContainer.innerHTML =
                '<p class="text-gray-500">No files in this category.</p>';
            return;
        }

        let fileListHTML = '<ul class="space-y-2">';
        let basepath = category.filepath;
        category.files.forEach((file) => {
            const iconClass = fileTypeIcons[file.type] || fileTypeIcons.default;
            const filePath = `${basepath}/${file.name}`;

            // Link to the viewer page with the file path as a URL parameter
            fileListHTML += `
                <li>
                    <a href="pages/resource_view/index.html?file=${encodeURIComponent(
                        filePath
                    )}" 
                       class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                        <i class="${iconClass} w-6 text-center text-lg ${
                category.color
            }"></i>
                        <span class="font-medium">${file.name}</span>
                    </a>
                </li>
            `;
        });
        fileListHTML += "</ul>";
        fileListContainer.innerHTML = fileListHTML;
    }

    /**
     * Renders the category tabs.
     */
    function renderTabs() {
        let tabsHTML = '<nav class="flex space-x-4 -mb-px">';
        Object.keys(fileManifest).forEach((key, index) => {
            const category = fileManifest[key];
            const isActive = index === 0; // Make the first tab active initially
            tabsHTML += `
                <button class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                               ${
                                   isActive
                                       ? "border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark"
                                       : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                               }"
                        data-category="${key}">
                    <i class="${category.icon} mr-2"></i>
                    ${category.name}
                </button>
            `;
        });
        tabsHTML += "</nav>";
        tabsContainer.innerHTML = tabsHTML;
    }

    /**
     * Fetches the file manifest and initializes the browser.
     */
    async function initializeBrowser() {
        try {
            // Go up one directory to find the manifest file
            const response = await fetch("/Interview-Prep/website/data/file-manifest.json");
            if (!response.ok) throw new Error("File manifest not found.");
            fileManifest = await response.json();

            renderTabs();
            // Render the file list for the first category by default
            if (Object.keys(fileManifest).length > 0) {
                renderFileList(Object.keys(fileManifest)[0]);
            }

            // Add event listeners to tabs
            tabsContainer.addEventListener("click", (e) => {
                const tabButton = e.target.closest(".tab-btn");
                if (tabButton) {
                    // Update active tab styles
                    document
                        .querySelectorAll(".tab-btn")
                        .forEach((btn) =>
                            btn.classList.replace(
                                "border-accent-light",
                                "border-transparent"
                            )
                        );
                    tabButton.classList.replace(
                        "border-transparent",
                        "border-accent-light"
                    );

                    renderFileList(tabButton.dataset.category);
                }
            });
        } catch (error) {
            console.error("Error initializing file browser:", error);
            fileListContainer.innerHTML = `<p class="text-red-500">Could not load repository contents.</p>`;
        }
    }

    initializeBrowser();
});
