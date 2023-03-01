import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import React from 'react';

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

const UploadImg = ({ onImageUpload, onDeleteImg, from }) => {
    return (
        <>
            <Dragger
                {...props}
                onChange={(file) => onImageUpload(file, from)}
                showUploadList={false}
            >
                <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                </p>
                <p className='ant-upload-text'>
                    Click or drag file to this area to upload
                </p>
                <p className='ant-upload-hint'>
                    Only one image upload is allowed at a time, of type (png,
                    jpeg, jpg)
                </p>
            </Dragger>
        </>
    );
};

export default UploadImg;
