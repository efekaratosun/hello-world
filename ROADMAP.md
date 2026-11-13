# Günlük Uygulaması — Yol Haritası

> Çalışma adı: **Soru Günlüğü**
> Fikir: Telefonda tutulan dijital bir günlük. Uygulama doğru anlarda doğru soruları sorar; böylece aklına bir şey gelmeyen günlerde bile kullanıcı yazacak bir şey bulur.

---

## 1. Temel ilkeler

1. **Boş sayfa korkusunu yok et.** Kullanıcı uygulamayı açtığında hiçbir zaman boş bir ekranla karşılaşmaz; her zaman cevaplanabilecek bir soru vardır.
2. **Küçük adımlar.** Tek cümlelik bir cevap da geçerli bir günlük kaydıdır. Uzun yazmak isteyen devam eder.
3. **Mahremiyet önce gelir.** Günlük kişiseldir. Veriler varsayılan olarak cihazda kalır; buluta eşitleme isteğe bağlı ve şifreli olur.
4. **Doğru an, doğru soru.** Sabah, akşam, hafta sonu, uzun bir aradan sonra… Her bağlam için farklı soru tipleri.
5. **Suçluluk yok.** "3 gündür yazmadın!" gibi baskıcı mesajlar yerine nazik davetler.

---

## 2. Soru sistemi (uygulamanın kalbi)

### Soru kategorileri
| Kategori | Örnek |
|---|---|
| Gün özeti | "Bugünü üç kelimeyle anlatsan?" |
| Duygular | "Bugün seni en çok ne yordu?" |
| Şükran | "Bugün küçük de olsa iyi giden bir şey neydi?" |
| İnsanlar | "Bugün konuştuğun biri seni nasıl hissettirdi?" |
| Duyular | "Bugün duyduğun bir ses ya da tattığın bir tat?" |
| Gelecek | "Yarın kendine küçük bir söz versen ne olurdu?" |
| Geçmiş | "Bir yıl önce bugünlerde ne düşünüyordun?" |
| Derin | "Son zamanlarda fikrini değiştirdiğin bir konu var mı?" |

### Ne zaman, hangi soru?
- **Sabah:** niyet ve beklenti soruları
- **Akşam:** gün özeti, duygu ve şükran soruları
- **Hafta sonu:** haftaya dönüp bakma soruları
- **Uzun aradan sonra:** hafif, kolay sorular ("Son günlerde aklında kalan tek bir an?")
- **Kullanıcı soruyu beğenmezse:** "Başka soru" ile yenisi gelir
- **Takip soruları:** Kullanıcı kısa bir cevap verdiyse "Biraz daha anlatır mısın?" tarzında bir derinleştirme sorusu

### Evrim
- **Faz 1:** Uygulamaya gömülü, elle yazılmış soru bankası (~150+ soru) ve basit kurallar (saat, gün, kategori çeşitliliği, son sorulanlardan kaçınma).
- **Faz 3:** Yapay zekâ (Claude API) ile kişiselleştirilmiş sorular: önceki kayıtlara bakarak "Geçen hafta yeni işinden bahsetmiştin, ilk haftan nasıl geçti?" gibi takip soruları. Kullanıcı onayıyla ve açık bir mahremiyet açıklamasıyla.

---

## 3. Fazlar

### Faz 0 — Temel (şu an)
- [x] Fikir ve yol haritası
- [x] Teknoloji seçimi: önce web (React + Vite + TypeScript, PWA), son aşamada App Store / Play Store için paketleme (Capacitor)
- [x] Proje iskeleti (`app/`)

### Faz 1 — MVP: "Her gün bir soru"
Hedef: Tek başına kullanılabilir, çevrimdışı çalışan bir günlük.
- [x] Ana ekran: günün sorusu + "Başka soru" + serbest yazma
- [x] Kayıt oluşturma, düzenleme, silme
- [x] Kayıt listesi (tarihe göre gruplu)
- [x] Gömülü soru bankası (68 soru) + basit seçim algoritması (saate göre, tekrar etmeyen, uzun aradan sonra hafif sorular)
- [x] Kısa cevaplarda derinleştirme sorusu (basit sürüm)
- [ ] Soru bankasını 150+ soruya çıkarmak
- [x] Ruh hali seçimi (5 seviyeli emoji)
- [x] Yerel veri saklama (cihazda)
- [x] Telefona kurulabilir olma (PWA / mobil uygulama)

### Faz 2 — Alışkanlık ve hatırlatma
- [ ] Günlük hatırlatma bildirimi (kullanıcının seçtiği saatte), bildirimde günün sorusu
- [ ] Takvim görünümü ve yazma serisi (nazik dille)
- [ ] "Geçmişte bugün" kartları
- [ ] Haftalık değerlendirme akışı (Pazar akşamı 3–4 soruluk mini oturum)
- [ ] Arama ve etiketler
- [ ] Fotoğraf ekleme
- [ ] Uygulama kilidi (PIN / biyometrik)

### Faz 3 — Akıllı sorular
- [ ] Önceki kayıtlara dayalı kişiselleştirilmiş takip soruları (Claude API)
- [ ] Kısa cevaplara derinleştirme soruları
- [ ] Ruh hali eğilimleri ve aylık özet ("Bu ay en çok bahsettiğin konular…")
- [ ] Sesli giriş (konuşarak yazma)

### Faz 4 — Senkronizasyon ve yayın
- [ ] Hesap sistemi ve uçtan uca şifreli bulut yedekleme
- [ ] Birden fazla cihaz desteği
- [ ] Dışa aktarma (PDF / Markdown)
- [ ] App Store / Play Store yayını

---

## 4. Veri modeli (taslak)

```ts
Entry {
  id: string
  createdAt: string        // ISO tarih
  updatedAt: string
  promptId?: string        // hangi soruya cevap olarak yazıldı
  promptText?: string      // soru metni (soru bankası değişse de korunur)
  body: string
  mood?: 1 | 2 | 3 | 4 | 5
  tags: string[]
}

Prompt {
  id: string
  text: string
  category: 'ozet' | 'duygu' | 'sukran' | 'insanlar' | 'duyular' | 'gelecek' | 'gecmis' | 'derin'
  timeOfDay?: 'sabah' | 'aksam' | 'herhangi'
  depth: 1 | 2 | 3         // 1 = hafif, 3 = derin
}
```

---

## 5. Başarı ölçütleri
- Kullanıcıların %X'i ilk haftada en az 3 kayıt yazıyor
- "Başka soru" basma oranı (soruların ne kadar işe yaradığını gösterir)
- Soru ile başlayan kayıtların oranı / serbest kayıtların oranı
- 30 günlük elde tutma
