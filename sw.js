/* Service worker della versione tablet: rende l'organo utilizzabile senza internet.
   File generato da build.py (modello in src/tablet/sw.js): non modificarlo in «per GitHub».
   Ogni nuova generazione cambia CACHE, quindi il browser installa il nuovo service worker;
   il nuovo resta in attesa finché l'utente non tocca «Aggiorna» (messaggio 'aggiorna'). */
'use strict';
const CACHE = 'organo-2026.11.12-6-ffe83431';
const FILE = ["./", "index.html", "manifest.webmanifest", "icona-192.png", "icona-512.png"];

self.addEventListener('install', e => {
  // cache:'reload' = scarica dal server, non dalla cache HTTP (altrimenti potrebbe salvare la versione vecchia)
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILE.map(f => new Request(f, {cache: 'reload'})))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(nomi => Promise.all(nomi.filter(n => n.startsWith('organo-') && n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (e.data === 'aggiorna') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // prima la copia salvata (funziona offline); la pagina aperta come «./» corrisponde a index.html
  e.respondWith(caches.open(CACHE).then(c =>
    c.match(r, {ignoreSearch: true})
      .then(t => t || (r.mode === 'navigate' ? c.match('index.html') : undefined))
      .then(t => t || fetch(r))));
});
