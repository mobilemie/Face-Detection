self.addEventListener("instsall", e => {
    e.waitUntill(
        caches.open("static").then(cache => {
            return cache.andAll(["./images/humen.png"]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
})