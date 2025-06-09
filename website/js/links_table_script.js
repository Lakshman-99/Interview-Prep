/**
 * Interactive Dashboard for Interview Prep Resources
 * Handles:
 * - Fetching initial data from links.json
 * - Storing and retrieving data from localStorage
 * - Rendering the resource table
 * - Searching/filtering resources
 * - Adding, updating, and deleting resources via modals
 * - Toggling between light and dark themes
 */

// --- Global State & Constants ---
let allLinks = [];
const LINKS_STORAGE_KEY = "interviewPrepLinks";

// --- DOM Element References ---
const tableBody = document.getElementById("links-table-body");
const searchInput = document.getElementById("search-input");

// Add/Edit Modal Elements
const linkModal = document.getElementById("link-modal");
const modalTitle = document.getElementById("modal-title");
const linkForm = document.getElementById("link-form");
const linkIdInput = document.getElementById("link-id");
const linkTitleInput = document.getElementById("link-title");
const linkUrlInput = document.getElementById("link-url");
const linkStarredInput = document.getElementById("link-starred");

// Delete Confirmation Modal Elements
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

/**
 * Renders the table with a given array of link objects.
 * @param {Array<Object>} linksToRender - The array of links to display.
 */
function renderTable(linksToRender) {
    tableBody.innerHTML = ""; // Clear existing content

    if (linksToRender.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center p-8 text-gray-500"><i class="fas fa-ghost mr-2"></i> No resources found. Try a different search.</td></tr>`;
        return;
    }

    linksToRender.forEach((link, index) => {
        const row = document.createElement("tr");
        row.className =
            "hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors";

        // ** UI/UX Improvement: Action buttons are now in a flex container with spacing **
        row.innerHTML = `
            <td class="p-4 text-center align-middle">
                ${
                    link.starred
                        ? '<i class="fas fa-star text-yellow-400"></i>'
                        : '<i class="far fa-star text-gray-400"></i>'
                }
            </td>
            <td class="p-4 font-medium text-text-light dark:text-white max-w-md truncate align-middle" title="${
                link.title
            }">${link.title}</td>
            <td class="p-4 align-middle">
                <div class="flex items-center justify-center gap-3">
                    <a href="${
                        link.url
                    }" target="_blank" rel="noopener noreferrer" class="p-2 w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-accent-light dark:hover:text-accent-dark transition-all" title="Open Link" aria-label="External link"><i class="fas fa-external-link-alt"></i></a>
                    <button class="edit-btn p-2 w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 transition-all" data-index="${index}" title="Edit" aria-label="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn p-2 w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500 transition-all" data-index="${index}" title="Delete" aria-label="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Fetches initial links from JSON file if localStorage is empty.
 * @returns {Promise<Array<Object>>} A promise that resolves to the array of links.
 */
async function getLinks() {
    const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
    if (storedLinks) {
        return JSON.parse(storedLinks);
    }
    try {
        const response = await fetch("/Interview-Prep/website/data/links.json");
        if (!response.ok) throw new Error("Network response was not ok.");
        const linksFromJson = await response.json();
        const linksWithIds = linksFromJson.map((link) => ({
            ...link,
            id: crypto.randomUUID(),
        }));
        localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(linksWithIds));
        return linksWithIds;
    } catch (error) {
        console.error("Failed to fetch initial links:", error);
        tableBody.innerHTML = `<tr><td colspan="3" class="text-center p-8 text-red-500"><i class="fas fa-times-circle mr-2"></i> Failed to load initial resources.</td></tr>`;
        return [];
    }
}

/**
 * Saves the current state of `allLinks` to localStorage.
 */
function saveLinks() {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(allLinks));
}

/**
 * Filters and re-renders the table based on the search input.
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredLinks = allLinks.filter((link) =>
        link.title.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredLinks);
}

// --- Modal Management ---
function openLinkModal(link = null) {
    linkForm.reset();
    if (link) {
        modalTitle.textContent = "Edit Resource";
        linkIdInput.value = link.id;
        linkTitleInput.value = link.title;
        linkUrlInput.value = link.url;
        linkStarredInput.checked = link.starred;
    } else {
        modalTitle.textContent = "Add New Resource";
        linkIdInput.value = "";
    }
    linkModal.classList.remove("hidden");
}

function closeLinkModal() {
    linkModal.classList.add("hidden");
}

function openDeleteModal(linkId) {
    // Store the ID on the confirm button to use it later
    confirmDeleteBtn.dataset.linkId = linkId;
    deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
    deleteModal.classList.add("hidden");
}

function handleFormSubmit(event) {
    event.preventDefault();
    const id = linkIdInput.value;
    const linkData = {
        title: linkTitleInput.value,
        url: linkUrlInput.value,
        starred: linkStarredInput.checked,
    };

    if (id) {
        const index = allLinks.findIndex((link) => link.id === id);
        if (index > -1) allLinks[index] = { ...allLinks[index], ...linkData };
    } else {
        linkData.id = crypto.randomUUID();
        allLinks.unshift(linkData);
    }

    saveLinks();
    handleSearch();
    closeLinkModal();
}

function handleDelete() {
    const linkIdToDelete = confirmDeleteBtn.dataset.linkId;
    if (linkIdToDelete) {
        allLinks = allLinks.filter((link) => link.id !== linkIdToDelete);
        saveLinks();
        handleSearch();
        closeDeleteModal();
    }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    searchInput.addEventListener("input", handleSearch);
    document
        .getElementById("add-link-btn")
        .addEventListener("click", () => openLinkModal());

    tableBody.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".edit-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        if (editBtn) {
            const index = parseInt(editBtn.dataset.index, 10);
            const searchTerm = searchInput.value.toLowerCase();
            const filteredLinks = allLinks.filter((link) =>
                link.title.toLowerCase().includes(searchTerm)
            );
            openLinkModal(filteredLinks[index]);
        }

        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index, 10);
            const searchTerm = searchInput.value.toLowerCase();
            const filteredLinks = allLinks.filter((link) =>
                link.title.toLowerCase().includes(searchTerm)
            );
            const linkToDeleteId = filteredLinks[index].id;
            openDeleteModal(linkToDeleteId);
        }
    });

    // Add/Edit Modal Listeners
    linkForm.addEventListener("submit", handleFormSubmit);
    document
        .getElementById("cancel-btn")
        .addEventListener("click", closeLinkModal);
    linkModal.addEventListener("click", (e) => {
        if (e.target === linkModal) closeLinkModal();
    });

    // Delete Modal Listeners
    confirmDeleteBtn.addEventListener("click", handleDelete);
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    deleteModal.addEventListener("click", (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

/**
 * Sets up the theme switcher functionality.
 */
function setupThemeSwitcher() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");

    const applyTheme = (isDark) => {
        document.documentElement.classList.toggle("dark", isDark);
        sunIcon.classList.toggle("hidden", isDark);
        moonIcon.classList.toggle("hidden", !isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    const isDarkMode =
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    applyTheme(isDarkMode);

    themeToggleBtn.addEventListener("click", () => {
        applyTheme(!document.documentElement.classList.contains("dark"));
    });
}

/**
 * Main initialization function.
 */
async function initializeApp() {
    setupThemeSwitcher();
    allLinks = await getLinks();
    renderTable(allLinks);
    setupEventListeners();
}

// --- App Start ---
document.addEventListener("DOMContentLoaded", initializeApp);
