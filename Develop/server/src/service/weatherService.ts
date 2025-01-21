import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

interface DailyWeatherData {
  temp: { day: number };
  weather: { description: string }[];
  humidity: number;
  wind_speed: number;
}

interface WeatherData {
  daily: DailyWeatherData[];
}

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}
// TODO: Complete the WeatherService class
class WeatherService {

  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL= API_BASE_URL!;
    this.apiKey = API_KEY!;
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await axios.get(this.buildGeocodeQuery(query));
      const locationData = response.data[0];
      return { lat: locationData.lat, lon: locationData.lon };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Could not fetch location data.');
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    try {
      const locationData = await this.fetchLocationData(query);
      return this.destructureLocationData(locationData);
    } catch (error) {
      throw new Error('Could not fetch and destructure location data.');
    }
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherData> {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      console.log('OpenWeather API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Could not fetch weather data.');
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return {
      temperature: response.main.temp,
      description: response.weather[0].description,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
    };
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: WeatherData): Weather[] {
    const forecastArray: Weather[] = [];

    if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
      console.error('No forecast data available');
      return forecastArray;
    }

    const daysToForecast = Math.min(5, weatherData.daily.length);

    for (let i = 1; i <= daysToForecast; i++) {
      const dayData = weatherData.daily[i];
      forecastArray.push({
        temperature: dayData.temp.day,
        description: dayData.weather[0].description,
        humidity: dayData.humidity,
        windSpeed: dayData.wind_speed,
      });
    }

    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<{ currentWeather: Weather | null; forecast: Weather[] }> {
    try {

      const coordinates = await this.fetchAndDestructureLocationData(city);

      if (!coordinates) {
        console.error(`No coordinates found for city: ${city}`);
        return {
          currentWeather: null,
          forecast: [],
        };
      }

      const weatherData = await this.fetchWeatherData(coordinates);

      if (!weatherData || !weatherData.daily || weatherData.daily.length === 0) {
        console.error('No current weather data available');
        return {
          currentWeather: null,
          forecast: [],
        };
      }

      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecast = this.buildForecastArray(weatherData);

      return {
        currentWeather,
        forecast,
      };
    } catch (error) {
      console.error('Error fetching weather data for city:', error);
      return {
        currentWeather: null,  
        forecast: [],          
      };
    }
  }
}

export default new WeatherService();
