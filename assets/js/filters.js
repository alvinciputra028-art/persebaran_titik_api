const UNKNOWN_VALUE = 'Tidak Diketahui';

function getProperties(feature) {
    return feature.properties || {};
}

export function getHotspotValue(feature, field) {
    const properties = getProperties(feature);
    const fields = {
        kecamatan: ['Kecamatan', 'KECAMATAN'],
        satelit: ['Satelit', 'SATELIT'],
        kepercayaan: ['Confidence', 'CONFIDENCE', 'Tingkat_Kepercayaan', 'Kepercayaan'],
        tanggal: ['Tanggal', 'TANGGAL']
    };

    const value = fields[field]
        .map((property) => properties[property])
        .find((property) => property !== undefined && property !== null && property !== '');

    return value === undefined ? UNKNOWN_VALUE : String(value);
}

export function getUniqueFilterValues(features) {
    return {
        kecamatan: getUniqueValues(features, 'kecamatan'),
        satelit: getUniqueValues(features, 'satelit'),
        kepercayaan: getUniqueValues(features, 'kepercayaan')
    };
}

function getUniqueValues(features, field) {
    return [...new Set(features.map((feature) => getHotspotValue(feature, field)))].sort();
}

export function filterHotspots(features, filterState) {
    return features.filter((feature) => {
        const dateValue = getHotspotValue(feature, 'tanggal');
        const matchesDate = matchesDateRange(dateValue, filterState.startDate, filterState.endDate);

        return filterState.kecamatan.includes(getHotspotValue(feature, 'kecamatan'))
            && filterState.satelit.includes(getHotspotValue(feature, 'satelit'))
            && filterState.kepercayaan.includes(getHotspotValue(feature, 'kepercayaan'))
            && matchesDate;
    });
}

function matchesDateRange(dateValue, startDate, endDate) {
    if (dateValue === UNKNOWN_VALUE || (!startDate && !endDate)) {
        return true;
    }

    const hotspotDate = new Date(dateValue);

    if (Number.isNaN(hotspotDate.getTime())) {
        return false;
    }

    if (startDate && hotspotDate < new Date(startDate)) {
        return false;
    }

    if (endDate && hotspotDate > new Date(endDate)) {
        return false;
    }

    return true;
}
