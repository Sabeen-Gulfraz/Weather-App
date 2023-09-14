//event on select
$(document).on("click", function (event) {
  // Check if the click event was outside the select element
  if (!$(event.target).closest("#location").length) {
    // Reset the select element's value
    $("#location").val("Choose Location");
  }
});
//countries API
$(document).ready(function() {
  $.ajax({
    url: 'https://countriesnow.space/api/v0.1/countries',
    success: function(data) {
      var countryNames = data.data;
      var countryName;
      countryNames.forEach(function(countryData) {
        countryName = countryData.country;
        $('#location').append(`
          <option class="country-option" value="${countryName}">${countryName}</option>
        `);
      });
    }
  });
//Add Event for Cities list 
  $("#location").on('change', function() {
    var selectedCountry = $(this).val();
    $.ajax({
      url: "https://countriesnow.space/api/v0.1/countries/cities",
      type: "POST",
      data: {
        "country": selectedCountry
      },
      beforeSend: function(){
        $("#input").append(`
          <img  class="load" width="104px" height="104px" src="img/loading.gif" alt="">
        `);
      },
      success: function(data) {
        var cities = data.data;
        $("#input").html(`
          <label class="label">Now Choose Your City</label>
          <select class="loc-input" id="city" type="text">
              <option>Choose City</option>
          </select>
        `);
        cities.forEach(function(city) {
          $("#city").append(`
            <option value="${city}">${city}</option>
          `);
        });
      }
    });
  });
});
// weather API
var latitude;
var longitude;
var input_location;
// Event listener for cities select element
$(document).on("change", "#city", function() {
  $("#bg").html(" ");
  input_location = $(this).val();
  //now select element value stored in input_location variable
  $("#city").val(input_location);
  //API to change city name into longitude and altitude form
  $.ajax({
    url: `https://geocode.maps.co/search?q=${input_location}`,
    beforeSend: function () {
      $("#input").append(`<img  class="load" width="104px" height="104px" src="img/loading.gif" alt="">`);
    },
    success: function (data) {
      //input location changed in longitude and latitude
      latitude = data[0].lat;
      longitude = data[0].lon;
      //get weather for the location
      $.ajax({
        url: `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`,
        success: function (data) {
          $(".load").remove();
          var bgclass;
          var myWeather;
          if (data.current_weather.weathercode === 0) {
            bgclass = "clear-sky";
            myWeather = "Clear Sky";
          } else if (data.current_weather.weathercode === 1) {
            bgclass = "sunny";
            myWeather = "Sunny";
          } else if (data.current_weather.weathercode === 2) {
            bgclass = "partly-cloudy";
            myWeather = "Partly Cloudy";
          } else if (data.current_weather.weathercode === 3) {
            bgclass = "cloudy";
            myWeather = "Cloudy";
          } else if (data.current_weather.weathercode === 45 || data.current_weather.weathercode === 48) {
            bgclass = "fog";
            myWeather = "Fog";
          } else if ((data.current_weather.weathercode >= 51 && data.current_weather.weathercode <= 67) || (data.current_weather.weathercode >= 80 && data.current_weather.weathercode <= 82)) {
            bgclass = "rainy";
            myWeather = "Rainy";
          } else if ((data.current_weather.weathercode >= 71 && data.current_weather.weathercode <= 77) || data.current_weather.weathercode === 85 || data.current_weather.weathercode === 86) {
            bgclass = "snow-fall";
            myWeather = "Snow Fall";
          } else if (data.current_weather.weathercode >= 95 && data.current_weather.weathercode <= 99) {
            bgclass = "storm";
            myWeather = "Stormy";
          }
          $("#bg").append(`
            <div id="Weather-card" class="${bgclass}">
              <div>
                 <p class="city">${input_location}</p>
                 <a  href="index.html">
                    <img class="cross" src="img/close.png" alt="cross-icon">
                 </a>
                 <h3 class="Weather">${myWeather}</h3>
                 <p id="current-date">${data.current_weather.time}</p>
              </div>
              <div id="temp-cent">
                 <h1 class="temp">${data.current_weather.temperature}</h1>
                 <img class="cent"  src="img/centigrate.gif" alt="centigrate">
              </div>
              <div id="direction-speed">
                  <div class="w-direction">
                     <span><b>Wind Direction</b></span>
                     <span>${data.current_weather.winddirection} degree</span>
                  </div>
                  <div class="w-speed">
                     <span><b>Wind Speed</b></span>
                     <span>${data.current_weather.windspeed} (Km/h)</span>
                  </div>
              </div>
            </div>
          `);
          // cross svg event
          $('.cross').click(function () {
            $("#bg").remove();
          });
        },
      });
    },
  });
});






