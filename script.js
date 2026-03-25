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

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    try {
        const mapImg = new Image();
        mapImg.src = MAP_URL;
        await new Promise((resolve, reject) => {
            mapImg.onload = resolve;
            mapImg.onerror = () => reject(new Error('マップ画像の読み込みに失敗しました'));
        });
        ctx.drawImage(mapImg, 0, 0, MAP_WIDTH, MAP_HEIGHT);

        const pinImg = new Image();
        pinImg.src = PIN_URL;
        await new Promise((resolve, reject) => {
            pinImg.onload = resolve;
            pinImg.onerror = () => reject(new Error('ピン画像の読み込みに失敗しました'));
        });

        const pinSize = 80;
        const pinX = x - (pinSize / 2);
        const pinY = (MAP_HEIGHT - y) - pinSize;
        ctx.drawImage(pinImg, pinX, pinY, pinSize, pinSize);
    } catch (error) {
        alert(error.message);
        return; // エラー時はここで処理を止める
    }

    canvas.toBlob(async (blob) => {
        if (!blob) {
            alert('画像の生成に失敗しました。Canvasが汚染されている可能性があります。');
            return;
        }

        const file = new File([blob], "share.png", { type: "image/png" });
        const shareUrl = false; // URL共有フラグ
        const shareData = {
            title: '現在地',
            files: [file] // URLは入れない
        };

        if (shareUrl) {
            shareData.url = window.location.href;
        }

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                if (shareUrl) {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('URLをコピーしました');
                } else {
                    alert('お使いの端末は画像シェアに対応していません');
                }
            }
        } catch (error) {
            // ユーザーがシェアシートを閉じた場合もエラーに入るためアラートではなくコンソール出力に
            console.log('共有キャンセルまたは失敗:', error);
        }
    }, 'image/png');
});