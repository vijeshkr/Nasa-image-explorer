const apiKey = 'Api-key';
const apiUrl = 'https://api.nasa.gov/planetary/apod';
let currentFilter = 'all';
let data = [];
let allData = [];

// Fetch NASA images
async function fetchNASAImages() {
    try {
        let count = 20;
        const response = await fetch(`${apiUrl}?api_key=${apiKey}&count=${count}`);
        data = await response.json();
        allData = [...allData, ...data];
        displayImages(allData);
    } catch (error) {
        console.error('Error fetching NASA images:', error);
    }
}

// Display fetched images
function displayImages(data) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '';
    data.forEach(image => {
        if (currentFilter === 'all' || image.title.toLowerCase().includes(currentFilter)) {
            if (image.hdurl) {
                const card = document.createElement('div');
                card.classList.add('image-card');
                card.innerHTML = `
                    <img src="${image.hdurl}" alt="${image.title}">
                    <h3>${image.title}</h3>
                    <p><strong>#Date</strong> ${image.date}</p>
                `;
                card.addEventListener('click', () => openModal(image));
                imageContainer.appendChild(card);
            }
        }
    });
}

let modalExp;

// Open modal with image details
function openModal(image) {
    const modal = document.getElementById('details-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    modalImage.src = image.hdurl;
    modalTitle.textContent = image.title;
    modalExp = image.explanation;
    modal.style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('details-modal');
    modal.style.display = 'none';
}

// Open details page
function openDetailsPage() {
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    const modal = document.getElementById('details-modal');
    const detailsPage = document.getElementById('details-page');
    const pageImage = document.getElementById('page-image');
    const pageTitle = document.getElementById('page-title');
    const pageDescription = document.getElementById('page-description');
    const download = document.getElementById('download');
    const pageMetadata = document.getElementById('page-metadata');
    detailsPage.style.display = 'flex';
    modal.style.display = 'none';
    download.href = modalImage.src;
    pageImage.src = modalImage.src;
    pageTitle.textContent = modalTitle.textContent;
    pageDescription.textContent = modalDescription.textContent;
    pageMetadata.textContent = modalExp;
}

// Function to navigate back to the modal from the details page
function goBack() {
    const modal = document.getElementById('details-modal');
    const detailsPage = document.getElementById('details-page');
    modal.style.display = 'flex';
    detailsPage.style.display = 'none';
}

// Function to load more
function loadMoreImages() {
    fetchNASAImages();
}

// Filter images by category
function filterImages(filter) {
    currentFilter = filter.toLowerCase();
    updateFilterButtons();
    displayImages(allData);
}

// Function to update the styles of filter button (active state)
function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === currentFilter) {
            btn.classList.add('active');
        }
    });
}

// Search images by title
function searchImages() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredImages = allData.filter(image => image.title.toLowerCase().includes(searchTerm));
    displayImages(filteredImages);
}

// Event listener for windw load event to fetch images initially
window.addEventListener('load', () => {
    fetchNASAImages();
});
