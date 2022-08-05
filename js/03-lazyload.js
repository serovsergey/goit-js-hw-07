const buildImgItem = () => {
    const nativeLazyLoad = 'loading' in HTMLImageElement.prototype;
    return `
    <li class="item">
        <img class="image lazyload" width="320" height="240"
            ${nativeLazyLoad ? 'loading="lazy"' : ''}
            ${nativeLazyLoad ? '' : 'data-'}src="https://picsum.photos/320/240?random=${Math.round(Math.random() * 100000)}"
            ${nativeLazyLoad ? '' : 'src="https://via.placeholder.com/300x200"'}
            alt="">
    </li>
    `;
}

const makeChunkMarkup = (imgCount) => {
    return [...Array(imgCount).keys()].map(buildImgItem).join('');
}

const gallery = document.querySelector('#gallery');
const loader = document.querySelector('#loader');

const callback = function (entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gallery.insertAdjacentHTML('beforeend', makeChunkMarkup(30));
        }
    });
};

const observer = new IntersectionObserver(callback, { root: null, rootMargin: '0px', threshold: 0.25 });
observer.observe(loader);

if ('loading' in HTMLImageElement.prototype) {
    //
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    script.integrity = 'sha512-q583ppKrCRc7N5O0n2nzUiJ+suUv7Et1JGels4bXOaMFQcamPk9HjdUknZuuFjBNs7tsMuadge5k9RzdmO+1GQ==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    document.body.appendChild(script);
}