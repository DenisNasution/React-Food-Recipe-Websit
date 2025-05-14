import React from 'react'

const ModalComponent = ({ children, onClose, onDelete, data }) => {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal}>
                {children}
                <button style={styles.closeButton} onClick={onClose}>
                X
                </button>
                <div className='confButton' style={styles.confButton}>
                    <div className='cancelButton' style={styles.cancelButton} onClick={onClose}>CANCEL</div>
                    <div className='modalDelButton' style={styles.modalDelButton} onClick={onDelete}>DELETE</div>
                </div>
            </div>
        </div>
        );
        }
        
        const styles = {
            confButton:{
                display: 'flex',
                justifyContent: 'center',
                // gap: '3rem',
                marginTop: '2rem',

            },
            cancelButton:{
                backgroundColor: '#ccc',
                color: 'black',
                opacity: '0.9',
                float: 'left',
                width: '50%',
                cursor: 'pointer',
                padding: '14px 20px'

            },
            modalDelButton:{
                backgroundColor: '#f44336',
                color: 'white',
                opacity: '0.9',
                float: 'left',
                width: '50%',
                cursor: 'pointer',
                padding: '14px 20px'
            },
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
            modal: {
                backgroundColor: "white",
                padding: "20px",
                // borderRadius: "8px",
                position: "relative",
                width: "80%",
                maxWidth: "500px",
                textAlign: 'center'
            },
            closeButton: {
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer"
            }
    };

export default ModalComponent