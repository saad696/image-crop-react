import { useEffect, useRef, useState } from 'react';
// antd imports
import { Card, Col, message, Row, Statistic, Upload } from 'antd';
import { ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';

// others imports
import ReactCrop from 'react-image-crop';
import { cropCenter, getImageURL } from './utils/helpers';
import { imagePreview } from './utils/imagePreview';
import { useDebounceEffect } from '../hooks/useDebounceEffects';

const { Dragger } = Upload;

// upload props
const props = {
    name: 'image',
    multiple: false,
    listType: 'picture',
    maxCount: 1,
    beforeUpload: (file) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            message.error(`This file type is not allowed!`);
        }
        return allowedTypes.includes(file.type) || Upload.LIST_IGNORE;
    },
    customRequest: ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    },
};

function App() {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    // - 16 / 9 for rectangle
    // - 1 for square
    // - undefined for free crop
    const [aspect, setAspect] = useState(undefined);
    const [imageDetails, setImageDetails] = useState({
        startCo: { x: 0, y: 0 },
        endCo: { x: 0, y: 0 },
        height: null,
        width: null,
    });

    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const onImageUpload = (imgFile) => {
        if (imgFile.file.status === 'done') {
            setCrop(undefined);
            getImageURL(setImgSrc, imgFile);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        console.log(cropCenter(width, height, aspect));
        setCrop(cropCenter(width, height, aspect));
    };

    const onDeleteImg = () => {
        setImgSrc('');
        setCompletedCrop('');
        setImageDetails({
            startCo: { x: 0, y: 0 },
            endCo: { x: 0, y: 0 },
            height: null,
            width: null,
        });
    };

    useEffect(() => {
        if (!crop) return;
        setImageDetails({
            startCo: { x: crop.x, y: crop.y },
            endCo: { x: crop.x + crop.width, y: crop.y + crop.height },
            height: crop.height,
            width: crop.width,
        });
    }, [crop]);

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                imagePreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop
                );
            }
        },
        100,
        [completedCrop]
    );

    return (
        <>
            <div className='m-20'>
                <Row justify={'center'}>
                    <Col xs={24}>
                        <Dragger
                            {...props}
                            onChange={onImageUpload}
                            onRemove={onDeleteImg}
                        >
                            <p className='ant-upload-drag-icon'>
                                <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>
                                Click or drag file to this area to upload
                            </p>
                            <p className='ant-upload-hint'>
                                Only one image upload is allowed at a time, of
                                type (png, jpeg, jpg)
                            </p>
                        </Dragger>
                    </Col>
                    <Col xs={24} className='mt-32'>
                        <Row justify={'center'} className='space-x-6'>
                            <Col span={5}>
                                <Card bordered={false}>
                                    <Statistic
                                        title='Height'
                                        value={imageDetails.height || 0}
                                        precision={2}
                                        suffix='%'
                                    />
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card bordered={false}>
                                    <Statistic
                                        title='Width'
                                        value={imageDetails.width || 0}
                                        precision={2}
                                        suffix='%'
                                    />
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card bordered={false}>
                                    <Statistic
                                        title='Start Coordinates'
                                        value={
                                            imageDetails.height
                                                ? `(${parseInt(
                                                      imageDetails.startCo.x
                                                  ).toFixed(2)}, ${parseInt(
                                                      imageDetails.startCo.y
                                                  ).toFixed(2)})`
                                                : '(0,0)'
                                        }
                                    />
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card bordered={false}>
                                    <Statistic
                                        title='End Coordinates'
                                        value={
                                            imageDetails.height
                                                ? `(${parseInt(
                                                      imageDetails.endCo.x
                                                  ).toFixed(2)}, ${parseInt(
                                                      imageDetails.endCo.y
                                                  ).toFixed(2)})`
                                                : '(0,0)'
                                        }
                                        precision={2}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    {!!imgSrc && (
                        <Col xs={18}>
                            <div className='mt-6'>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) =>
                                        setCrop(percentCrop)
                                    }
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                >
                                    <img
                                        ref={imgRef}
                                        onLoad={onImageLoad}
                                        src={imgSrc}
                                        alt='uploaded-img'
                                        className='mx-auto'
                                    />
                                </ReactCrop>
                            </div>
                        </Col>
                    )}
                    {!!completedCrop && (
                        <Col xs={24}>
                            <div className='mt-32'>
                                {!!completedCrop && (
                                    <canvas
                                        className='mx-auto'
                                        ref={previewCanvasRef}
                                        style={{
                                            border: '1px solid black',
                                            objectFit: 'contain',
                                            width: completedCrop.width,
                                            height: completedCrop.height,
                                        }}
                                    />
                                )}
                            </div>
                        </Col>
                    )}
                </Row>
            </div>
        </>
    );
}

export default App;
