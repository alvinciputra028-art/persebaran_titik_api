export async function loadGeoJson(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Gagal memuat data GeoJSON: ${path}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.features)) {
        throw new Error(`Format GeoJSON tidak valid: ${path}`);
    }

    return data;
}

export async function loadHotspotFeatures(path) {
    const data = await loadGeoJson(path);
    return data.features;
}
