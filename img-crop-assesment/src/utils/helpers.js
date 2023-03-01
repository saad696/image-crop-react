import { centerCrop, makeAspectCrop } from 'react-image-crop';
// this method is for opening that crop box at center of the image
const cropCenter = (width, height, aspectRatio) => {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 0, // can change how much space that crop box will occupy
            },
            aspectRatio,
            width,
            height
        ),
        width,
        height
    );
};

const getImageURL = (urlSetter, imgFile) => {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
        urlSetter(reader.result?.toString() || '')
    );
    reader.readAsDataURL(imgFile.file.originFileObj);
};

export { cropCenter, getImageURL };
