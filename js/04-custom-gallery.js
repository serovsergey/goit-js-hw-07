import { galleryItems } from './gallery-items.js';
// Change code below this line

let currentImage;

const createGalleryItem = ({ preview, original, description }, id) => {
    return `
    <li class="gallery__item"">
        <a class="gallery__link" href="${original}">
            <img class="gallery__image" src="${preview}" alt="${description}" data-id="${id}"/>
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

    modalRef.removeEventListener('touchstart', handleTouchStart, false);
    modalRef.removeEventListener('touchmove', handleTouchMove, false);
    modalRef.removeEventListener('touchend', handleTouchEnd, false);

    backdropRef.removeEventListener('mousedown', onMouseDown, false);
    backdropRef.removeEventListener('mousemove', throttledMouseMove, false);
    backdropRef.removeEventListener('mouseup', onMouseUp, false);
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

const animate = (img, right) => {
    const appear = right ? 'appearFromRight' : 'appearFromLeft';
    const disappear = right ? 'disappearToLeft' : 'disappearToRight';
    modalRef.classList.add(disappear);
    modalRef.addEventListener('animationend', () => {
        modalRef.classList.remove(disappear);
        modalRef.classList.add(appear);
        updateModalContent(img);
        modalRef.addEventListener('animationend', () => {
            modalRef.classList.remove(appear);
        }, { once: true });
    }, { once: true });
}

const gotoNext = () => {
    const curId = Number(currentImage.dataset.id);
    let nextImg = galleryRef.querySelector(`img[data-id="${galleryItems.length - 1 === curId ? 0 : curId + 1}"]`);
    animate(nextImg, true);
}

const gotoPrev = () => {
    const curId = Number(currentImage.dataset.id);
    let prevImg = galleryRef.querySelector(`img[data-id="${curId === 0 ? galleryItems.length - 1 : curId - 1}"]`);
    animate(prevImg, false);
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

    modalRef.addEventListener('touchstart', handleTouchStart, false);
    modalRef.addEventListener('touchmove', handleTouchMove, false);
    modalRef.addEventListener('touchend', handleTouchEnd, false);

    backdropRef.addEventListener('mousedown', onMouseDown, false);
    backdropRef.addEventListener('mousemove', throttledMouseMove, false);
    backdropRef.addEventListener('mouseup', onMouseUp, false);
}

const galleryRef = document.querySelector(".gallery");
const backdropRef = document.querySelector(".backdrop");
const modalRef = document.querySelector('.modal');
modalRef.querySelector('.modal__btn-close').addEventListener('click', closeModal);
const modalContentRef = modalRef.querySelector('.modal__content');
createGalleryMarkup();
galleryRef.addEventListener('click', onImageClick);

const Directions = Object.freeze({
    Right: Symbol("direction_right"),
    Left: Symbol("direction_left"),
    Up: Symbol("direction_up"),
    Down: Symbol("direction_down")
})

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    const later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        const now = Date.now();
        if (!previous && options.leading === false) previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

let xDown = null;
let yDown = null;
let direction;

function onMouseDown(evt) {
    evt.preventDefault();
    xDown = evt.clientX;
    yDown = evt.clientY;
}

const throttledMouseMove = throttle(onMouseMove, 100);

function onMouseMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    evt.preventDefault();
    const xUp = evt.clientX;
    const yUp = evt.clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) { /* left swipe */
            // gotoNext();
            direction = Directions.Right;
        } else { /* right swipe */
            // gotoPrev();
            direction = Directions.Left;
        }
    } else {
        if (yDiff > 0) { /* up swipe */
            // closeModal();
            direction = Directions.Up;
        } else { /* down swipe */

        }
    }
}

function onMouseUp(evt) {
    evt.preventDefault();
    switch (direction) {
        case Directions.Right: gotoNext();
            break;
        case Directions.Left: gotoPrev();
            break;
        case Directions.Up: closeModal();
            break;
    }
    xDown = null;
    yDown = null;
    direction = null;
}

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    if (evt.touches.length === 1) {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }
};

function handleTouchEnd(evt) {
    // switch (direction) {
    //     case Directions.Right: gotoNext();
    //         break;
    //     case Directions.Left: gotoPrev();
    //         break;
    //     case Directions.Up: closeModal();
    //         break;
    // }
    xDown = null;
    yDown = null;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown || evt.touches.length > 1) {
        return;
    }
    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) { /* left swipe */
            gotoNext();
            // direction = Directions.Right;
        } else { /* right swipe */
            gotoPrev();
            // direction = Directions.Left;
        }
    } else {
        if (yDiff > 0) { /* up swipe */
            closeModal();
            // direction = Directions.Up;
        } else { /* down swipe */

        }
    }
};