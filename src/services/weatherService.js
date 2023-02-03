import { DateTime } from "luxon";
import getLocation from "./geoLocService";
const API_KEY = "0363aea0f499a955be6c34e6e9787aa2";
const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5/";
// const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";
// https://pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}

const getWeather = (type, searchParams) => {
    const url = new URL(BASE_URL_WEATHER + '/' + type);
    url.search = new URLSearchParams({...searchParams, "appid" : API_KEY});
    return fetch(url)
        .then((res)=>res.json());
        
};

const formatCurrentWeather = (data) => {
    const {
        coord : {lon, lat},
        main : {temp, feels_like, temp_min, temp_max, humidity},
        wind : {speed},
        dt,
        // dt is a utc time stamp
        sys : {sunrise, sunset, country},
        name,
        weather,
    } = data;

    const {main: details, description, icon} = weather[0];
    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, speed, dt, sunrise, sunset, country, name, weather, details, description, icon};
};

/*
const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
// cccc = day (sunday, monday), dd = day (number), LLL = month, yyyy = year, hh = hour, mm = min, a = am or pm
*/

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs+zone).setZone("utc").toFormat(format);

const formatForecastWeather = (data, currentDt) => {
    const {
        city: {timezone}, 
        list
    } = data;
    const hourly = list.slice(0,5).map((d) => {
        return {
            title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
            temp: d.main.temp,
            icon: d.weather[0].icon,
        };
    });

    let dailylist = Array();
    
    // console.log(formatToLocalTime(list[0].dt, timezone, "y LL dd"));
    let currentDay = formatToLocalTime(currentDt, timezone, "y LL dd");
    // 2023-01-13 21:00:00
    
    for (let i = 0; i < 40; i++) {
        const nextDay = formatToLocalTime(list[i].dt, timezone, "y LL dd");
        if (currentDay != nextDay) {
            currentDay = nextDay;
            const newLength = dailylist.push(list[i]);
            if (newLength == 5) {
                break;
            };
        };
    };
    const daily = dailylist.slice(0,5).map((d) => {
        return {
            title: formatToLocalTime(d.dt, timezone, "ccc"),
            temp: d.main.temp,
            icon: d.weather[0].icon,
        };
    });
    return {timezone, daily, hourly};
};

const iconUrlFromCode = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

const getFormattedWeather = async (searchParams) => {

    const currentWeather = await getWeather('weather', searchParams)
        .then((data)=> formatCurrentWeather(data));
    const currentDay = currentWeather.dt;
    const forecastWeather = await getWeather('forecast', searchParams)
        .then((data)=>formatForecastWeather(data,currentDay));
    
    /*
    const [currentWeather, forecastWeather] = await Promise.all([
        getWeather('weather', searchParams).then((data) => formatCurrentWeather(data)), 
        getWeather('forecast', searchParams).then((data)=>formatForecastWeather(data)), 
    ]);

    */
    let res = {...currentWeather, ...forecastWeather};
    
    // console.log(res);
    return res ;

};

export default getFormattedWeather;
export {formatToLocalTime, iconUrlFromCode};