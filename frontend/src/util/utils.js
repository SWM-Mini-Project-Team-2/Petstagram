// get height of image when it is onload
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        let scale;
        const img = new Image();
        img.onload = () => {
            scale = img.naturalHeight / img.naturalWidth;
            resolve(300 * scale);
        };
        img.src = src;
    });

export { loadImage };
