import {format} from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
} from "recharts";
import "./styles/ForecastChart.css";

function ForecastChart() {
   const [chartData, setChartData] = useState([]);
   const [cityName, setCityName] = useState("");
   const { cityId } = useParams();

   useEffect(() => {
      const { REACT_APP_OPENWEATHERMAP_API_KEY } = process.env;
      const endPoint = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${REACT_APP_OPENWEATHERMAP_API_KEY}`;
      console.log(endPoint);

      async function fetchData() {
         try {
            const res = await fetch(endPoint);
            const dailyForecast = await res.json();
            if (res.status !== 200) throw new Error(dailyForecast.message);
            setChartData(
               dailyForecast.list.map(threeHours => {
                  const { dt , main } = threeHours;
                  return { date: format(new Date(dt * 1000), "MMM dd"), time: format(new Date(dt * 1000), "HH:mm") ,temp: main.temp };
               })
            );
            setCityName(
               `${dailyForecast.city.name}, ${dailyForecast.city.country}`
            );
            setTimeout(() => {
               
               console.log(chartData);
            }, 1000);
         } catch (error) {
            console.error(error);
         }
      }

      fetchData();
   });

  

   return (
      <div className='chartpg'>
         <h1>5 days forecast for </h1>
         <h2>{cityName}</h2>

         <AreaChart
            width={900}
            height={400}
            data={chartData}
            margin={{
               top: 10,
               right: 30,
               left: 0,
               bottom: 0,
            }}>
            <CartesianGrid stroke='lightgray'/>

            <XAxis dataKey='date' stroke='purple' id="x-axis" tickCount={5}/>
            <YAxis dataKey="temp" stroke={false} unit="°" type="number" tickCount="5"/>
            <Tooltip />
            <Area type='monotone' dataKey='temp' stroke='purple' strokeWidth="4" fill='purple' />
            <Area type='monotone' dataKey='time'/>
         </AreaChart>
      </div>
   );
}

export default ForecastChart;
