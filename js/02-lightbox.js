import { galleryItems } from './gallery-items.js';
// Change code below this line

const galleryRef = document.querySelector(".gallery");

const createGalleryItem = ({ preview, original, description }) => {
    return `
    <li class="gallery__item">
        <a class="gallery__item" href="${original}">
            <img class="gallery__image" src="${preview}" alt="${description}" />
        </a>
    </li>`;
}

const createGalleryMarkup = () => {
    const galleryMarkup = galleryItems.map(createGalleryItem).join("");
    galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);
}

const onImageClick = (evt) => {
    if (!evt.target.classList.contains('gallery__image')) return;
    evt.preventDefault();
}

createGalleryMarkup();
galleryRef.addEventListener('click', onImageClick);
const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });