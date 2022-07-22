import ReactDOM from "react-dom/client";
import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./mapbox-custom.module.css";

mapboxgl.accessToken = process.env.REACT_APP_ACCESS_TOKEN!;

// map reference
// https://docs.mapbox.com/mapbox-gl-js/api/map/#map#on

export default function MapboxCustomMap() {
  const mapContainer = useRef<any>("");
  const map = useRef<null | mapboxgl.Map>(null);
  const [lng, setLng] = useState(-87.62);
  const [lat, setLat] = useState(41.872);
  const [zoom, setZoom] = useState(9);
  const layerName = "chicago-parks";

  const popupRef = useRef(new mapboxgl.Popup({ offset: 20 }));

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_STYLE_URL,
      center: [lng, lat],
      zoom: zoom,
    });
  }, [lat, lng, zoom]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize

    function moveHandler() {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    }

    function clickHandler(event: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
      const features = map.current?.queryRenderedFeatures(event.point, {
        layers: [layerName],
      });

      if (!features || !features.length) {
        return;
      }

      const feature = features[0];

      const mapCurr = map.current!;
      // Code from the next step will go here.

      const popupNode = document.createElement("div");
      ReactDOM.createRoot(popupNode).render(<PopUp feature={feature}></PopUp>);

      popupRef.current
        .setDOMContent(popupNode)
        .setLngLat(event.lngLat)
        .addTo(mapCurr);

      const popupel = popupRef.current.getElement();
      popupel.classList.add(styles.popup);
    }

    map.current.on("move", moveHandler);
    map.current.on("click", clickHandler);
    const popup = popupRef.current;

    return function () {
      map.current?.off("move", moveHandler);
      map.current?.off("click", clickHandler);
      popup.remove();
    };
  });

  useEffect(() => {
    function resizeHandler() {
      popupRef.current.remove();
    }

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div>
      <p>map should be here</p>

      <div className={styles["mapboxgl-map"]} ref={mapContainer}>
        <div className={styles.sidebar}>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
    </div>
  );
}

function PopUp({ feature }: { feature: mapboxgl.MapboxGeoJSONFeature }) {
  return (
    <div className="popup-inner-content">
      <h3>{feature.properties?.title}</h3>
      <p>{feature.properties?.description}</p>
    </div>
  );
}
