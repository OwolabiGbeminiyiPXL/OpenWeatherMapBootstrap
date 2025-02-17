(function() {

  var openweathermapApi = '1442668b20e7cfe9be7420e005dcfa6a';
  var baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
  var iconBaseUrl = 'https://openweathermap.org/img/wn/';
  var iconExtension = '@2x.png';
  var cityBaseUrl = 'https://openweathermap.org/city/';

  $(document).ready(Setup);

  function Setup() {
    $('#btn-load')
      .on('click', BtnLoad_OnClick);

    $('#btn-erase')
      .on('click', BtnErase_OnClick);

    FocusTextBox();
  }

  function BtnLoad_OnClick(e) {
    e.preventDefault();

    var city = $('#txt-city').val();
    LoadWeatherData(city);

    FocusTextBox();
  }

  function BtnErase_OnClick(e) {
    e.preventDefault();

    $('#results').empty();

    FocusTextBox();
  }

  function FocusTextBox() {
    $('#txt-city')
      .val('')
      .focus();
  }

  function LoadWeatherData(city) {
    var url = GetWeatherUrl(city);

    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: OnSuccess
    });
  }

  function OnSuccess(weatherData) {
    var viewModel = GetViewModel(weatherData);

    var card = GenerateCard(viewModel);

    $('#results').append(card);

    var mapViewModel = GetMapViewModel(weatherData);
    InitializeMap(mapViewModel);
  }

  function InitializeMap(data) {
    var map = L.map('city-' + data.cityId).setView([data.lat, data.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([data.lat, data.lon]).addTo(map);
  }

  function GenerateCard(data) {
    var col = $('<div class="col" />');

    var card = $('<div class="card mt-3" />');

    var map = $('<div id="city-' + data.cityId + '" class="card-img-top min-height-xl" />');
    card.append(map);

    var body = $('<div class="card-body" />');
    var bodyHeader = $('<h3 class="card-title" />');
    var icon = $(
      '<img src="' + 
      data.iconUrl + 
      '" alt="' + 
      data.weatherDescription + 
      '" />'
    );
    bodyHeader.append(icon);
    var headerLink = $('<a href="' + data.cityUrl + '" target="_blank" />');
    headerLink.append(data.cityName);
    bodyHeader.append(headerLink);
    var country = $('<span class="text-muted font-size-sm" />');
    country.append('&nbsp;(' + data.country + ')');
    bodyHeader.append(country);
    body.append(bodyHeader);

    var bodyText = $('<p class="card-text text-center" />');
    bodyText.html(
      'Het is momenteel <span class="font-weight-bolder font-size-l">' +
      data.temperature + 
      '°C</span><br />en <span class="font-weight-bolder font-size-l">' +
      data.weatherDescription +
      '</span> in <span class="font-weight-bolder font-size-l">' +
      data.cityName + 
      '</span>'
    );
    body.append(bodyText);

    card.append(body);

    col.append(card);

    return col;
  }

  function GetViewModel(weatherData) {
    var viewModel = {
      cityId: weatherData.id,
      cityName: weatherData.name,
      cityUrl: GetCityUrl(weatherData.id),
      iconUrl: GetIconUrl(weatherData.weather[0].icon),
      weatherDescription: weatherData.weather[0].description,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp
    };

    return viewModel;
  }

  function GetMapViewModel(weatherData) {
    var viewModel = {
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
      cityId: weatherData.id
    };

    return viewModel;
  }

  function GetWeatherUrl(city) {
    var url = baseUrl;

    url += '?units=metric';
    url += '&lang=nl';
    url += '&appid=' + openweathermapApi;
    url += '&q=' + city;

    return url;
  }

  function GetCityUrl(cityId) {
    return cityBaseUrl + cityId;
  }

  function GetIconUrl(icon) {
    return iconBaseUrl + icon + iconExtension;
  }

})();


// {
//   "coord": {
//       "lon": 5.3378,
//       "lat": 50.9311
//   },
//   "weather": [
//       {
//           "id": 804,
//           "main": "Clouds",
//           "description": "bewolkt",
//           "icon": "04n"
//       }
//   ],
//   "base": "stations",
//   "main": {
//       "temp": 9.08,
//       "feels_like": 5.84,
//       "temp_min": 8.49,
//       "temp_max": 9.99,
//       "pressure": 1008,
//       "humidity": 84
//   },
//   "visibility": 10000,
//   "wind": {
//       "speed": 6.71,
//       "deg": 248,
//       "gust": 7.15
//   },
//   "clouds": {
//       "all": 100
//   },
//   "dt": 1638295832,
//   "sys": {
//       "type": 2,
//       "id": 2003943,
//       "country": "BE",
//       "sunrise": 1638256699,
//       "sunset": 1638286606
//   },
//   "timezone": 3600,
//   "id": 2796491,
//   "name": "Hasselt",
//   "cod": 200
// }