self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

async function liss_answer(e) {

    const answer = await fetch(e.request);

    return answer.status !== 404
                ? answer
                : new Response("", {
                    status: 200,
                    statusText: "Accepted",
                    headers: new Headers({
                        "Status"    : answer.status,
                        "StatusText": answer.statusText
                    })
                });
}

self.addEventListener('fetch', (e) => {

    const isLissAuto = e.request.headers.has('liss-auto');

    if( ! isLissAuto )
        return;

    return e.respondWith( liss_answer(e) )

});