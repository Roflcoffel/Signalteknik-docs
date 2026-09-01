const cacheName = self.location.pathname
const pages = [

  "/docs/section-1/",
    "/docs/section-1/section-2/",
    "/docs/section-1/section-2/leaf-page-1/",
    "/docs/section-1/section-2/leaf-page-2/",
    "/docs/section-1/section-3/",
    "/docs/section-1/section-3/leaf-page-1/",
    "/docs/section-1/section-3/leaf-page-2/",
    "/posts/blog-post-4/",
    "/tags/blog/",
    "/tags/post/",
    "/tags/",
    "/posts/blog-post-3/",
    "/posts/blog-post-2/",
    "/posts/blog-post-1/",
    "/",
    "/docs/",
    "/posts/",
    "/book.min.02eb64d61d8649e468368658b592fa4f7cae15099705f7b085034a94c2b64d69.css",
  "/en.search-data.min.95bc68147c0068fcebb59cc30ff604496a2534b6252dc681ae9188f07f581ff6.json",
  "/en.search.min.bc92b2d9cf6443d85087c19c9bbd838571c5aa060f1f3edb104295a2272587d5.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
