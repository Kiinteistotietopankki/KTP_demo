import { Toast } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function ToastMessage({ show, message, bg = 'success', onClose }) {
  const [visible, setVisible] = useState(show);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toastStyle = {
    position: 'fixed',
    bottom: '20px',
    right: isMobile ? '50%' : '20px', // center on mobile
    transform: isMobile ? 'translateX(50%)' : 'none',
    zIndex: 1050,
    minWidth: '350px',
    fontSize: '1.2rem',
  };

  return (
    <div style={toastStyle}>
      <Toast
        bg={bg}
        onClose={() => { setVisible(false); onClose?.(); }}
        show={visible}
        delay={3000}
        autohide
        style={{ minWidth: '350px', fontSize: '1.2rem' }}
      >
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </div>
  );
}
