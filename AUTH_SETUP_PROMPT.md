# JWT Auth Altyapi Promptu (Angular)

Bu dosyayi, ileride Copilot'a veya baska bir asistana verecegin hazir prompt olarak kullanabilirsin.

## Uzun ve Net Prompt (Onerilen)

Bu Angular projesinde uretim yaklasimiyla kimlik dogrulama altyapisi kurmani istiyorum. Hedefim kok bir proje oldugu icin olceklenebilir, guvenli ve surdurulebilir bir yapi istiyorum.

Isteklerim:
1. JWT tabanli auth yapisi kur.
2. AuthService olustur:
- login, logout, isAuthenticated, getToken, getCurrentUser
- token ve kullanici bilgisini guvenli sekilde yonet.
3. Route guard ekle:
- english-learning ve alt route'lar korunmali
- giris yoksa ana sayfaya yonlendir.
4. HTTP interceptor ekle:
- isteklerde Authorization: Bearer token header'i gonder.
- 401 durumunda logout + yonlendirme yap.
5. Mevcut login akisina bu yapayi bagla.
6. Logout tum auth state'i temizlesin.
7. Kodda minimum ama gerekli aciklayici yorumlar olsun.
8. Mevcut tasarimi bozma, sadece auth davranisini guclendir.
9. Degisikliklerden sonra derleme hatalarini kontrol et ve duzelt.
10. En sonda:
- hangi dosyalari neden degistirdigini
- guvenlik notlarini
- sonraki adimda refresh token icin ne yapilacagini ozetle.

Kabul kriterleri:
1. URL ile protected sayfaya direkt girilemesin.
2. Giristen sonra protected sayfalar acilsin.
3. Cikis sonrasi protected sayfalar tekrar kapansin.
4. Token header'i API cagrilarinda otomatik gitsin.
5. 401 alinca oturum temizlensin ve kullanici yonlendirilsin.

## Kisa Prompt (Hizli Kullanim)

Bu projede production-ready JWT auth altyapisi kur: AuthService + AuthGuard + HTTP Interceptor + protected routes + login/logout entegrasyonu. UI'i bozma, route ve API guvenligini guclendir, 401 yonetimini ekle, derleme hatalarini gider, sonunda degisiklik ozeti ve sonraki refresh token adimlarini ver.

## Backend Ekibi Icin Opsiyonel Ek Not

Istersen backend ekibi icin ayri bir API sozlesmesi promptu da olusturabiliriz (login, refresh token, revoke, role claims, hata kodlari, expiration stratejisi).
