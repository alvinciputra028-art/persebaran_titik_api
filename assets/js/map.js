import { MAP_OPTIONS } from './config.js';
import { createHotspotPopup } from './ui.js';

const colorPalette = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9',
    '#ff7f50', '#87cefa', '#ffd700', '#da70d6', '#32cd32',
    '#ff1493'
];

export function initializeMap() {
    const map = L.map('map').setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);

    L.tileLayer(MAP_OPTIONS.tileUrl, {
        attribution: MAP_OPTIONS.tileAttribution
    }).addTo(map);

    return map;
}

export function addDistrictLayer(map, data) {
    L.geoJSON(data, {
        style: (feature) => ({
            color: '#2c3e50',
            weight: 1.5,
            fillColor: getColorByName(feature.properties?.NAMOBJ || ''),
            fillOpacity: 0.4
        }),
        onEachFeature: (feature, layer) => {
            const name = feature.properties?.NAMOBJ || 'Tidak Diketahui';
            layer.bindTooltip(`<b>Kecamatan ${name}</b>`, { sticky: true });
        }
    }).addTo(map);
}

export function createHotspotLayer(map) {
    return L.layerGroup().addTo(map);
}

export function renderHotspots(layerGroup, features) {
    layerGroup.clearLayers();

    L.geoJSON(features, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            pane: 'markerPane',
            radius: 6,
            fillColor: '#e74c3c',
            color: '#c0392b',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }),
        onEachFeature: (feature, layer) => layer.bindPopup(createHotspotPopup(feature))
    }).addTo(layerGroup);
}

function getColorByName(name) {
    if (!name) {
        return '#bdc3c7';
    }

    let hash = 0;
    for (let index = 0; index < name.length; index += 1) {
        hash = name.charCodeAt(index) + ((hash << 5) - hash);
    }

    return colorPalette[Math.abs(hash) % colorPalette.length];
}
