const APP_PREFIX = 'budget';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/style.css",
    "./js/index.js",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
    "./js/idb.js",
];

//tells use every time the application requests a resource by sending the path to the resoure to the console log
self.addEventListener('fetch', function (e) {
    console.log('Fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { //if cache is available, respond with cache
                console.log('Responding with cache : ' + e.request.url)
                return request
            } else { //if there are no cache, try fetching request
                console.log('File is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})

//event listener that caches resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE);
        })
    )
})

//event listener that activates the service worker and deletes the outdated cache info
self.addEventListener('activate', function (e) {
    e.waitUntil(
        cache.keys().then(function(keyList) {
            let cacheKeeplist = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('Deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});