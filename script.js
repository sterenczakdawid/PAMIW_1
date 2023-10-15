const customDropdown = document.querySelector(".custom-dropdown");
const cityInput = document.getElementById("city-input");
const cityList = document.getElementById("city-list");

const cityName = document.querySelector(".city-name");
const current = document.querySelector(".current");
const oneHour = document.querySelector(".one-hour");
const twelveHours = document.querySelector(".twelve-hours");
const tomorrow = document.querySelector(".tomorrow");
const fiveDays = document.querySelector(".five-days");
const yesterday = document.querySelector(".yesterday");

const API_KEY = "U1xSGBSx0FYkoSfpwQnaIzvAVUlEEL73";
let picked_city_key = 0;

//autocomplete endpoint
const getCities = async (city) => {
	const base =
		"http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
	const query = `?apikey=${API_KEY}&q=${city}`;

	const response = await fetch(base + query);
	const data = await response.json();

	return data.map((cityData) => ({
		name: cityData.LocalizedName,
		id: cityData.Key,
	}));
};

//current conditions endpoint
const getWeather = async (key) => {
	const base = "http://dataservice.accuweather.com/currentconditions/v1/";
	const query = `${key}?apikey=${API_KEY}`;

	const response = await fetch(base + query);
	const data = await response.json();

	current.textContent = data[0].Temperature.Metric.Value + "°C";
};

//1 hour endpoint
const getWeatherIn1Hour = async (key) => {
	const base = "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/";
	const query = `${key}?apikey=${API_KEY}&metric=true`;

	const response = await fetch(base + query);
	const data = await response.json();

	oneHour.textContent = data[0].Temperature.Value + "°C";
};

//12 hours endpoint
const getWeatherIn12Hours = async (key) => {
	const base = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
	const query = `${key}?apikey=${API_KEY}&metric=true`;

	const response = await fetch(base + query);
	const data = await response.json();

	twelveHours.textContent = data[11].Temperature.Value + "°C";
};

//24 hours endpoint
const getWeatherForTomorrow = async (key) => {
	const base = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/";
	const query = `${key}?apikey=${API_KEY}&metric=true`;

	const response = await fetch(base + query);
	const data = await response.json();

	tomorrow.textContent =
		data.DailyForecasts[0].Temperature.Maximum.Value + "°C";
};

//5 days endpoint
const getWeatherIn5Days = async (key) => {
	const base = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";
	const query = `${key}?apikey=${API_KEY}&metric=true`;

	const response = await fetch(base + query);
	const data = await response.json();

	fiveDays.textContent =
		data.DailyForecasts[4].Temperature.Maximum.Value + "°C";
};

//24 hours before endpoint
const getWeatherForYesterday = async (key) => {
	const base = `http://dataservice.accuweather.com/currentconditions/v1/${key}/historical/24`;
	const query = `?apikey=${API_KEY}`;

	const response = await fetch(base + query);
	const data = await response.json();

	yesterday.textContent = data[23].Temperature.Metric.Value + "°C";
};

const createListItem = (city) => {
	const listItem = document.createElement("li");
	listItem.textContent = city.name;
	listItem.addEventListener("click", () => {
		// console.log("Kliknięto: " + city.id);
		picked_city_key = city.id;
		getWeather(picked_city_key);
		getWeatherIn1Hour(picked_city_key);
		getWeatherIn12Hours(picked_city_key);
		getWeatherForTomorrow(picked_city_key);
		getWeatherIn5Days(picked_city_key);
		getWeatherForYesterday(picked_city_key);
		cityInput.value = "";
		cityName.textContent = city.name;
		hideCityList();
	});
	return listItem;
};

const hideCityList = () => {
	cityList.style.display = "none";
};

const showCityList = () => {
	cityList.style.display = "block";
};

cityInput.addEventListener("keydown", async (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		const searchText = cityInput.value.toLowerCase();
		cityList.innerHTML = "";

		const citiesArray = await getCities(searchText);

		citiesArray.forEach((city) => {
			if (city.name.toLowerCase().includes(searchText)) {
				const listItem = createListItem(city);
				cityList.appendChild(listItem);
			}
		});

		showCityList();
	}
});

// Ukryj listę miast po kliknięciu w inne miejsce na stronie
document.addEventListener("click", (event) => {
	if (event.target !== cityInput && event.target !== cityList) {
		hideCityList();
	}
});
