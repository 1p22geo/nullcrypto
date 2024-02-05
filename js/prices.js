window.updateHooks = [];
window.prices = {
  BTC: 0,
  ETH: 0,
  BNB: 0,
  SOL: 0,
  XRP: 0,
};
async function fetch_prices() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cbinancecoin%2Csolana%2Cripple&vs_currencies=USD",
  );
  const json = await res.json();
  window.prices.BTC = json.bitcoin.usd;
  window.prices.ETH = json.ethereum.usd;
  window.prices.BNB = json.binancecoin.usd;
  window.prices.SOL = json.solana.usd;
  window.prices.XRP = json.ripple.usd;
}

async function refresh_all(){
try {
      await fetch_prices();
      window.updateHooks.forEach((hook) => {
        hook(window.prices);
      });
    }
  catch{
    alert("Something went wrong. Propably CoinGecko rate limit.")
  }
}

async function fetch_loop() {
  while (true) {
    try {
      await fetch_prices();
      window.updateHooks.forEach((hook) => {
        hook(window.prices);
      });
    } finally {
      await new Promise((res) => {
        setTimeout(res, constants.INTERVAL);
      });
    }
  }
}
document.querySelector("#refresh").onclick = (e)=>{e.preventDefault();refresh_all()}

fetch_loop();
