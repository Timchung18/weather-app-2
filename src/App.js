
import './App.css';
import UilReact from '@iconscout/react-unicons/icons/uil-react';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
import getLocation from './services/geoLocService';
// import getWeather from './services/weatherService';
import getFormattedWeather from './services/weatherService';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_KEY = '0363aea0f499a955be6c34e6e9787aa2';
const template  = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&appid={API key}';
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';

function App() {

  const [query, setQuery] = useState({q: 'burbank'});
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);

  useEffect( 
    () => {
      const fetchLocation = async() => {
        const message = query.q ? query.q : "current location.";
        toast.info("Fetching weather for " + message);

        if ("skipFindLocation" in query) {
          // console.log(query.skipFindLocation);
          const w = await getFormattedWeather({"lat":query.lat, "lon":query.lon, "units":units})
          .then((data)=>{
            toast.success(
              `Successfully fetched weather for ${data.name}, ${data.country}`
            );
            // console.log(data);
            setWeather(data);
          });
        } else {
          const data = await getLocation({...query, units});
          // console.log(data)
          const w = await getFormattedWeather({"lat": data[0]["lat"], "lon": data[0]["lon"], "units":units})
          .then((data)=>{
            toast.success(
              `Successfully fetched weather for ${data.name}, ${data.country}`
            );
            // console.log(data)
            setWeather(data);
          });
        }
        
        
        
      };
    
      
      fetchLocation();
    },
    [query, units]
    // every time query or unit changes, we want to fetch (call the function) again
  );

  const formatBackground = () => {
    if (!weather) return 'from-cyan-700 to-blue-700'
    const threshold = units === 'metric' ? 20 : 68
    if (weather.temp <= threshold) return 'from-cyan-700 to-blue-700'

    return 'from-yellow-700 to-orange-700'
  }

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br ${formatBackground()} h-fit shadow-xl shadow-gray-400 `}> 
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>
      {weather && (
        <div>
          
          <TimeAndLocation weather={weather}/>
          <TemperatureAndDetails weather={weather}/>
          <Forecast title='Hourly forecast' items={weather.hourly}/>
          <Forecast title='Daily forecast' items={weather.daily}/>
        </div>
      )}
        
      <ToastContainer autoClose={5000} theme='colored' newestOnTop={true}/>
      
    </div>
  );
}

export default App;
// "mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400"
/*
mx-auto -> horiz. margin: changes automatically; keeps it centered
max-w-screen-md -> max width of screen is "md" sized
mt-4 -> margin top
py-5 -> padding (y axis)
px-32 -> padding
bg-gradient-to-br 
from-cyan-700 
to-blue-700 
h-fit -> height: fit content
shadow-xl -> box shadow
shadow-gray-400 -> box shadow color"
 */