import React, { useState, useEffect } from "react";
import CurrencySelector from "./CurrencySelector";

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  console.log(response);
  throw new Error("Request was either a 404 or a 500");
};
const json = (response) => response.json();

const DataTable = () => {
  let [amount, setAmount] = useState(1);
  let [currency1, setCurrency1] = useState("USD");
  let [conversionRates, setConversionRates] = useState({});
  let [currencies, setCurrencies] = useState({});

  useEffect(() => {
    fetch(`https://altexchangerateapi.herokuapp.com/latest`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        setCurrencies(data.rates);
      });
  }, []);

  useEffect(() => {
    fetch(`https://altexchangerateapi.herokuapp.com/latest?from=${currency1}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(typeof amount);
        setConversionRates(data.rates);
      });
  }, [currency1]);

  return (
    <div id="page-2" className="my-5 container">
      <div className="row bg-light rounded py-3">
        {/* Amount Selector */}
        <form className="row col-md-6 my-2 align-items-center">
          <label className="col-4 fw-bold text-end text-ali">Amount</label>
          <input
            className="col-8 border-0 shadow-sm"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </form>
        {/* Currency Selector */}
        <div className="row col-md-6 my-2 align-items-center">
          <div className="col-4 fw-bold text-end">Currency</div>
          <CurrencySelector
            id={currency1}
            value={currency1}
            changeCurrency={setCurrency1}
            currencies={currencies}
          />
        </div>
      </div>
      {/* Table Section */}
      <div id="table" className="row bg-light rounded py-3 my-3">
        <table className="table table-striped">
          <thead>
            <tr className="text-center">
              <th>Currency</th>
              <th>Exchange Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(conversionRates).map((rate) => {
              return (
                <tr className="text-center" key={rate[0]}>
                  <td>{rate[0]}</td>
                  <td>{(rate[1] * amount).toFixed(5) || rate[1]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
