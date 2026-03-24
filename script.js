const MAP_URL = 'assets/map.svg';
const PIN_URL = 'assets/pin.svg';
const MAP_WIDTH = 600;
const MAP_HEIGHT = 1100;

const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomSnap: 0.5
});

const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];
L.imageOverlay(MAP_URL, bounds).addTo(map);
map.fitBounds(bounds);

let currentMarker = null;
const shareBtn = document.getElementById('share-btn');

const pinIcon = L.icon({
    iconUrl: PIN_URL,
    iconSize: [80, 80],
    iconAnchor: [40, 80]
});

const urlParams = new URLSearchParams(window.location.search);
const paramX = urlParams.get('x');
const paramY = urlParams.get('y');

if (paramX && paramY) {
    addPin(parseFloat(paramY), parseFloat(paramX));
}

map.on('click', function (e) {
    addPin(e.latlng.lat, e.latlng.lng);
});

function addPin(y, x) {
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    currentMarker = L.marker([y, x], { icon: pinIcon }).addTo(map);
    shareBtn.style.display = 'block';

    const newUrl = `${window.location.pathname}?x=${x}&y=${y}`;
    window.history.replaceState(null, '', newUrl);
}

shareBtn.addEventListener('click', async () => {
    if (!currentMarker) return;

    const latlng = currentMarker.getLatLng();
    const x = latlng.lng;
    const y = latlng.lat;

    const canvas = document.createElement('canvas');
    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;
    const ctx = canvas.getContext('2d');
    // ctx.fillStyle = '#000';
    // ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    const mapImg = new Image();
    mapImg.src = MAP_URL;
    await new Promise(resolve => mapImg.onload = resolve);
    ctx.drawImage(mapImg, 0, 0, MAP_WIDTH, MAP_HEIGHT);

    const pinImg = new Image();
    pinImg.src = PIN_URL;
    await new Promise(resolve => pinImg.onload = resolve);

    const pinX = x - 20;
    const pinY = (MAP_HEIGHT - y) - 40;
    ctx.drawImage(pinImg, pinX, pinY, 40, 40);

    canvas.toBlob(async (blob) => {
        const file = new File([blob], "share.png", { type: "image/png" });
        const shareUrl = true; // URL共有フラグ
        const shareData = {
            title: '現在地',
            files: [file]
        };

        if (shareUrl) {
            shareData.url = window.location.href;
        }

        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            // URL共有しない場合でも、画像だけはクリップボードに保存
            const textToCopy = shareUrl ? window.location.href : '';
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy);
            }
        }
    }, 'image/png');
});