import axios from 'axios';

export default new class CryptoDataService {
  async getMarketData() {
    return await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d');
  }
  async getNewsData() {
    return await axios.get('https://newsapi.org/v2/everything?q=crypto&sortBy=publishedAt&apiKey=0af11fce878b49a986b81ad1a90281b1');
  }
}();
