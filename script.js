const container = document.querySelector('main');
const searchForm = document.createElement('form');
const header = document.createElement('p');
const searchLabel = document.createElement('label');
const searchInput = document.createElement('input');
const searchButton = document.createElement('button');
const divTemporal = document.createElement('div');

container.classList.add('container','initial');
divTemporal.classList.add('temporal');
divTemporal.classList.add('initial');
header.innerText = 'The Weather Api';
header.setAttribute('style','font-size: 2rem;display: flex;justify-content: center;text-transform: uppercase;');
searchForm.setAttribute('id','form');
searchForm.setAttribute('novalidate', '');
searchForm.classList.add('search');
searchLabel.setAttribute('for','location');
searchLabel.innerText = 'Type the location you want to search for:';
searchInput.setAttribute('id','location');
searchInput.setAttribute('name','location');
searchInput.setAttribute('type','text');
searchInput.setAttribute('required','');
searchInput.setAttribute('pattern','^[a-zA-Z0-9]+$');

searchButton.setAttribute('type','submit');
searchButton.innerText = 'SEARCH';
searchButton.classList.add('myButton');

container.appendChild(searchForm);
container.appendChild(divTemporal);
searchForm.appendChild(header);
searchForm.appendChild(searchLabel);
searchForm.appendChild(searchInput);
searchForm.appendChild(searchButton);

let weatherapiUrl = 'https://api.weatherapi.com/v1/current.json?key=8e1ecc57edb74e0a8ca192317240506&q=';

function showError(arg1, arg2) {
    // arg1 is the input field - arg2 is the message for the type of error
    // create an element for display the error message
  
    let id = arg1.getAttribute('id');
  
    const inputError = document.createElement('p');
    inputError.classList.add('error');
    inputError.classList.add('active');
    inputError.setAttribute('id', `${id}error`);
    inputError.setAttribute('aria-live', 'polite');
    inputError.textContent = arg2;
  
    const parentElement = arg1.parentNode;
    parentElement.appendChild(inputError);
  }

function deleteDivError(arg) {
    // arg is the input field
    let id = arg.getAttribute('id');
  
    const errorMessage = document.getElementById(`${id}error`);
    if (errorMessage !== null) {
      let x = errorMessage;
      x.parentNode.removeChild(x);
    }
  }

function removePreviousData(){
    const dataContainer = document.querySelector('.data-container');
    if(dataContainer!==null){
    dataContainer.remove();
    }
}

const readData = (arg) => {   
  /* tendrá el argumento el archivo json - por los momentos utilizaré el local storage */
  /* let weatherData = JSON.parse(localStorage.getItem("weatherData")); */
  let weatherData = arg;
  let data = {
    place : `${weatherData.location.name.toUpperCase()} - ${weatherData.location.region}`,
    country : weatherData.location.country,
    date : weatherData.current.last_updated,
    c_kph_mm : 
        {
    temp : weatherData.current.temp_c,
    feelslike : weatherData.current.feelslike_c,
    wind : weatherData.current.wind_kph,
    precip : weatherData.current.precip_mm,
    }
    ,
    f_mph_in : {
    temp : weatherData.current.temp_f,
    feelslike : weatherData.current.feelslike_f,
    wind: weatherData.current.wind_mph,
    precip: weatherData.current.precip_in,
    },
    uv : weatherData.current.uv,
    cloud : weatherData.current.cloud,
  };
    console.log(data);
    removePreviousData();
    deletePreviousBackground(); 
    displayData(data);
    updateBackground(data);
}

function updateUrl(arg) {
    // arg is the location enter
    arg = arg.toLowerCase();
    weatherapiUrl = `https://api.weatherapi.com/v1/current.json?key=8e1ecc57edb74e0a8ca192317240506&q=${arg}`;
    return weatherapiUrl;
  }

async function getWeatherData(arg) {
    // arg is the url updated with the location
 try { 
    const response = await fetch(arg, { mode: 'cors' });
    const weatherData = await response.json();
    console.log(weatherData);
    // guardar en localStorage solo mientras termino el diseño y las pruebas
   /*  localStorage.setItem('weatherData', JSON.stringify(weatherData)); */
    readData(weatherData);
    }catch (error) {
        alert('Something was wrong. try again later');
      } 
  }

searchInput.addEventListener('input', (event) => {
  deleteDivError(searchInput); // Remove previous error messages
  console.log(searchInput.validity.patternMismatch);
  if (searchInput.validity.patternMismatch) {
    showError(searchInput, 'This is not a valid location');
    event.preventDefault();
  } 
});

searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  deleteDivError(searchInput);

  let location = document.getElementById('location').value;

  if (
    searchInput.validity.valueMissing | searchInput.validity.patternMismatch
  ) {
    event.preventDefault();
    showError(searchInput, 'You must enter a valid location to search for');
  } else {
    console.log(searchInput.validity.valueMissing);
    console.log(location);
    weatherapiUrl = updateUrl(location);
    console.log(weatherapiUrl);
    getWeatherData(weatherapiUrl);
    document.getElementById('form').reset();
  }
});

