import { galleryItems } from './gallery-items.js';
// Change code below this line

let currentImage;

const createGalleryItem = ({ preview, original, description }) => {
    return `
    <li class="gallery__item"">
        <a class="gallery__link" href="${original}">
            <img class="gallery__image" src="${preview}" alt="${description}"/>
        </a>
    </li>`;
}

const createGalleryMarkup = () => {
    const galleryMarkup = galleryItems.map(createGalleryItem).join("");
    galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);
}

const closeModal = () => {
    setTimeout(() => modalContentRef.innerHTML = '', 500);
    backdropRef.classList.remove('open');
    backdropRef.removeEventListener('click', backdropClick);
    document.body.style.overflow = 'visible';
    document.removeEventListener('keydown', onKeyDown);
}

const updateModalContent = (img) => {
    currentImage = img;
    const url = img.closest('.gallery__link').getAttribute('href');
    const alt = img.getAttribute('alt');
    modalContentRef.innerHTML = `
    <img class="modal__original-image" src="${url}"/>
    <h2 style="display:block; position: absolute; bottom: 0; width: 100%; text-align: center; background-color:#ffffffa0">
        ${alt}
    </h2>`;
}

const gotoNext = () => {
    const curItem = currentImage.closest('.gallery__item');
    let nextSibling = curItem.nextSibling;
    while (nextSibling && nextSibling.nodeType !== 1) {
        nextSibling = nextSibling.nextSibling
    }
    if (!nextSibling)
        nextSibling = curItem.parentNode.firstElementChild;
    const nextImg = nextSibling.querySelector('.gallery__image');
    updateModalContent(nextImg);
}

const gotoPrev = () => {
    const curItem = currentImage.closest('.gallery__item');
    let prevSibling = curItem.previousSibling;
    while (prevSibling && prevSibling.nodeType !== 1) {
        prevSibling = prevSibling.previousSibling
    }
    if (!prevSibling)
        prevSibling = curItem.parentNode.lastElementChild;
    console.log(prevSibling)
    const prevImg = prevSibling.querySelector('.gallery__image');
    updateModalContent(prevImg);
}

const onKeyDown = (evt) => {
    switch (evt.code) {
        case 'Escape': closeModal();
            break;
        case 'ArrowLeft': gotoPrev();
            break;
        case 'ArrowRight': gotoNext();
            break;
    }
}

const backdropClick = (evt) => {
    if (evt.target === evt.currentTarget)
        closeModal();
}

const onImageClick = (evt) => {
    if (!evt.target.classList.contains('gallery__image')) return;
    evt.preventDefault();
    currentImage = evt.target;
    backdropRef.classList.add('open');
    backdropRef.addEventListener('click', backdropClick);
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    updateModalContent(evt.target);
}

const galleryRef = document.querySelector(".gallery");
const backdropRef = document.querySelector(".backdrop");
const modalRef = document.querySelector('.modal');
modalRef.querySelector('.modal__btn-close').addEventListener('click', closeModal);
const modalContentRef = modalRef.querySelector('.modal__content');
createGalleryMarkup();
galleryRef.addEventListener('click', onImageClick);
