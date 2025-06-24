import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MapVisual from "./MapVisual";

const StickyAfterScroll = ({mapCoordinates}) => {
  const ref = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  const [coordinates, setCoordinates] = useState([])

  useEffect(() => {
    setCoordinates([mapCoordinates[1], mapCoordinates[0]]);
  }, [mapCoordinates]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      setIsSticky(rect.top <= 0); // becomes sticky when top is off screen
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div
        ref={ref}
        className={`p-3 bg-primary text-white ${isSticky ? "position-fixed top-0 w-100 shadow" : ""}`}
        style={{ zIndex: 1000 }}
      >
        <MapVisual pos={[65.00816937, 25.46030678]} coords={coordinates} />
      </div>
        
      <div style={{ height: "2000px", paddingTop: "100px" }}>
        <p>Scroll down to see the component stick to the top.</p>
      </div>
    </div>
  );
};

export default StickyAfterScroll;
