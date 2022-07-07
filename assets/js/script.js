let cityFormEl=document.querySelector("#cityForm");
let cityInputEl=document.querySelector("#cityInput");
let weatherContainerEl=document.querySelector("#weatherContainer");
let citySearchInputEl = document.querySelector("#citySearched");
let forecastTitle = document.querySelector("#forecastContainer");
let forecastContainerEl = document.querySelector("#forecast4Days");
let pastSearchButtonEl = document.querySelector("#buttonsSearched");
let cities = [];

let getCityWeather = function(city){
    let apiKey = "844421298d794574c100e3409cee0499"
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
        displayWeather(data, city);
        });
    });
};

let formSumbitHandler = function(event){
    event.preventDefault();
    let city = cityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        alert("Enter a location");
    }
    saveSearch();
    pastSearch(city);
}

let saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

let getUvIndex = function(lat,lon){
    let apiKey = "844421298d794574c100e3409cee0499"
    let apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
        displayUvIndex(data)          
        });
    });
}

let displayUvIndex = function(index){
    let uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV's: "
    uvIndexEl.classList = "list-group-item"
    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value
    if(index.value <=2){
        uvIndexValue.classList = "Comfortable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "Mild "
    }
    else if(index.value >8){
        uvIndexValue.classList = "Very Severe"
    };
    uvIndexEl.appendChild(uvIndexValue);   
    weatherContainerEl.appendChild(uvIndexEl);
}

let displayWeather = function(weather, searchCity){
    weatherContainerEl.textContent= "";  
    citySearchInputEl.textContent=searchCity;
    let currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);    
    let weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);    
    let temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"    
    let humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
    let windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);
    let lat = weather.coord.lat;
    let lon = weather.coord.lon;
    getUvIndex(lat,lon)
}

let get5Day = function(city){
    let apiKey = "844421298d794574c100e3409cee0499"
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
        display5Day(data);
        });
    });
};

let display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "Forecast 4 days:";
    let forecast = weather.list;
        for(let i=5; i < forecast.length; i=i+8){
        let dailyForecast = forecast[i];  
        let forecastEl=document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2"; 
        let forecastDate = document.createElement("h5")
        forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);
        let weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`); 
        forecastEl.appendChild(weatherIcon);
        let forecastTempEl=document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);
        let forecastHumEl=document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
        forecastEl.appendChild(forecastHumEl);
        forecastContainerEl.appendChild(forecastEl);
    }
}

let pastSearch = function(pastSearch){
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchButtonEl.prepend(pastSearchEl);
}

let pastSearchHandler = function(event){
    let city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }}

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);