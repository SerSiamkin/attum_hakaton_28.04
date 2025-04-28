import React from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ephemerisData from '../../ephemeris.json';

// Фикс для иконок маркеров
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Функция для группировки точек по pass_id
const groupByPassId = (data) => {
    const passes = {};
    data.ephemeris.forEach(point => {
        if (!passes[point.pass_id]) {
            passes[point.pass_id] = [];
        }
        passes[point.pass_id].push([point.geodesic.lat, point.geodesic.lon]);
    });
    return passes;
};

// Функция для создания описания траектории
const createTooltipContent = (passId, pointsCount) => {
    return `
        <div>
            <strong>Траектория #${passId}</strong><br>
            Точки: ${pointsCount}<br>
            Спутник: ${ephemerisData.metadata.satellite_name}<br>
            NORAD ID: ${ephemerisData.metadata.norad_id}
        </div>
    `;
};

const darkModeStyles = {
    mapContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#000',
        border: '1px solid #444',
    },
};

const StationMap = () => {
    // Центр карты - Тихий океан (с учетом смещения)
    const pacificCenter = [0, -150]; // 0° широты, 150° западной долготы
    const zoomLevel = 2;

    // Группируем точки по pass_id
    const passes = groupByPassId(ephemerisData);

    // Цвета для разных траекторий
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    // Функция для сдвига координат (перенос разрыва карты в Европу)
    const shiftLongitude = (lon) => {
        // Смещаем разрыв карты в Европу (примерно 20° восточной долготы)
        const breakPoint = 20;
        return lon > breakPoint - 180 ? lon - 360 : lon;
    };

    return (
        <MapContainer
            center={pacificCenter}
            zoom={zoomLevel}
            style={darkModeStyles.mapContainer}
            zoomControl={true}
            attributionControl={false}
            minZoom={2}
            maxZoom={18}
            worldCopyJump={true} // Убедитесь, что это свойство установлено в true
            crs={L.CRS.EPSG3857}
            bounds={[[-90, -180], [90, 180]]} // Измените границы, чтобы охватить весь мир
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                noWrap={true}
                maxZoom={18}
                minZoom={2}
                detectRetina={true}
                bounds={[[-90, -180], [90, 180]]} // Измените границы, чтобы охватить весь мир
            />

            {/* Рендерим траектории для каждого pass_id */}
            {Object.entries(passes).map(([passId, positions], index) => {
                // Обработка для продолжения траектории с учетом нового разрыва
                const adjustedPositions = positions.map(([lat, lon]) => {
                    // Применяем сдвиг долготы
                    const shiftedLon = shiftLongitude(lon);
                    return [lat, shiftedLon];
                });

                return (
                    <Polyline
                        key={passId}
                        positions={adjustedPositions}
                        color={colors[index % colors.length]}
                        weight={2}
                        opacity={0.7}
                        smoothFactor={1}
                    >
                        <Tooltip direction="top" opacity={0.9} permanent={false}>
                            {createTooltipContent(passId, adjustedPositions.length)}
                        </Tooltip>
                    </Polyline>
                );
            })}
        </MapContainer>
    );
};

export default StationMap;