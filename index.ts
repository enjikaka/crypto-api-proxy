import { config, serve, ServerRequest } from './mod.ts';

const env = config();
const port = parseInt(env.PORT, 10) || 5000;
const server = serve({ port });

console.log(`
  🪙  Crypto API Proxy 🪙

  Running on port ${port}.

  Example links:
    - http://localhost:5000/XLM/SEK
    - http://localhost:5000/ETH/EUR
    - http://localhost:5000/USD/NOK
`);

function reqToURL (req: ServerRequest) {
  const base = req.conn.localAddr.transport === 'tcp' ? req.conn.localAddr.hostname : 'localhost';

  return new URL(req.url, 'http://' + base);
}

async function cryptoToCurrency (ticker = 'BTC', currency = 'SEK') {
  const apiKey = env.API_KEY;
  const url = 'https://min-api.cryptocompare.com/data/price?api_key=' + apiKey + '&fsym=' + ticker + '&tsyms=' + currency;

  const response = await fetch(url);
  const text = await response.text();

  return text;
}

for await (const req of server) {
  const [, ticker, fiat] = reqToURL(req).pathname.split('/');

  if (ticker && fiat) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    req.respond({ body: await cryptoToCurrency(ticker, fiat), headers, status: 200 });
  } else {
    req.respond({ body: 'Not Found', status: 404 });
  }
}
