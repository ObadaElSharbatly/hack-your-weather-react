function Forecast ({general, details, location}) {
    
    const cityLocation = `${location.lat}, ${location.lon}`;

    return (
        <>
            <div className="general-forecast">
                <h3 data-testid="condition"><strong>{general.main}</strong></h3>
                <h4 style={{"fontWeight": "lighter"}} data-testid="condition">{general.description}</h4>
            </div>
            <div className="forecast-details">
                <ul>
                    <li><h4 data-testid="min">min temp : {details.temp_min}</h4></li>
                    <li><h4 data-testid="max">max temp : {details.temp_max}</h4></li>
                    <li><h4 data-testid="location">location : {cityLocation}</h4></li>
                </ul>
            </div>
        </>
    )
}

export default Forecast;