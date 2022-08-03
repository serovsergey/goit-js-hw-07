import { galleryItems } from './gallery-items.js';
// Change code below this line

const galleryRef = document.querySelector(".gallery");

const createGalleryItem = ({ preview, original, description }) => {
    return `
    <div class="gallery__item">
        <a class="gallery__link" href="${original}">
            <img
                class="gallery__image"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
            />
        </a>
    </div>`;
}

const createGalleryMarkup = () => {
    const galleryMarkup = galleryItems.map(createGalleryItem).join("");
    galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);
}

let onModalKeyDown;

const onImageClick = (evt) => {
    if (!evt.target.classList.contains('gallery__image')) return;
    evt.preventDefault();
    const originalUrl = evt.target.dataset.source;
    basicLightbox.create(`
		<div style="position:relative">
        <button style="position: absolute; top: -16px; right: -16px; border-radius: 50%;">X</button>
        <img width="960" src="${originalUrl}">
        <h2 style="display:block; position: absolute; bottom: 0; width: 100%; text-align: center; background-color:#ffffffa0">
            ${evt.target.getAttribute('alt')}
        </h2>
        </div>
	`, {
        onShow: (instance) => {
            instance.element().querySelector('button').addEventListener('click', () => instance.close());
            document.body.style.overflow = 'hidden';
            console.log(document.body.style.overflow);
            window.addEventListener('keydown', onModalKeyDown = function (evt) {
                if (evt.code === 'Escape')
                    instance.close();
            })
        }, onClose: () => {
            document.body.style.overflow = 'visible';
            window.removeEventListener('keydown', onModalKeyDown)
        }
    }).show();
}

createGalleryMarkup();
galleryRef.addEventListener('click', onImageClick);