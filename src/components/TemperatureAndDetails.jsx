import React from 'react';
import { 
    UilArrowUp, 
    UilArrowDown,
    UilTemperature,
    UilTear,
    UilWind,
    UilSun,
    UilSunset
} from '@iconscout/react-unicons';
import { formatToLocalTime, iconUrlFromCode } from '../services/weatherService';

function TemperatureAndDetails({weather: {details, icon, temp, temp_min, temp_max, sunrise, sunset, speed, humidity, feels_like, timezone}}) {
  return (
    <div>
        <div className='flex items-center justify-center py-6 text-xl text-cyan-300'>
            <p> {details} </p>
        </div>
        <div className='flex  flex-row items-center justify-between  text-white py-3'>
            <img 
            className='w-20 '
            src={iconUrlFromCode(icon)}/>

            <p className=' text-5xl text-center '> {`${temp.toFixed()}`}°</p>

            <div className=' flex flex-col space-y-2 '>
                <div className='flex font-light text-sm items-center justify-center'>
                    <UilTemperature size={18} className='mr-1'/>
                    Feels like:
                    <span className='font-medium ml-1'>{`${feels_like.toFixed()}`}°</span>
                </div>

                <div className='flex font-light text-sm items-center justify-center'>
                    <UilTear size={18} className='mr-1'/>
                    Humidity:
                    <span className='font-medium ml-1'>{humidity}%</span>
                </div>

                <div className='flex font-light text-sm items-center justify-center'>
                    <UilWind size={18} className='mr-1'/>
                    Wind: 
                    <span className='font-medium ml-1'>{speed} km/hr</span>
                </div>
            </div>
        </div>
        {/* this part is for the sunrise, sunset */}
        <div className='flex flex-row items-center justify-between  text-white text-sm py-3'>
            <UilSun/>
            <p className='font-light'>
                Sunrise: <span className='font-medium '>{formatToLocalTime(sunrise,timezone,"hh:mm a")}</span>
            </p>
            <p>|</p>

            <UilSunset/>
            <p className='font-light'>
                Sunset: <span className='font-medium '>{formatToLocalTime(sunset,timezone,"hh:mm a")}</span>
            </p>
            <p>|</p>

            <UilArrowUp/>
            <p className='font-light'>
                High: <span className='font-medium '>{`${temp_max.toFixed()}`}°</span>
            </p>
            <p>|</p>

            <UilArrowDown/>
            <p className='font-light'>
                Low: <span className='font-medium  '>{`${temp_min.toFixed()}`}°</span>
            </p>


        </div>
    </div>
  );
}

export default TemperatureAndDetails;