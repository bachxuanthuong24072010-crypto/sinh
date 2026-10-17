// ==============================================================================
// SERVICE WORKER - SỔ TAY HỌC ĐƯỜNG PWA (OFFLINE & CACHE MANAGER)
// ==============================================================================

const CACHE_NAME = 'so-tay-hoc-duong-v3';

// Danh sách tài nguyên cốt lõi cần nạp vào bộ nhớ đệm ngay khi cài đặt
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './app.js',
    './battle.js',
    './exam_data.js',
    './xlsx.js',
    './manifest.json',
    './favicon.png',
    './apple-touch-icon.png',
    './icon-192.png',
    './icon-512.png',
    './app_icon.png',
    './card1_timetable.png',
    './card2_profile.png',
    './card3_qa.png',
    './card4_career.png',
    './card5_exam.png',
    './genie.png',
    './genie_4_emotions.png'
];

// 1. SỰ KIỆN CÀI ĐẶT (INSTALL): Nạp trước toàn bộ tài nguyên cốt lõi
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Kích hoạt ngay lập tức mà không cần đợi phiên cũ đóng
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[PWA SW] Đang lưu trữ tài nguyên ngoại tuyến...');
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[PWA SW] Cảnh báo nạp cache một số file:', err);
            });
        })
    );
});

// 2. SỰ KIỆN KÍCH HOẠT (ACTIVATE): Dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[PWA SW] Đang dọn dẹp cache cũ:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. SỰ KIỆN CHẶN BẮT YÊU CẦU MẠNG (FETCH):
// Chiến lược: Stale-While-Revalidate hoặc Network-First có dự phòng Cache
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Bỏ qua các yêu cầu không phải GET hoặc chrome-extension
    if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
        return;
    }

    // Với các yêu cầu nội bộ (cùng domain / relative)
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                // Thử tải phiên bản mới nhất từ mạng ngầm (Background Revalidation)
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Nếu mất mạng và không có trong cache, trả về trang index.html
                    if (request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });

                // Nếu đã có sẵn trong cache thì trả về ngay lập tức để app mở tức thì (0.1s)
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Với tài nguyên CDN bên ngoài (Tailwind, FontAwesome, Firebase...)
    event.respondWith(
        fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            // Mất mạng: tìm lại trong cache
            return caches.match(request);
        })
    );
});
