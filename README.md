# Album Ritueli — v3 (final)

Tek dosyalık statik site. Build step yok, framework yok, dependency yok.

**Sistem bileşenleri:**
- **Debrief logu:** Gün sayacı otomatik. Puan + enerji + mood + not → her gün tek kayıt.
- **Wildcard-7:** Her 7. gün rozet kırmızıya döner, zincir kırma günü hatırlatılır.
- **Künye (kesin veri):** MusicBrainz — prodüktör, label, tarih, tür. Kaynak linkli.
- **Zincir Malzemesi:** Aynı label'dan dönem komşusu albümler otomatik listelenir.
- **Geriye Bak:** Enerji↔tür ve tür↔puan korelasyon tabloları (logdan hesaplanır).
- **Export/Import:** localStorage silinirse diye JSON yedek.

Arşiv tarayıcının `localStorage`'ında tutulur — kalıcıdır, token/kota derdi yoktur.
Sitede LLM ve API key YOKTUR — yorum katmani (donem/soy hatti/anatomi/soz dunyasi/trivia + soru-cevap) Claude sohbetinde yapilir, cikti "Claude Analizi" alanina yapistirilarak arsivlenir. Bu sayede site sifir maliyetli ve kota-bagimsizdir.

## Deploy (GitHub Pages, ~3 dakika)

1. GitHub'da yeni repo aç (ör. `album-dossier`), public ya da private fark etmez
   (Pages private repoda ücretli planda çalışır; public en kolayı).
2. `index.html` ve bu `README.md`'yi repoya yükle (web arayüzünden "Add file → Upload files" yeterli, git bilmene gerek yok).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save.
4. 1-2 dakika sonra site `https://<kullanici-adin>.github.io/album-dossier/` adresinde yayında.

## Mimari notlar

- **Neden sözler yok:** Şarkı sözleri lisanslı içerik; Genius dahil hiçbir API sözlerin
  kendisini vermez. Bu site sözün *yanında* açık duran çözümleme/künye paneli olarak tasarlandı.
- **Neden Genius yok (şimdilik):** Genius API tarayıcıya CORS header'ı göndermiyor;
  statik siteden direkt çağrılamaz. v2'de ücretsiz bir Cloudflare Worker proxy ile
  annotation'lar (topluluk söz çözümlemeleri) eklenebilir.
- **MusicBrainz rate limit:** 1 istek/saniye. Kod istekleri ~1.1 sn arayla sıralıyor;
  bir dossier ~3-4 saniye sürer. Normal.
- **Halüsinasyon durumu:** Sıfır — çünkü bu sitede LLM yok. Künye MusicBrainz'den,
  özet Wikipedia'dan geliyor, ikisi de linkli. Yorum katmanı bilinçli olarak boş bırakıldı;
  o iş ya Claude sohbetinde ya da v2'de kendi API key'inle yapılır.

## v2 yol haritası (istersen)

- [ ] Cloudflare Worker proxy → Genius annotations
- [ ] "Zincir görünümü": aynı prodüktör/label ile bağlantılı albümleri MusicBrainz
      relations üzerinden otomatik listeleme
- [ ] Arşivi JSON export/import (localStorage silinirse diye yedek)
- [ ] Opsiyonel LLM yorum katmanı (kendi Anthropic API key'in, localStorage'da tutulmaz —
      her oturumda elle girilir)

## Genius Proxy kurulumu (opsiyonel — B özelliği)

Genius API tarayıcıya CORS vermediği için araya ücretsiz bir Cloudflare Worker girer.
İki hesabı da **kendin** açacaksın (5'er dakika, ikisi de ücretsiz):

1. **Genius token:** genius.com/api-clients → "New API Client" → App name/URL'e herhangi
   bir şey yaz → oluştur → **"Client Access Token"**ı kopyala.
2. **Cloudflare Worker:** dash.cloudflare.com → Workers & Pages → Create Worker →
   editöre bu repodaki `worker.js` içeriğini yapıştır → Deploy.
3. Worker'ın **Settings → Variables → Secrets** kısmına `GENIUS_TOKEN` adıyla
   1. adımdaki token'ı ekle → tekrar Deploy.
4. Worker URL'ini (https://....workers.dev) sitedeki "Genius Proxy" alanına yapıştır → Kaydet.

**Ne çeker:** Şarkı başına topluluk annotation'ları (sözlerin *yorumu*).
**Ne çekmez:** Sözlerin kendisi — Genius API bunu zaten vermez, proxy de istemez.

## Wikipedia derin bölümler (A özelliği)

Künye çekilirken artık makalenin tamamı alınır ve Background / Recording /
Composition / Lyrics / Reception / Legacy bölümleri ayrı kartlar olarak gösterilir
(bölüm başına ~2400 karakter). Giriş paragrafıyla sınırlı değil.

## Prodüktör Zinciri (D özelliği)

Künyedeki ilk prodüktörün MusicBrainz'de kayıtlı diğer prodüksiyon işleri tek tuşla
listelenir — zincirleme önerinin en güçlü halkası ("aynı kulak, farklı grup").
Not: Eski kayıtlarda prodüktör MBID'siz saklandığı için buton çalışmaz; albümü
yeniden loglamak yeterli.

## Zincir Görünümü (C özelliği)

Geriye Bak sekmesinde günler arası bağlantı akışı: ardışık iki albüm ortak
prodüktör/label paylaşıyorsa bağ otomatik etiketlenir; wildcard günleri ⟂ ile
işaretlenir; veri bağlantısı yoksa "zincir sebebin sohbette" düşer.
