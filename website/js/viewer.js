document.addEventListener("DOMContentLoaded", () => {
    const contentContainer = document.getElementById("content-container");
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get("file");

    /**
     * Renders different file types based on extension.
     * @param {string} textContent - The text content of the file.
     * @param {string} fileType - The file extension (e.g., 'md', 'pdf').
     */
    function renderContent(textContent, fileType) {
        switch (fileType) {
            case "md":
                const md = window.markdownit({
                    html: true,
                    linkify: true,
                    typographer: true,
                    breaks: true,
                });

                contentContainer.innerHTML = md.render(textContent);
                break;
            case "pdf":
                contentContainer.innerHTML = `
                    <iframe
                    src="/${filePath}"
                    class="w-full h-[80vh] rounded-lg border"
                    frameborder="0"
                    allowfullscreen>
                    </iframe>
                `;
                break;

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
                contentContainer.innerHTML = `<img src="../${filePath}" alt="${filePath}" class="max-w-full h-auto rounded-lg" />`;
                break;
            default:
                contentContainer.innerHTML = `<pre class="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">${textContent}</pre>`;
        }
    }

    /**
     * Fetches and displays the file content.
     */
    async function loadFile() {
        if (!filePath) {
            contentContainer.innerHTML =
                '<p class="text-red-500">Error: No file specified.</p>';
            return;
        }

        try {
            // The file path is relative to the root, so go up one level from /docs/
            const response = await fetch(`/${filePath}`);
            if (!response.ok)
                throw new Error(`File not found or could not be loaded.`);

            const textContent = await response.text();
            const fileType = filePath.split(".").pop().toLowerCase();
            renderContent(textContent, fileType);
        } catch (error) {
            console.error("Error loading file:", error);
            contentContainer.innerHTML = `<p class="text-red-500 text-center">Could not load content for: ${filePath}.<br>Please ensure the file exists and the path in file-manifest.json is correct.</p>`;
        }
    }

    loadFile();
});
