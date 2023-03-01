import { Card, Col, Row, Statistic } from 'antd';
import React from 'react';

const Stats = ({imageDetails}) => {
    return (
        <>
            <Row justify={'center'} gutter={[16, 16]}>
                <Col xs={12} md={5}>
                    <Card bordered={false} className='!shadow-lg'>
                        <Statistic
                            title='Height'
                            value={imageDetails.height || 0}
                            precision={2}
                            suffix='%'
                        />
                    </Card>
                </Col>
                <Col xs={12} md={5}>
                    <Card bordered={false} className='!shadow-lg'>
                        <Statistic
                            title='Width'
                            value={imageDetails.width || 0}
                            precision={2}
                            suffix='%'
                        />
                    </Card>
                </Col>
                <Col xs={12} md={5}>
                    <Card bordered={false} className='!shadow-lg'>
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
                <Col xs={12} md={5}>
                    <Card bordered={false} className='!shadow-lg'>
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
        </>
    );
};

export default Stats;
