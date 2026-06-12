# Cara Kerja Sistem Rakit Website Japan Arena

## 1. Bayangin ini pabrik rakit, bukan toko stiker

Banyak orang ngira bikin website itu kayak nempel stiker: ambil desain jadi, tempel,
selesai. Sistem kita **bukan** kayak gitu.

Sistem kita lebih mirip **pabrik rakit mobil**.

Ada rangka, ada mesin, ada jok, ada cat. Semuanya potongan terpisah yang dirakit jadi
satu di lini produksi. Warna cat bisa diganti per pesanan. Joknya bisa kulit atau kain.
Tapi semua potongan itu harus **sesuai cetakan pabrik** — kalau kamu bawa pintu mobil
merek lain, ya gak bakal kepasang, sebagus apapun pintunya.

Website klien kita juga gitu. Dia dirakit dari potongan-potongan:

- **Bagian-bagian halaman** (hero, daftar produk, galeri, kontak, dll) — ini diisi dari
  database, bukan diketik manual di desain.
- **Tema** — gaya visualnya (warna, font, rasa).
- **Warna brand klien** — ditimpa di atas tema, jadi tiap klien beda nuansa walau
  temanya sama.

Jadi waktu kita "rakit website", kita bukan lagi gambar dari nol, dan bukan juga nempel
file jadi. Kita **memilih cetakan yang pas, terus mesinnya yang merakit isinya.**

Pegang analogi ini. Sisanya bakal gampang nyambung.

---

## 2. Perjalanan satu website — dari klien klik order sampai tayang

Biar kebayang utuh, ini urutannya:

**Langkah 1 — Klien isi form order.**
Di sini klien milih paket, ngisi *briefing* (cerita soal bisnisnya), dan bayar DP.

> ⚠️ Salah paham paling sering: **form order itu bukan tempat naruh konten final.**
> Form itu cuma "briefing + bayar". Klien gak nempelin foto produk lengkap atau nulis
> semua teks di situ. Itu dikumpulin belakangan.

**Langkah 2 — Sistem nyiapin "lahan kosong".**
Begitu order masuk, sistem otomatis bikin tempat buat website klien itu — masih kosong,
tapi udah ada alamatnya. Ini namanya *provisioning*. Dipicu dari nomor order.

**Langkah 3 — Konten diisi SETELAH DP.**
Nah ini pentingnya. Konten asli (teks, foto, daftar menu/produk) baru dikumpulin
setelah klien bayar DP. Kita ambil dari briefing tadi, dan kalau klien belum punya
materi lengkap, kita **draftkan dulu** konten contoh yang masuk akal buat industrinya —
baru klien revisi. Jadi website gak nunggu klien selesai nulis semua dulu.

**Langkah 4 — Dirakit & dirender.**
Tema dipilih, konten dimasukin ke potongan-potongan halaman, warna brand klien ditimpa.
Mesin rakit yang nyusun jadi satu halaman utuh.

**Langkah 5 — Tayang (publish).**
Website live, klien bisa lihat hasilnya.

Intinya: **bentuk dulu (tema + struktur), isi belakangan (konten).** Ini kenapa template
buat kita itu soal *kerangka & gaya*, bukan soal "tulisan dan foto yang udah jadi".

---

## 3. Cara tema kita disusun: Industri → Sub-kategori → Gaya

Ini bagian yang wajib kamu hafal, karena ke sinilah template kamu harus "nyangkut".

Tema kita disusun bertingkat, tiga lapis:

```
Industri          →   Sub-kategori        →   Tema (3 gaya)
(Toko Online)         (Kuliner)               Rustic Hangat
                                              Modern Appetite
                                              Heritage Kuliner
```

Contoh nyata yang **udah jalan sekarang**:

**Toko Online → Kuliner** (buat pempek, kue, frozen food, kopi, snack)
- 🔥 **Rustic Hangat** — warung homemade, hangat & menggugah
- 🥤 **Modern Appetite** — brand F&B kekinian, bersih & cerah
- 👑 **Heritage Kuliner** — premium/tradisional, elegan & berkelas

