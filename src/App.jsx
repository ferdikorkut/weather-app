import { useState } from 'react'
import './App.css'

import React from 'react'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY



const App = () => {

const [city, setCity] = useState('')
const [weather, setWeather] = useState(null)
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)

const searchWeather = async () => {
  if (city.trim() === '') {
    setError('Lütfen bir şehir giriniz')
    setWeather(null)
    return
  }

  setError(null)
  setLoading(true)

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=tr`
    )

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
    setLoading(false)
  }
}

  return (
    <>
    <h1>Hava Durumu</h1>
    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Şehir Giriniz" />
    <button onClick={searchWeather}>Göster</button>

    {loading && <p>Yükleniyor...</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}

    {weather && (
      <div>
        <h2>{weather.city}</h2>
        <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.description} />
        <p>{weather.temp}°C</p>
        <p>{weather.description}</p>
      </div>
    )}
    </>
  )
}

export default App