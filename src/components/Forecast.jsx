import React from 'react';
import { iconUrlFromCode } from '../services/weatherService';

function Forecast({title, items}) {
//   {console.log(items)};
  return (
    <div>
        <div className='flex items=center justify-start mt-2'>
            <p className='text-white text-xl uppercase'>
                {title}
            </p>
        </div>
        
        <hr className='my-2'/>
        <div className='flex flex-row items-center justify-between text-white'>
            
            {items.map((item) => {
                return (
                <div key={item.title} className='flex flex-col items-center justify-center'>
                    <p className='text-sm font-light'>{item.title}</p>
                    <img 
                        className='w-12 my-1 '
                        src={iconUrlFromCode(item.icon)}
                        alt=''
                    />
                    <p className='font-medium'>{`${item.temp.toFixed()}°`}</p>
                </div>
                )
            })}
                
        </div>
    </div>
  );
}

export default Forecast;