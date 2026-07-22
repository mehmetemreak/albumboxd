# Albumboxd

Günlük albüm dinleme ritüeli için kişisel log + veri sitesi. Tek dosyalık statik HTML —
build step yok, framework yok, dependency yok, sunucu yok. Yorum katmanı (dönem/soy hattı/
anatomi/söz dünyası/trivia + zincir önerileri) bilinçli olarak sitede değil, Claude
sohbetinde yaşar; site veriyi tutar, sohbet yorumlar.

## Ne yapar

**Debrief (günlük kayıt):**
- Gün sayacı otomatik; puan (0-5), valence/arousal slider'ları + canlı dörtlü duygu haritası
- Opsiyonel eksenler: üretkenlik, anksiyete, depresif hissiyat (0-10), niyetlilik
  (kendi seçim / zincir / wildcard)
- Künye MusicBrainz'den otomatik: prodüktör, label, ilk yayın, tür etiketleri, tracklist
- Albüm kapakları Cover Art Archive'dan (otomatik, key'siz)
- Tracklist'te şarkı başına ★ (masterpiece) ve ♥ (wow) işaretleri — varsayılan katlanmış
- Wikipedia: giriş özeti + "merak filtreli" highlight'lar (aşağıda)
- Genius: şarkı bazlı topluluk açıklamaları, en yüksek oylular (Worker proxy ile)
- Zincir Malzemesi: aynı label'dan dönem komşusu albümler
- Claude Analizi alanı: sohbette üretilen analizi yapıştır, kayıtla arşivlensin
- Kayıt başına serbest etiketler

**Wildcard (sürpriz zincir kırma):**
Her N±2 günde bir (N ayarlanabilir, varsayılan 7) gizlice belirlenen bir gün wildcard'dır —
önceden görünmez, o günü logladığında damga kırmızı çıkar. Amaç: scene-cluster'a
sıkışmayı öngörülemez aralıklarla kırmak.

**Merak Filtresi (Wikipedia highlight'ları):**
Makalenin tamamı çekilir, cümleler kategorili anahtar kelimelerle skorlanır:
drama ×3, söz/anlam ×3, prodüksiyon ×2, soy hattı ×2, genel ×1 — bölüm ağırlığıyla çarpılır
(Lyrics/Themes öncelikli). Negatif liste (chart/sertifika gürültüsü) cümleyi tamamen eler.
Kelime setleri, highlight sayısı (5-15) ve taranacak bölümler Ayarlar'dan değiştirilebilir.

**Geriye Bak:**
- Zincir Görünümü: ardışık günler arası ortak prodüktör/label bağları otomatik etiketli
- Seçilmiş Şarkılar: tüm ★/♥ havuzu (playlist hammaddesi)
- Log tablosu + Pearson korelasyonları: valence/arousal/üretkenlik/anksiyete/depresyon ↔ puan
- Tür bazında valence/arousal/puan ortalamaları; niyetlilik ↔ puan kırılımı
- Arşivde arama (albüm/sanatçı/tür/etiket), sıralama, "Rastgele" gün butonu

**Veri güvenliği:**
- Arşiv tarayıcının localStorage'ında; Export/Import ile JSON yedek
- Her 7 kayıtta bir otomatik export; son yedekten 7+ gün geçince sidebar uyarısı
- DİKKAT: Export JSON'u sağlık skorlarını da içerir — public repoya yüklerken bunu bil

**Ayarlar:**
Koyu/açık tema, 6 vurgu rengi, yoğunluk, font ölçeği, kapak boyutu/gizleme,
başlangıç sekmesi, wildcard aralığı, highlight sayısı, Wikipedia bölüm seçimi,
merak filtresi kelime setleri, Genius proxy URL.

## Kurulum

### Site (GitHub Pages, ~3 dk)
1. Repo aç (public en kolayı; Pages private'ta ücretli planda çalışır).
2. `index.html` + `README.md` + `worker.js`'i yükle (web arayüzünden "Add file → Upload files").
3. Settings → Pages → Source: `Deploy from a branch` → `main` / `(root)` → Save.
4. 1-2 dk sonra: `https://<kullanıcı-adın>.github.io/<repo-adı>/`

### Genius proxy (opsiyonel, ~10 dk)
Genius API tarayıcıya CORS vermez; araya ücretsiz bir Cloudflare Worker girer.
1. genius.com/api-clients → New API Client → **Client Access Token**'ı kopyala.
   (App website URL zorunlu; canlı site adresini ya da GitHub profil linkini yaz.)
2. dash.cloudflare.com → Workers & Pages → Create → **"Start with Hello World!"** →
   editördeki örneği sil, `worker.js` içeriğini yapıştır → Deploy.
3. Worker → Settings → Variables → **Secrets** → `GENIUS_TOKEN` = token → tekrar Deploy.
4. Worker URL'ini sitede Ayarlar → Genius Proxy alanına gir.

Ne çeker: şarkı başına topluluk açıklamaları (sözlerin *yorumu*), sanatçı doğrulamalı,
★/♥ işaretli şarkılar öncelikli. Ne çekmez: sözlerin kendisi — API zaten vermez.

## Mimari notlar

- **LLM yok = halüsinasyon yok.** Künye MusicBrainz, bağlam Wikipedia, açıklamalar Genius —
  hepsi kaynak linkli. Yorum işi Claude sohbetinde yapılır, "Claude Analizi" alanına yapıştırılır.
- **MusicBrainz rate limit:** 1 istek/sn; kod ~1.1 sn arayla sıralar, bir kayıt ~3-4 sn sürer.
- **Highlight filtresi kelime eşleştirmedir, anlam değil** — ~%70 ön eleme; kaçanlar için
  makale linki ve sohbet var.
