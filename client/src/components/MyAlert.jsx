import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

const MyAlert = ({variant, heading, body}) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
          setShow(false);
        }, 5000); // 5000 milliseconds = 5 seconds
    
        return () => {
          clearTimeout(timer);
        };
      }, []);

    return (
        <>
        {
            show && (
                <Alert style={{ width: '90%', margin: '1rem auto'}} variant={variant}>
                    {/* <Alert.Heading>{heading}</Alert.Heading> */}
                    <p style={{ marginBottom: '0'}}>
                        {body}
                    </p>
                </Alert>
            )}
        </>
    );
};

export default MyAlert;