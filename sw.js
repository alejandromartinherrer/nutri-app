/* Menú de la semana — service worker.
   Strategy: network-first for navigations with cache fallback.
   - Online: always serve the freshest HTML and refresh the cached copy,
     so app updates reach users on the next online visit.
   - Offline: serve the last cached copy (true offline after first visit).
   No precache list: the app is a single HTML file (index.html), so we
   cache whatever navigation URLs are actually requested within scope.
   Cloud sync calls (api.github.com) are not navigations -> untouched.
   Bump CACHE on breaking changes to drop stale entries. */
"use strict";

const CACHE = "menu-semana-v1";

self.addEventListener("install", e => {
	self.skipWaiting();
});

self.addEventListener("activate", e => {
	e.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(
			keys.filter(k => k !== CACHE).map(k => caches.delete(k))
		);
		await self.clients.claim();
	})());
});

self.addEventListener("fetch", e => {
	const req = e.request;
	if (req.method !== "GET") return;
	// Only handle page navigations; the app has no other same-origin
	// assets (icons/manifest are inlined as data: URLs).
	if (req.mode !== "navigate") return;
	e.respondWith((async () => {
		const cache = await caches.open(CACHE);
		try {
			const fresh = await fetch(req);
			if (fresh && fresh.ok) cache.put(req, fresh.clone());
			return fresh;
		} catch (err) {
			const hit = await cache.match(req, {ignoreSearch: true});
			if (hit) return hit;
			throw err;
		}
	})());
});
