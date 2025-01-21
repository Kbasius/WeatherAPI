import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    // TODO: GET weather data from city name
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // TODO: save city to search history
    await HistoryService.addCity(cityName);

    return res.status(200).json(weatherData);
  } catch (error: unknown) {
    
    if (error instanceof Error) {
      console.error('Error fetching weather data:', error.message);  
    } else {
      
      console.error('Unknown error occurred:', error);
    }

    console.error('Error in POST /api/weather:', error);

    
    return res.status(500).json({ error: 'Could not retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Could not retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    return res.status(500).json({ error: 'Could not remove city from search history' });
  }
});

export default router;