**Toko Online → Fashion** (baju, hijab, sepatu, tas)
- 📷 **Editorial** — gelap, dramatis, serasa majalah mode
- 🌬️ **Minimalis** — bersih & lapang, banyak ruang kosong
- ⚡ **Vibrant** — berani & ceria, penuh warna

Kenapa **3 gaya per sub-kategori**? Karena dalam satu jenis bisnis pun, seleranya beda.
Pempek mbok-mbok rumahan beda rasa sama brand kopi anak muda — padahal dua-duanya
"kuliner". Tiga gaya itu nutupin spektrum dari hangat-tradisional sampai modern-berani.

**Yang belum siap, kita sembunyiin.**
Sub-kategori kayak Kerajinan/Heritage, Skincare, Gadget, dll **sudah ada di daftar tapi
belum aktif** — karena 3 gayanya belum lengkap. Selama belum lengkap, klien gak bisa
milih itu. Ini disengaja: kita gak mau klien milih sesuatu yang belum bisa kita kasih
dengan bagus.

> Jadi kalau kamu nemu template kerajinan/batik yang keren — itu **justru lagi kita
> butuhin**, karena Kerajinan baru mau dibuka. Tapi lihat dulu syaratnya di bagian 5.

---

## 4. Kenapa ada beberapa "jalur" — dan kenapa kamu perlu tau

Sistem punya beberapa cara merender website, tergantung temanya. Kamu gak perlu hafal
teknisnya, cukup tau **bahwa setiap tema itu hasil kerja terstruktur**, bukan sekadar
gambar:

- **Tema komposabel** — disusun dari "resep" (manifest) + potongan yang bisa dipakai
  ulang. Ini arah baru kita, paling fleksibel.
- **Tema bespoke** — dijahit khusus per industri (klinik, perusahaan, sekolah, resto,
  rental, toko batik). Kerja tangan, detail.
- **Tema token-driven** — kerangkanya sama, tinggal ganti "paket warna & rasa".
- **Tampilan generik** — jaring pengaman terakhir kalau gak ada tema khusus.

Poin yang aku mau kamu bawa pulang dari sini cuma satu:

> Apapun jalurnya, sebuah desain harus **"diterjemahkan" dulu** ke dalam salah satu
> bentuk ini. Gak ada jalur "tempel HTML/Figma mentah langsung jadi". Itu sebabnya
> template = bahan mentah, bukan barang jadi.

---

## 5. ⭐ Inti dari dokumen ini: kenapa gak semua template bisa dipakai

Oke, ini bagian yang paling penting. Baca pelan-pelan.

Sebuah template — sebagus apapun — baru bisa masuk sistem kita kalau lolos **empat
syarat**. Kalau salah satunya gak kepenuhan, dia gak bisa langsung dipakai (belum tentu
ditolak selamanya, tapi harus dikerjain dulu).

### Syarat 1 — Harus ada "rumahnya" di taksonomi

Template harus jelas masuk ke **industri + sub-kategori** mana. Template "toko skincare
estetik" gak bisa dipakai buat klien rental mobil, walau cantik. Kalau sub-kategorinya
belum ada di sistem (lihat bagian 3), berarti kita perlu **buka sub-kategori baru dulu**
— itu pekerjaan tersendiri, bukan tempel-tempel.

### Syarat 2 — Kontennya harus bisa "dilepas"

Ingat: konten kita datang dari database, diisi belakangan. Jadi template yang teks dan
fotonya **nempel mati di desain** ("hardcoded") itu masalah. Yang kita butuh adalah
*kerangka* yang bisa diisi konten apapun: hero-nya bisa ganti judul, daftar produknya
bisa nambah/kurang, dst.

Analogi: kita butuh **rak kosong yang rapi**, bukan rak yang barangnya udah dilem.

