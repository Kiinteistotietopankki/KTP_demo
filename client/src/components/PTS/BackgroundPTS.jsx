import { useState, useEffect } from 'react';
import PTSLongTermTable from './PTSLongTermTable';

const BackgroundPTS = ({ kiinteistotunnus, setPtsImages }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    console.log()
    const timer = setTimeout(() => {
      setShow(false); // unmount after 5 seconds
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none', opacity: 0 }}>
      <PTSLongTermTable
        kiinteistotunnus={kiinteistotunnus}
        setPtsImages={setPtsImages}
        onBackground={true}
      />
    </div>
  );
};

export default BackgroundPTS;
