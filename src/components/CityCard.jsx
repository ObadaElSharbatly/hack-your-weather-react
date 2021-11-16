import Forecast from "./Forecast";
import { Link } from "react-router-dom";

function CityCard({ cityWeather, setCityWeather }) {
   function handleDelete(e) {
      setCityWeather(prev => prev.filter(city => city.card_id !== e.target.id));
   }
   return (
      <div>
         {cityWeather.length > 0 ? (
            cityWeather.map((city, index) => {
               const { name, sys, weather, main, coord, card_id, id } = city;
               return (
                  <div
                     className='city-card'
                     data-testid={`weather_card_${index}`}
                     key={index}>
                     <div
                        className='delete'
                        id={card_id}
                        onClick={handleDelete}
                        data-testid={`delete_button_${index}`}>
                        X
                     </div>
                     <Link
                        to={`/${id}`}
                        target='_blank'
                        style={{ textDecoration: "none", color: "black" }}>
                        <h2>
                           {name}, {sys.country}
                        </h2>
                        <Forecast
                           general={weather[0]}
                           details={main}
                           location={coord}
                        />
                     </Link>
                  </div>
               );
            })
         ) : (
            <h2 className='welcome-msg'>
               Welcome to HackYourWeather <br /> Enter a City Name to know the
               current weather all over the world
            </h2>
         )}
      </div>
   );
}

export default CityCard;
