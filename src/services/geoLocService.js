const API_KEY = "0363aea0f499a955be6c34e6e9787aa2";
const BASE_URL_GEO  = "http://api.openweathermap.org/geo/1.0/direct";
// template: "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&appid={API key}";


const getLocation = (searchParams) => {
    const url = new URL(BASE_URL_GEO);
    url.search = new URLSearchParams({...searchParams, "appid" : API_KEY});
    // console.log(url.searchParams);
    // console.log(url.search);
    // console.log(url.href);
    return fetch(url)
        .then((res) => res.json())
        .then((data)=> data);

}



export default getLocation;