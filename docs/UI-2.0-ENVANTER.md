# Cozy Nature 2.0 — kontrol envanteri

Değişiklik öncesi HTML'deki bütün kimlikli kontroller:

- `search` — input
- `select` — button
- `terrain` — button
- `terrainAction` — select
- `terrainSize` — input
- `terrainPower` — input
- `terrainPaint` — select
- `terrainAuto` — button
- `cinemaToggle` — button
- `cinemaAdd` — button
- `cinemaDuration` — input
- `cinemaPlay` — button
- `cinemaRecord` — button
- `cinemaStop` — button
- `cinemaClear` — button
- `lightToggle` — button
- `lightHour` — input
- `lightPower` — input
- `lightFog` — input
- `lightReset` — button
- `water` — button
- `waterAction` — select
- `waterSize` — input
- `waterSpeed` — input
- `brush` — button
- `brushAction` — select
- `brushSize` — input
- `brushDensity` — input
- `brushRandom` — input
- `rotate` — button
- `grow` — button
- `shrink` — button
- `duplicate` — button
- `undo` — button
- `remove` — button
- `capture` — button
- `save` — button
- `autosaveRestore` — button
- `autosaveDelete` — button
- `load` — button
- `file` — input

Dinamik kontroller: 7 kategori düğmesi, 68 model düğmesi. Kısayollar: Escape, R, Delete/Backspace, Ctrl/Cmd+A/C/V/X/D/Z. Sol sürükleme, sağ kaydırma, tekerlek yakınlaşma, Shift ile çoklu seçim.

## Yeni yerleşim

- Ana çubuk: proje/kurtarma menüsü, kaydet, yükle, geri al, ileri al ve PNG.
- Sol araçlar: seç/taşı, arazi, ayrı yüzey boyama girişi, su, doğa fırçası, ışık ve sinematik kamera.
- Sol kütüphane: arama, satırlara yayılan kategoriler, önizleme kartları; bağımsız kapatma.
- Sağ özellikler: tek etkin araç veya seçili nesne işlemleri.
- Ortada: gerçek boyutuyla yeniden ölçülen 3D viewport.
- Mobil: iki satırlı araç menüsü; kütüphane ve özellikler tek seferde bir çekmece açar.

Bütün eski kontrol kimlikleri korundu; mevcut işlem fonksiyonlarına bağlandı. Yeni ileri alma yalnızca editör geçmişini tamamlar; kayıt biçimi ve altyapı değişmez.

## İşlev ve panel eşlemesi

| Eski grup | Korunan işlevler | 2.0 erişimi |
| --- | --- | --- |
| Proje | JSON indirme, dosya seçme/yükleme, kurtarma kaydı bilgisi, kurtarma ve silme | Üst çubuk + Proje menüsü |
| Seçim | Tek/çoklu seçim, sürükleme, 22,5° döndürme, ×1,15 ve ÷1,15 ölçek, kopyalama, silme | Seç aracı + nesne özellikleri |
| Geçmiş | Geri alma, Ctrl/Cmd+Z | Üst çubuk; ileri alma ve Ctrl/Cmd+Shift+Z eklendi |
| Arazi | Yükselt, alçalt, yumuşat; çap 2–35 ve güç 1–10 | Arazi aracı |
| Yüzey | Çimen, kaya, toprak, kum, kar, çamur; fırça çapı/gücü ve otomatik kaplama | Boya aracı; ortak arazi kontrolleri korunur |
| Su | Nehir, göl, su silgisi; genişlik/çap 2–35, hız 0–10; nehir yatağı | Su aracı |
| Doğa | Boya/silgi, model seçimi, nesne sayısı, çap 1–20, yoğunluk 1–15, rastgele döndürme | Fırça aracı + kütüphane |
| Atmosfer | Saat 5–21, güç %20–180, sis %0–100, varsayılan ışık | Işık aracı |
| Sinematik | Nokta ekle, nokta sayısı, süre 1–15 sn, oynat, WebM kaydet, durdur, temizle | Kamera aracı |
| Görüntü | PNG indirme | Üst çubuk |
| Asset | Arama, 7 kategori, 68 modelin görsel önizlemesi ve seçimi | Kapanır kütüphane |

## Doğrulama

Gerçek tarayıcıda 1280×720 ve 1024×768 masaüstü, 390×844 ve 320×700 mobil, 740×390 yatay mobil yerleşimleri kontrol edildi. Ölçülen dar ekranlarda belge genişliği ekran genişliğine eşit; yatay taşma yok. Masaüstü panel kapatmada viewport genişliği 660 → 924 → 1204 px olarak büyüdü.

Araç/panel geçişleri, arama ve önizlemeler, yerleştirme, nesne özellikleri, sürükleyerek taşıma, döndürme/ölçek/kopyalama/silme, geri/ileri alma, doğa fırçası, göl, ışık ayarı ve kamera noktaları/oynatma denendi. Temiz test sekmesinde konsol error/warn listesi boştu. Yeni arayüzde dosyadan yükleme ve WebM indirmesi bu turda uçtan uca doğrulanmadı. Proje kurtarma onay penceresi tarayıcı otomasyon oturumunu kilitledi; bu deneme başarılı sayılmadı. Kayıt işlem fonksiyonları değiştirilmedi.

`node tests/editor-history.cjs`: dönüşüm, silme, yeni işlemde ileri alma geçmişinin temizlenmesi, arazi boyası ve nehir geri/ileri alma testleri geçti. `node tests/startup-and-recovery.cjs` ve `git diff --check` geçti.

Ekran görüntüleri: `ui-2-desktop.jpg`, `ui-2-mobile.jpg`. Değişiklikler yereldir; yayın yapılmadı.

Son çıktı kontrolünde PNG ve JSON indirme olayları yeni üst çubuktan doğrulandı. Yüzey boya aracıyla kum uygulama ve ardından geri/ileri alma da gerçek tarayıcıda çalıştı.