function displayData(data){

if(divTemporal!==null){
    divTemporal.remove();
}

const dataContainer = document.createElement('div');
const place = document.createElement('p');
const country = document.createElement('p');
const date = document.createElement('p');
const temp = document.createElement('p');
const feelTemp = document.createElement('p');
const divWindRain = document.createElement('div');
const wind = document.createElement('p');
const precip = document.createElement('p');
const divCloudUv = document.createElement('div');
const cloud = document.createElement('p');
const uv = document.createElement('p');
const imgCloudUv = document.createElement('img');

const divTemp = document.createElement('div');
const selectTemp = document.createElement('select');
const celsiusTemp = document.createElement('option');
const farenheitTemp = document.createElement('option');

dataContainer.classList.add('data-container');
place.innerText = `${data.place}`;
place.setAttribute('style','grid-area: 1 / 1 / 2 / 3; font-size: 2rem;display:flex ;justify-content: center;');
country.innerText = `${data.country}`;
country.setAttribute('style','grid-area: 2 / 1 / 3 / 2;display:flex ;justify-content: center;');
date.innerText = `date: ${data.date.slice(0,10)} time: ${data.date.slice(11,16)}`;
date.setAttribute('style','grid-area: 2/ 2 / 3 / 3;');
temp.innerText = `Temp: ${data.c_kph_mm.temp}`;
feelTemp.innerText = `Feelslike: ${data.c_kph_mm.feelslike}`;
divTemp.setAttribute('style','grid-area: 3/1/4/3;display:flex;justify-content: space-around;flex-wrap: nowrap;');
selectTemp.setAttribute('style','width: 20%;font-size:1.5rem;');
celsiusTemp.innerText = '°C';
celsiusTemp.setAttribute('value','celsius');
farenheitTemp.innerText = '°F';
farenheitTemp.setAttribute('value','farenheit');
divWindRain.setAttribute('style','grid-area: 4/1/5/3;display:flex;justify-content: space-around;flex-wrap: nowrap;');
wind.innerText = `Wind: ${data.c_kph_mm.wind} Kph`;
precip.innerText = `Precipitation: ${data.c_kph_mm.precip} millimetres`;
divCloudUv.setAttribute('style','grid-area: 5/1/6/3;display:flex;justify-content: space-around;flex-wrap: nowrap;');
cloud.innerText = `Clouds: ${data.cloud} %`;
uv.innerText = `UV Index:${data.uv}`;
imgCloudUv.src = updateIcon(data,imgCloudUv);

container.appendChild(dataContainer);
dataContainer.appendChild(place);
dataContainer.appendChild(country);
dataContainer.appendChild(date);
dataContainer.appendChild(divTemp);
dataContainer.appendChild(divWindRain);
dataContainer.appendChild(divCloudUv);
divTemp.appendChild(selectTemp);
selectTemp.appendChild(celsiusTemp);
selectTemp.appendChild(farenheitTemp);
divTemp.appendChild(temp);
divTemp.appendChild(feelTemp);
divWindRain.appendChild(wind);
divWindRain.appendChild(precip);
divCloudUv.appendChild(cloud);
divCloudUv.appendChild(imgCloudUv);
divCloudUv.appendChild(uv);

function update(arg1,arg2,arg3,arg4) {
    subData = arg2;
    temp.innerText = `Temp: ${subData.temp}`;
    feelTemp.innerText = `Feelslike: ${subData.feelslike}`;
    wind.innerText = `Wind: ${subData.wind} ${arg3}`;
    precip.innerText = `Precipitation: ${subData.precip} ${arg4}`;
}
  
selectTemp.addEventListener("change", () =>
    selectTemp.value === "celsius"
      ? update("celsius",data.c_kph_mm,'Kph','millimetres')
      : update("farenheit",data.f_mph_in,'Mph','inches'),
);
}

function deletePreviousBackground(){
    let arrayClasses = container.className.split(' ');
    let [first,rest] = arrayClasses;
console.log(first);
console.log(rest);
    if (rest !== undefined) {
        container.classList.remove(rest);
      } 
}

function updateBackground(data) {
 if(data.c_kph_mm.temp <= 0){
  container.classList.add('cold-weather');
 }else{
    if(data.c_kph_mm.temp > 0 & data.c_kph_mm.temp < 30){
    container.classList.add('mild-weather');
    }else{
    container.classList.add('hot-weather');
 }}
}

function updateIcon(data,imgCloudUv){
    const img = imgCloudUv;
    console.log(img);
    img.setAttribute('style','width: 25%; height:90%');
    switch ( data.c_kph_mm.temp < 0 ) {
        case true:
            img.src = './img/snowflake.png';
          break;
        default:
          switch (data.uv > 5) {
            case true:
                img.src = './img/sun-thermometer-outline.png';
              break;
            default:
                switch (data.c_kph_mm.precip > 7.6) {
                    case true:
                        img.src = './img/weather-pouring.png';
                      break;
                    default:
                        switch (data.cloud > 60) {
                            case true:
                                img.src = './img/clouds.png';
                              break;
                            default:
                                switch (data.cloud === 0) {
                                    case true:
                                        img.src = './img/sun-clock-outline.png';
                                      break;
                                    default:
                                img.src = './img/weather-partly-cloudy.png';
                    }
                }
            }
        }
    }
    console.log(img.src);
    return img.src;
}