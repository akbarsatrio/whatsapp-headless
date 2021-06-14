# Whatsapp API menggunakan whatsapp-web.js - PROTOTYPE BETA

### Pre Requisite untuk menjalankan aplikasi
- Menginstall Node.js [yang dipakai saat ini versi: v15.12.0]
- Menginstall NPM
- Koneksi internet
- Nodemon (opsional)

### Langkah instalasi
- Ekstrak
- Masuk ke direktori projeknya
- Jalankan `npm install` untuk menginstall seluruh depedency yang diperlukan
- Jalankan `npm run start:dev`. Jika mengunaan nodemon, ketik `nodemon` pada temrinal
- Buka browser dan buka `http://localhost:8000`
- Note: Sesi whatsapp masih menggunakan whatsapp saya (digunakan untuk demo). Jika ingin menggunakan nomor whatsapp Anda, silahkan hapus file `selalusiap-sess.json` lalu scan qr ulang lewat browser

### Penggunaan API
Anda bisa mengirim pesan secara langsung melalui API ini, ada 2 endpoint yang dibuat yaitu:
- `/send-messages` : untuk mengirim satu pesan per orang
- `/send-bulk` : untuk mengirim pesan ke banyak orang

**Parameter**
- `messages` : Ini adalah isi pesan yang akan dikirim
- `number` : Ini adalah nomor penerima

#### Catatan
Untuk `number`, pastikan anda memasukan kode negara contohnya `6281513209xxx`dan tambahkan `@c.us` pada akhir nomor. Hasilnya akan seperti ini `6281513209xxx@c.us`
