import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

const LEAFLET_VERSION = "1.9.4";
const DEFAULT_CENTER = [5.7, 12.7]; // Cameroun
let leafletPromise;

function chargerLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const existingStyle = document.querySelector("[data-leaflet-style]");
      if (!existingStyle) {
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
        style.dataset.leafletStyle = "true";
        document.head.appendChild(style);
      }

      const existingScript = document.querySelector("[data-leaflet-script]");
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.L), { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        if (window.L) resolve(window.L);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
      script.async = true;
      script.dataset.leafletScript = "true";
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error("La carte n’a pas pu être chargée. Vérifiez votre connexion puis réessayez."));
      document.head.appendChild(script);
    });
  }
  return leafletPromise;
}

export default function CarteSelectionLocalisation({
  latitude,
  longitude,
  onChange,
  vendeurs = [],
  selection = "",
  hauteur = 360,
}) {
  const elementRef = useRef(null);
  const carteRef = useRef(null);
  const marqueurRef = useRef(null);
  const coucheVendeursRef = useRef(null);
  const callbackRef = useRef(onChange);
  const [erreurCarte, setErreurCarte] = useState("");
  const [cartePrete, setCartePrete] = useState(false);

  useEffect(() => { callbackRef.current = onChange; }, [onChange]);

  useEffect(() => {
    let annule = false;
    chargerLeaflet().then((L) => {
      if (annule || !elementRef.current || carteRef.current) return;
      const hasPoint = latitude != null && latitude !== "" && longitude != null && longitude !== "";
      const lat = hasPoint ? Number(latitude) : NaN;
      const lng = hasPoint ? Number(longitude) : NaN;
      const centre = Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : DEFAULT_CENTER;
      const carte = L.map(elementRef.current, { scrollWheelZoom: false }).setView(centre, hasPoint ? 14 : 6);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(carte);
      carteRef.current = carte;

      carte.on("click", (event) => {
        const next = { latitude: Number(event.latlng.lat.toFixed(7)), longitude: Number(event.latlng.lng.toFixed(7)) };
        if (!marqueurRef.current) {
          marqueurRef.current = L.marker(event.latlng, { draggable: true }).addTo(carte);
          marqueurRef.current.on("dragend", (dragEvent) => {
            const point = dragEvent.target.getLatLng();
            callbackRef.current?.({ latitude: Number(point.lat.toFixed(7)), longitude: Number(point.lng.toFixed(7)) });
          });
        } else marqueurRef.current.setLatLng(event.latlng);
        callbackRef.current?.(next);
      });
      setCartePrete(true);
    }).catch((error) => setErreurCarte(error.message || "Impossible de charger la carte."));

    return () => {
      annule = true;
      carteRef.current?.remove();
      carteRef.current = null;
      marqueurRef.current = null;
      coucheVendeursRef.current = null;
    };
    // Initialize the map once; marker and seller data are synchronized below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const carte = carteRef.current;
    const L = window.L;
    if (!carte || !L) return;
    const hasPoint = latitude != null && latitude !== "" && longitude != null && longitude !== "";
    const lat = hasPoint ? Number(latitude) : NaN;
    const lng = hasPoint ? Number(longitude) : NaN;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      if (marqueurRef.current) {
        carte.removeLayer(marqueurRef.current);
        marqueurRef.current = null;
      }
      return;
    }
    const point = [lat, lng];
    if (!marqueurRef.current) {
      marqueurRef.current = L.marker(point, { draggable: true }).addTo(carte);
      marqueurRef.current.on("dragend", (event) => {
        const position = event.target.getLatLng();
        callbackRef.current?.({ latitude: Number(position.lat.toFixed(7)), longitude: Number(position.lng.toFixed(7)) });
      });
    } else marqueurRef.current.setLatLng(point);
  }, [latitude, longitude, cartePrete]);

  useEffect(() => {
    const carte = carteRef.current;
    const L = window.L;
    if (!carte || !L) return;
    coucheVendeursRef.current?.remove();
    const marqueurs = vendeurs.flatMap((vendeur) => {
      if (vendeur.latitude == null || vendeur.longitude == null || vendeur.latitude === "" || vendeur.longitude === "") return [];
      const lat = Number(vendeur.latitude);
      const lng = Number(vendeur.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
      const marqueur = L.marker([lat, lng]).bindPopup(
        `<strong>${echapperHtml(vendeur.name)}</strong><br>${echapperHtml([vendeur.city, vendeur.country].filter(Boolean).join(", "))}`
      );
      marqueur._vendeurId = vendeur.id;
      marqueur.on("click", () => vendeur.onSelect?.(vendeur.id));
      return [marqueur];
    });
    coucheVendeursRef.current = L.featureGroup(marqueurs).addTo(carte);
    if (selection) {
      const choisie = marqueurs.find((marqueur) => marqueur._vendeurId === selection);
      if (choisie) {
        carte.setView(choisie.getLatLng(), Math.max(carte.getZoom(), 13));
        choisie.openPopup();
      }
    } else if (marqueurs.length > 1) {
      carte.fitBounds(coucheVendeursRef.current.getBounds().pad(0.15), { maxZoom: 12 });
    } else if (marqueurs.length === 1) {
      carte.setView(marqueurs[0].getLatLng(), 12);
    }
  }, [vendeurs, selection, cartePrete]);

  function meGeolocaliser() {
    if (!navigator.geolocation) {
      setErreurCarte("La géolocalisation n’est pas prise en charge par ce navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const point = { latitude: Number(coords.latitude.toFixed(7)), longitude: Number(coords.longitude.toFixed(7)) };
      callbackRef.current?.(point);
      carteRef.current?.setView([point.latitude, point.longitude], 15);
    }, () => setErreurCarte("Position inaccessible. Autorisez la géolocalisation ou cliquez directement sur la carte."), { enableHighAccuracy: true, timeout: 10000 });
  }

  return <div>
    <div ref={elementRef} role="application" aria-label="Carte de sélection de la localisation" style={{ height: `${hauteur}px` }} className="w-full rounded-lg border border-border z-0" />
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
      <span className="flex items-center gap-1"><MapPin size={14} /> Cliquez sur la carte ou déplacez le repère pour choisir le point.</span>
      <button type="button" onClick={meGeolocaliser} className="btn-outline btn-sm flex items-center gap-1"><Navigation size={13} /> Utiliser ma position</button>
    </div>
    {erreurCarte && <p role="alert" className="mt-2 text-xs text-danger">{erreurCarte}</p>}
    <p className="mt-1 text-[11px] text-faint">La position choisie sera visible publiquement sur la carte des librairies.</p>
  </div>;
}

function echapperHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}