### Syarat 3 — Warnanya harus bisa ditimpa

Tiap klien punya warna brand sendiri. Sistem kita nimpa warna tema pakai warna klien.
Template yang warnanya "ngotot" dan susah diganti bikin semua klien keliatan kembar.
Desain yang baik buat kita itu yang **gayanya kuat tapi warnanya nurut**.

### Syarat 4 — Wajib lolos "gerbang 3 pemeriksaan"

Ini aturan baku, gak bisa dilewatin. Sebelum sebuah tema diaktifkan buat klien, dia
harus lewat tiga pengecekan:

1. **Tampilan** — apakah secara visual beneran bagus & layak jual? (`/ui-design`)
2. **Rasa** — apakah kerasa hidup, gak kaku, enak dipakai? (`/make-interfaces-feel-better`)
3. **Pesan** — apakah teks & strukturnya meyakinkan, ngejual, gak asal? (`/website-review`)

Cuma setelah lolos ketiganya, tema baru di-"hidupin" dan boleh dipilih klien.

> Ini kenapa kita gak buru-buru. Lebih baik 3 tema yang matang daripada 10 yang
> setengah jadi. Kualitas yang kita jual, bukan jumlah.

---

## 6. Jadi gimana caranya template kamu kepakai?

Waktu kamu nemu desain bagus, sampaikan:

- **Ini buat industri + jenis bisnis apa?** (mis. "Toko Online → Kerajinan/Batik")
- **Apa yang bikin kamu suka?** Gayanya? Warnanya? Tata letaknya? (sebut spesifik)
- **Link/screenshot referensinya** — biar aku lihat langsung.
- **Kira-kira ini "gaya" yang mana?** Hangat-tradisional? Modern-bersih? Berani-ramai?
  (nyambung ke konsep 3 gaya di bagian 3)

Dari situ aku terjemahin jadi tema beneran, lewatin gerbang 3 pemeriksaan, baru
diaktifin. **Template kamu jadi bahan baku premium — bukan barang yang ditolak, tapi
barang yang masih perlu dirakit.**

Yang **bukan** cara pakai:
- ❌ "Ini ada file HTML/Figma jadi, langsung pasang ya buat klien besok." → gak bisa,
  harus diterjemahkan dulu.
- ❌ Maksa pakai template sub-kategori yang belum kebuka.
- ❌ Pakai template yang teks & fotonya nempel mati, anggap udah selesai.

---

## 7. Kamus singkat istilah yang sering muncul

| Istilah | Artinya pakai bahasa manusia |
|---|---|
| **Briefing** | Cerita klien soal bisnisnya, diisi di form order. Bahan buat kita bikin konten. |
| **Provisioning** | Sistem nyiapin "lahan kosong" + alamat website klien begitu order masuk. |
| **Section / bagian** | Potongan halaman: hero, daftar produk, galeri, kontak, dll. |
| **Tema** | Gaya visual website (warna, font, rasa). Tiap sub-kategori punya 3 gaya. |
| **Variant** | Pilihan gaya spesifik yang dipilih klien (mis. "Rustic Hangat"). |
| **Token / paket warna** | Setelan warna & rasa yang bisa ditimpa pakai warna brand klien. |
| **Manifest** | "Resep" yang nyusun tema komposabel dari potongan-potongan. |
| **Sub-kategori `ready`** | Sub-kategori yang 3 gayanya udah lengkap & boleh dipilih klien. |

---

## Penutup

Kalau cuma satu kalimat yang kamu inget dari dokumen ini, ini dia:

> **Template itu bahan mentah, bukan barang jadi. Tugas kita merakitnya jadi tema yang
> lolos gerbang kualitas — dan dia cuma bisa dirakit kalau bentuknya sesuai cetakan
> pabrik.**

Ada yang masih ganjel atau ada istilah yang kelewat? Bilang aja, nanti dokumennya
kita perbaiki bareng.
