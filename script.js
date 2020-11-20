// variable declaration
var cityInput = $("#city-input");
var searchButton = $("#search");
var clearButton = $("#clear");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUvIndex = $("#uv-index");
var searchedCity = [];
var APIKey = "fcca5f4c619ad41f11f10c94c440ccd7";


// function for displaying current weather
function currentWeather(cityName) {
    // URL to make a query
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        //weather icon
        var weatherIcon = response.weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
        // current date
        var date = moment().format('L');
        //display  name of city ,date and icon.
        currentCity.html(response.name + "(" + date + ")" + "<img src=" + iconUrl + ">");
        //  display the current temperature convert K to F 
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        currentTemperature.html((tempF).toFixed(0) + "&#8457");
        // display humidity
        currentHumidty.html(response.main.humidity + "%");
        //display wind speed   convert    m/s to mph
        var windsmph = (response.wind.speed * 2.237).toFixed(1);
        currentWindSpeed.html(windsmph + "MPH");
        // Display UVIndex.  
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        UVIndex(lon, lat);
        fiveDay(cityName);

        if (response.cod == 200) {
            searchedCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(searchedCity);
            if (searchedCity == null) {
                searchedCity = [];
                searchedCity.push(cityName.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(searchedCity));
                addToHistory(cityName);
            }
            if (!isInHistory(cityName)) {
                searchedCity.push(cityName.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(searchedCity));
                addToHistory(cityName);
            }

        }
    });
}

// display  5 day forecast 
function fiveDay(cityName) {
    var query5dayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
    $.ajax({
        url: query5dayURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        for (i = 0; i < 5; i++) {
            //5th data in each day 12:00pm
            var fullDate = response.list[i * 8 + 5].dt_txt;
            //takes the date not hour
            var date = fullDate.split(" ")[0];
            var iconCode = response.list[i * 8 + 5].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            var tempK = response.list[i * 8 + 5].main.temp;
            var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(0);
            var humidity = response.list[i * 8 + 5].main.humidity;
            $("#date" + i).html(date);
            $("#img" + i).html("<img src=" + iconUrl + ">");
            $("#temp" + i).html(tempF + "&#8457");
            $("#hum" + i).html(humidity + "%");
        }
    });
}
// function for displaying uvindex 
function UVIndex(lon, lat) {
    // url for uvindex.
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        currentUvIndex.html(response.value);
    });
}