# Album Ritueli — v2

Tek dosyalık statik site. Build step yok, framework yok, dependency yok.

**Sistem bileşenleri:**
- **Debrief logu:** Gün sayacı otomatik. Puan + enerji + mood + not → her gün tek kayıt.
- **Wildcard-7:** Her 7. gün rozet kırmızıya döner, zincir kırma günü hatırlatılır.
- **Künye (kesin veri):** MusicBrainz — prodüktör, label, tarih, tür. Kaynak linkli.
- **Zincir Malzemesi:** Aynı label'dan dönem komşusu albümler otomatik listelenir.
- **Merak Katmanı (opsiyonel LLM):** Dönem/soy hattı/anatomi/söz dünyası/trivia —
  kendi Anthropic API key'inle, künye verisi modele "kesin veri" olarak beslenir
  (halüsinasyon alanı daraltılmış). Sözler birebir basılmaz; çözümlenir.
- **Sorgu Hattı:** Albüm başına serbest soru-cevap, geçmişi kayıtlı.
- **Geriye Bak:** Enerji↔tür ve tür↔puan korelasyon tabloları (logdan hesaplanır).
- **Export/Import:** localStorage silinirse diye JSON yedek.

Arşiv tarayıcının `localStorage`'ında tutulur — kalıcıdır, token/kota derdi yoktur.
API key sadece sessionStorage'da yaşar; sekme kapanınca silinir.

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
