window.holdings = {
  cash: 500,
  BTC: 0,
  ETH: 0,
  BNB: 0,
  SOL: 0,
  XRP: 0,
};
if (window.localStorage.getItem("save")) {
  window.holdings = JSON.parse(atob(window.localStorage.getItem("save")));
}

function updateData(prices) {
  for (let key in window.holdings) {
    window.holdings[key] = +window.holdings[key].toPrecision(5);
  }
  document.querySelector("#cash").textContent = window.holdings.cash;
  let all = window.holdings.cash;
  for (let key in window.prices) {
    all += window.holdings[key] * window.prices[key];
  }

  document.querySelector("#all").textContent = all.toPrecision(5);
  document.querySelector("#btc_price").textContent = prices.BTC;
  document.querySelector("#eth_price").textContent = prices.ETH;
  document.querySelector("#bnb_price").textContent = prices.BNB;
  document.querySelector("#sol_price").textContent = prices.SOL;
  document.querySelector("#xrp_price").textContent = prices.XRP;

  document.querySelector("#btc_holdings").textContent = window.holdings.BTC;
  document.querySelector("#eth_holdings").textContent = window.holdings.ETH;
  document.querySelector("#bnb_holdings").textContent = window.holdings.BNB;
  document.querySelector("#sol_holdings").textContent = window.holdings.SOL;
  document.querySelector("#xrp_holdings").textContent = window.holdings.XRP;

  document.querySelector("#btc_value").textContent =
    (window.holdings.BTC * prices.BTC).toPrecision(5);
  document.querySelector("#eth_value").textContent =
    (window.holdings.ETH * prices.ETH).toPrecision(5);
  document.querySelector("#bnb_value").textContent =
    (window.holdings.BNB * prices.BNB).toPrecision(5);
  document.querySelector("#sol_value").textContent =
    (window.holdings.SOL * prices.SOL).toPrecision(5);
  document.querySelector("#xrp_value").textContent =
    (window.holdings.XRP * prices.XRP).toPrecision(5);

  window.localStorage.setItem("save", btoa(JSON.stringify(window.holdings)));
}

window.updateHooks.push(updateData);

async function update_before_transaction(type, currency) {
  document.querySelector("#cancel").onclick = () => {
    document.querySelector("#trade").close();
  };
  document.querySelector("#confirm").onclick = async () => {
    switch (type) {
      case "BUY": {
        if (window.holdings.cash < +document.querySelector("#price").value) {
          alert("Not enough money (USD)");
          document.querySelector("#price").value =
            window.holdings.cash.toString();
          document.querySelector("#amount").value = (
            +document.querySelector("#price").value / window.prices[currency]
          ).toPrecision(5);

          return;
        }
        window.holdings.cash -= +document.querySelector("#price").value;
        window.holdings[currency] += +document.querySelector("#amount").value;
        break;
      }
      case "SELL": {
        if (
          window.holdings[currency] < +document.querySelector("#amount").value
        ) {
          alert(`Not enough ${currency}`);
          document.querySelector("#amount").value = window.holdings[currency];
          document.querySelector("#price").value =
            +document.querySelector("#amount").value * window.prices[currency];

          return;
        }
        window.holdings.cash +=
          +document.querySelector("#amount").value * window.prices[currency];
        window.holdings[currency] -= +document.querySelector("#amount").value;
        break;
      }
      default:
        break;
    }
    updateData(window.prices);
    document.querySelector("#trade").close();
  };
  document.querySelector("#operation").textContent = type;
  document.querySelector("#currency").textContent = currency;
  document.querySelector("#amount").onchange = () => {
    document.querySelector("#price").value = (
      +document.querySelector("#amount").value * window.prices[currency]
    ).toPrecision(5);
  };
  document.querySelector("#price").onchange = () => {
    document.querySelector("#amount").value = (
      +document.querySelector("#price").value / window.prices[currency]
    ).toPrecision(5);
  };
  document.querySelector("#trade").showModal();
}
document.querySelector("#btc_buy").onclick = () => {
  update_before_transaction("BUY", "BTC");
};
document.querySelector("#btc_sel").onclick = () => {
  update_before_transaction("SELL", "BTC");
};
document.querySelector("#eth_buy").onclick = () => {
  update_before_transaction("BUY", "ETH");
};
document.querySelector("#eth_sel").onclick = () => {
  update_before_transaction("SELL", "ETH");
};
document.querySelector("#bnb_buy").onclick = () => {
  update_before_transaction("BUY", "BNB");
};
document.querySelector("#bnb_sel").onclick = () => {
  update_before_transaction("SELL", "BNB");
};
document.querySelector("#sol_buy").onclick = () => {
  update_before_transaction("BUY", "SOL");
};
document.querySelector("#sol_sel").onclick = () => {
  update_before_transaction("SELL", "SOL");
};
document.querySelector("#xrp_buy").onclick = () => {
  update_before_transaction("BUY", "XRP");
};
document.querySelector("#xrp_sel").onclick = () => {
  update_before_transaction("SELL", "XRP");
};
