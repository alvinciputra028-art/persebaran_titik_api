import { DATA_PATHS } from './config.js';
import { loadGeoJson, loadHotspotFeatures } from './data.js';
import { filterHotspots, getUniqueFilterValues } from './filters.js';
import { addDistrictLayer, createHotspotLayer, initializeMap, renderHotspots } from './map.js';
import {
    bindDateFilters,
    readFilterState,
    renderDynamicFilters,
    showApplicationError
} from './ui.js';

async function startApplication() {
    const map = initializeMap();
    const hotspotLayer = createHotspotLayer(map);
    const [districtData, hotspotFeatures] = await Promise.all([
        loadGeoJson(DATA_PATHS.districts),
        loadHotspotFeatures(DATA_PATHS.hotspots)
    ]);

    addDistrictLayer(map, districtData);
    renderDynamicFilters(getUniqueFilterValues(hotspotFeatures), updateHotspots);
    bindDateFilters(updateHotspots);

    function updateHotspots() {
        const filteredFeatures = filterHotspots(hotspotFeatures, readFilterState());
        renderHotspots(hotspotLayer, filteredFeatures);
    }

    updateHotspots();
}

startApplication().catch(showApplicationError);
