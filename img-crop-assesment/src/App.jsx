import { useEffect, useRef, useState } from 'react';
// antd imports
import { Button, Col, Empty, Row, Tabs, Tooltip } from 'antd';

// others imports
import ReactCrop from 'react-image-crop';
import { cropCenter, getImageURL } from './utils/helpers';
import { imagePreview } from './utils/imagePreview';
import { useDebounceEffect } from '../hooks/useDebounceEffects';
import { ImageUpload, Stats } from './components';

function App() {
    const [imgSrc, setImgSrc] = useState('');
    const [imgSrc2, setImgSrc2] = useState('');

    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();

    const [crop2, setCrop2] = useState();

    const [aspect, setAspect] = useState(undefined);
    // - 16 / 9 for rectangle
    // - 1 for square
    // - undefined for free crop
    const [imageDetails, setImageDetails] = useState({
        startCo: { x: 0, y: 0 },
        endCo: { x: 0, y: 0 },
        height: null,
        width: null,
    });

    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const onImageUpload = (imgFile, part) => {
        if (imgFile.file.status === 'done') {
            setCrop(undefined);
            if (part === 2) {
                getImageURL(setImgSrc2, imgFile);
            } else {
                getImageURL(setImgSrc, imgFile);
            }
        }
    };

    const onImageLoad = (e, from) => {
        const { width, height } = e.currentTarget;

        if (from === 1) {
            console.log('inside');
            setCrop(cropCenter(width, height, aspect));
        } else {
            if (crop2) return;
            setCrop2({
                height: imageDetails.height,
                unit: '%',
                width: imageDetails.width,
                x: imageDetails.startCo.x,
                y: imageDetails.startCo.y,
            });
        }
    };

    const onDeleteImg = () => {
        setImgSrc('');
        setCompletedCrop('');
        setImgSrc2('');
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
            <div className='m-6 md:m-20'>
                <Row justify={'center'}>
                    <Col xs={24} className='my-14'>
                        <Stats imageDetails={imageDetails} />
                    </Col>
                    <Col xs={24} className='text-right'>
                        <Tooltip title='Resets the uploads' placement='bottom'>
                            <Button onClick={onDeleteImg}>Restore</Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            key: '1',
                            label: 'Part 1',
                            children: (
                                <Row justify={'center'}>
                                    <Col xs={24} className='mb-5'>
                                        <ImageUpload
                                            from={1}
                                            onImageUpload={onImageUpload}
                                            onDeleteImg={onDeleteImg}
                                        />
                                    </Col>
                                    {!!imgSrc && (
                                        <Col xs={24} md={18}>
                                            <div className='mt-6 flex justify-center'>
                                                <ReactCrop
                                                    crop={crop}
                                                    onChange={(
                                                        _,
                                                        percentCrop
                                                    ) => setCrop(percentCrop)}
                                                    onComplete={(c) =>
                                                        setCompletedCrop(c)
                                                    }
                                                    aspect={aspect}
                                                >
                                                    <img
                                                        ref={imgRef}
                                                        onLoad={(e) => {
                                                            onImageLoad(e, 1);
                                                        }}
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
                                            <div className='mt-10'>
                                                {!!completedCrop && (
                                                    <canvas
                                                        className='mx-auto'
                                                        ref={previewCanvasRef}
                                                        style={{
                                                            border: '1px solid black',
                                                            objectFit:
                                                                'contain',
                                                            width: completedCrop.width,
                                                            height: completedCrop.height,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Part 2',
                            children:
                                imageDetails.height && imageDetails.width ? (
                                    <Row justify={'center'}>
                                        <Col xs={24} className='mb-16'>
                                            <ImageUpload
                                                from={2}
                                                onImageUpload={onImageUpload}
                                                onDeleteImg={onDeleteImg}
                                            />
                                        </Col>
                                        {!!imgSrc2 && (
                                            <Col xs={24} md={18}>
                                                <div className='mt-6 flex justify-center'>
                                                    <ReactCrop
                                                        crop={crop2}
                                                        onChange={(c) =>
                                                            setCrop2(c)
                                                        }
                                                        aspect={aspect}
                                                    >
                                                        <img
                                                            ref={imgRef}
                                                            onLoad={(e) => {
                                                                onImageLoad(
                                                                    e,
                                                                    2
                                                                );
                                                            }}
                                                            src={imgSrc2}
                                                            alt='uploaded-img'
                                                            className='mx-auto'
                                                        />
                                                    </ReactCrop>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                ) : (
                                    <Empty description='Please upload and resize image on part one to continue...' />
                                ),
                        },
                    ]}
                />
            </div>
        </>
    );
}

export default App;
