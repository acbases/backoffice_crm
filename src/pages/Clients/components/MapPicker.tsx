import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type MapPickerProps = {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
};

const containerStyle = {
    width: "100%",
    height: "400px",
};

export default function MapPicker({
    lat,
    lng,
    onChange,
}: MapPickerProps) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });
    
    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat, lng }}
            zoom={14}
            onClick={(e) => {
                if (!e.latLng) return;

                onChange(
                    e.latLng.lat(),
                    e.latLng.lng()
                );
            }}
        >
            <Marker position={{ lat, lng }} />
        </GoogleMap>
    );
}