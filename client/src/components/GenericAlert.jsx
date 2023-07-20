import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'

const GenericAlert = ({ variant, body }) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
          setShow(false);
        }, 5000)
    
        return () => {
          clearTimeout(timer)
        }
      }, [])

    return (
        <>
        {
            show && (
                <Alert style={{ width: '90%', margin: '1rem auto'}} variant={variant}>
                    <p style={{ marginBottom: '0'}}>
                        {body}
                    </p>
                </Alert>
            )}
        </>
    );
};

GenericAlert.propTypes = {
    variant: PropTypes.string,
    body: PropTypes.string,
}

export default GenericAlert
