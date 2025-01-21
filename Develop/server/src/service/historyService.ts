import fs from 'fs';
import path from 'path';

const SEARCH_HISTORY_PATH = path.join(__dirname, 'searchHistory.json');

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name:string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
   // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(SEARCH_HISTORY_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading the search hisroty file:', error);
      return [];
    }
   }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(SEARCH_HISTORY_PATH, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to the search history file:', error);
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const id = `${Date.now()}`;
    const newCity = new City(id, city);
    cities.push(newCity);
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id ! == id);
    await this.write(cities);
  }
}

export default new HistoryService();
