/**
 * Offline support (GDD section 6): cache the app shell, assets and prerendered pages on
 * install, so pass-and-play works with no connection once the app has been opened once.
 */
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';
import { self } from '$app/service-worker';

const CACHE = `sttt-${version}`;
const scope = self.registration.scope;
const url = (path: string) => new URL(path, scope).href;

const PRECACHE = [
	...immutable.map((f) => url(f.path)),
	...assets.map((f) => url(f.path)),
	...prerendered.map((p) => url(p.path))
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			// ignoreVary: hosts often send `Vary: Origin`, and module scripts carry an Origin
			// header the precache requests did not, which would otherwise miss the cache.
			const cached = await cache.match(request, {
				ignoreVary: true,
				ignoreSearch: request.mode === 'navigate'
			});
			if (cached && request.mode !== 'navigate') return cached;
			try {
				// Pages: network first, so a new version is picked up when online.
				const response = await fetch(request);
				if (response.ok && request.mode === 'navigate') void cache.put(request, response.clone());
				return response;
			} catch {
				return cached ?? (await cache.match(url(''), { ignoreVary: true })) ?? Response.error();
			}
		})()
	);
});
