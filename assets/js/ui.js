import { getHotspotValue } from './filters.js';

const FILTER_CONFIG = [
    { field: 'kepercayaan', containerId: 'filter-kepercayaan', className: 'cb-kepercayaan' },
    { field: 'satelit', containerId: 'filter-satelit', className: 'cb-satelit' },
    { field: 'kecamatan', containerId: 'filter-kecamatan', className: 'cb-kecamatan' }
];

export function renderDynamicFilters(filterValues, onChange) {
    FILTER_CONFIG.forEach(({ field, containerId, className }) => {
        const container = document.getElementById(containerId);
        container.replaceChildren();

        filterValues[field].forEach((value) => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = value;
            input.className = className;
            input.checked = true;
            input.addEventListener('change', onChange);

            label.append(input, document.createTextNode(` ${value}`));
            container.appendChild(label);
        });
    });
}

export function bindDateFilters(onChange) {
    document.getElementById('filter-start-date').addEventListener('change', onChange);
    document.getElementById('filter-end-date').addEventListener('change', onChange);
}

export function readFilterState() {
    return {
        kecamatan: readCheckedValues('.cb-kecamatan'),
        satelit: readCheckedValues('.cb-satelit'),
        kepercayaan: readCheckedValues('.cb-kepercayaan'),
        startDate: document.getElementById('filter-start-date').value,
        endDate: document.getElementById('filter-end-date').value
    };
}

function readCheckedValues(selector) {
    return [...document.querySelectorAll(`${selector}:checked`)].map((input) => input.value);
}

export function createHotspotPopup(feature) {
    const properties = feature.properties || {};
    const value = (field) => properties[field] || '-';

    return `
        <div class="hotspot-popup">
            <h4>🔥 Titik Api (Hotspot)</h4>
            <hr>
            <p><b>Kecamatan:</b> ${value('Kecamatan')}</p>
            <p><b>Desa:</b> ${value('Desa')}</p>
            <p><b>Tingkat Kepercayaan:</b> ${getHotspotValue(feature, 'kepercayaan')}</p>
            <p><b>Tanggal:</b> ${value('Tanggal')}</p>
            <p><b>Waktu:</b> ${value('Waktu')}</p>
            <p><b>Satelit:</b> ${getHotspotValue(feature, 'satelit')}</p>
            <p><b>Koordinat:</b> ${value('Latitude')}, ${value('Longitude')}</p>
        </div>
    `;
}

export function showApplicationError(error) {
    console.error(error);
    const message = document.createElement('p');
    message.className = 'application-error';
    message.textContent = 'Data peta gagal dimuat. Silakan muat ulang halaman.';
    document.querySelector('.sidebar').prepend(message);
}
