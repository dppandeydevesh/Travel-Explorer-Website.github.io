let slideIndex = 0;
const slides = document.querySelectorAll(".slideshow .slide");
let slideInterval;

function showSlides() {
  slides.forEach(slide => slide.classList.remove("active"));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}

function startSlideshow() {
  slideInterval = setInterval(showSlides, 4000);
}

function stopSlideshow() {
  clearInterval(slideInterval);
}

showSlides();
startSlideshow();

const slideshow = document.querySelector(".slideshow");
slideshow.addEventListener("mouseenter", stopSlideshow);
slideshow.addEventListener("mouseleave", startSlideshow);

const UNSPLASH_ACCESS_KEY = "PT1dQiJdU0gvGeO0_7AMYrs0CRAfzYWpfSVLuENUW8Y";
const WEATHER_API_KEY = "7bcef4a541c9f76f38e3991ffe116789";

const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", searchDestination);

async function searchDestination() {
  const destination = document.getElementById("search-input").value.trim();
  if (!destination) return alert("Please enter a destination!");

  const photoBox = document.getElementById("photo-box");
  const weatherBox = document.getElementById("weather-box");
  const results = document.getElementById("results");

  results.classList.add("show");
  photoBox.innerHTML = `<div class="loader">Loading photos...</div>`;
  weatherBox.innerHTML = `<div class="loader">Loading weather...</div>`;

  try {
    const photoRes = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const photoData = await photoRes.json();
    photoBox.innerHTML = `<h2>Photos</h2>`;
    if (photoData.results.length > 0) {
      photoData.results.slice(0,3).forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || destination;
        img.style.marginTop = "10px";
        img.style.borderRadius = "8px";
        img.style.width = "100%";
        photoBox.appendChild(img);
      });
    } else {
      photoBox.innerHTML += "<p>No photos found.</p>";
    }

    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${WEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();
    weatherBox.innerHTML = `<h2>${weatherData.cod === 200 ? `Weather in ${weatherData.name}` : 'Weather'}</h2>`;
    if (weatherData.cod === 200) {
      weatherBox.innerHTML += `
        <p>🌡 Temp: ${weatherData.main.temp}°C</p>
        <p>☁ Condition: ${weatherData.weather[0].description}</p>
        <p>💨 Wind: ${weatherData.wind.speed} m/s</p>
      `;
    } else {
      weatherBox.innerHTML += "<p>Weather data not found.</p>";
    }

  } catch(err) {
    console.error(err);
    photoBox.innerHTML = "<p>Error loading photos.</p>";
    weatherBox.innerHTML = "<p>Error loading weather.</p>";
  }
}
