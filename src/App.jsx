import { useState } from 'react'
import './App.css'

import React from 'react'

// API anahtarı .env dosyasından okunur (import.meta.env Vite'e özgü, process.env değil)
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {

// city: kullanıcının input'a yazdığı şehir adı
const [city, setCity] = useState('')
// weather: başarılı aramadan dönen hava durumu verisi (null = henüz arama yapılmadı)
const [weather, setWeather] = useState(null)
// error: boş input veya bulunamayan şehir durumunda gösterilecek hata mesajı
const [error, setError] = useState(null)
// loading: fetch devam ederken true, tamamlanınca false
const [loading, setLoading] = useState(false)

const searchWeather = async () => {
  // Boş input kontrolü: fetch başlamadan önce kullanıcıyı uyar
  if (city.trim() === '') {
    setError('Lütfen bir şehir giriniz')
    // Önceki başarılı aramadan kalan kartı temizle
    setWeather(null)
    return
  }

  setError(null)
  setLoading(true)

  // try/finally: ağ hatası veya istisna fırlatılsa bile setLoading(false)
  // ve setCity('') mutlaka çalışsın diye (if/else bu garantiyi veremez)
  try {
    // encodeURIComponent: boşluklu veya Türkçe karakterli şehir isimlerini
    // URL'e güvenli şekilde eklemek için (örn. "New York" → "New%20York")
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=tr`
    )

    // res.ok false ise API hata kodu döndü (örn. 404 = şehir bulunamadı)
    // Bu bir exception değil, HTTP yanıtı — bu yüzden if ile kontrol edilir
    if (!res.ok) {
      setError('Şehir bulunamadı')
      setWeather(null)
      return
    }

    const data = await res.json()
    setWeather({
      city: data.name,
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    })
  } finally {
    // Her durumda (başarı, hata, exception) loading'i kapat ve input'u temizle
    setLoading(false)
    setCity('')
  }
}

  return (
    <div className="App">
    <h1>Hava Durumu</h1>
    <div className="search-row">
      {/* onKeyDown: Enter'a basınca butona gerek kalmadan arama başlatır */}
      <input className="city-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchWeather()} placeholder="Şehir Giriniz" />
      <button className="search-btn" onClick={searchWeather}>Göster</button>
    </div>

    {loading && <p>Yükleniyor...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}

    {weather && (
      <div className="weather-result">
        <h2>{weather.city}</h2>
        <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
        <p className="temp">{weather.temp}°C</p>
        <p className="description">{weather.description}</p>
      </div>
    )}
    </div>
  )
}

export default App
