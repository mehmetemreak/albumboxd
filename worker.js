// Genius API proxy — Cloudflare Worker
// Kurulum: README.md'deki "Genius Proxy" bölümüne bak.
// Sadece iki endpoint acar: /search ve /referents (annotation'lar).
// Sözlerin kendisini çekmez — annotation = topluluğun yorumu, lisans derdi yok.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    const token = env.GENIUS_TOKEN;
    if (!token) return new Response('{"error":"GENIUS_TOKEN secret tanimlanmamis"}', { status: 500, headers: cors });

    const g = (path) =>
      fetch("https://api.genius.com" + path, { headers: { Authorization: "Bearer " + token } });

    if (url.pathname === "/search") {
      const q = url.searchParams.get("q") || "";
      const r = await g("/search?q=" + encodeURIComponent(q));
      return new Response(await r.text(), { headers: cors });
    }

    if (url.pathname === "/referents") {
      const id = url.searchParams.get("song_id") || "";
      const r = await g("/referents?song_id=" + encodeURIComponent(id) + "&text_format=plain&per_page=10");
      return new Response(await r.text(), { headers: cors });
    }

    return new Response('{"ok":true,"endpoints":["/search?q=","/referents?song_id="]}', { headers: cors });
  },
};
