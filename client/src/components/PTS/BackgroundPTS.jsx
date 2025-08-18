import { useState, useEffect } from 'react';
import PTSLongTermTable from './PTSLongTermTable';

const BackgroundPTS = ({ kiinteistotunnus, setPtsImages }) => {
  const [show, setShow] = useState(true);

    useEffect(() => {
    setShow(true); // reset to true whenever kiinteistotunnus changes

    const timer = setTimeout(() => {
        setShow(false);
    }, 10000);

    return () => clearTimeout(timer);
    }, [kiinteistotunnus]); // dependency on kiinteistotunnus

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
