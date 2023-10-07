// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState(10);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [error, setError] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    async function fetchRate() {
      try {
        setError("");
        const res = await fetch(
          `https:/api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );
        if (res.ok === false) {
          throw new Error("Something went wrong fetching");
        }
        const data = await res.json();
        
        setRate(data.rates[to]);
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    }
    fetchRate();
  }, [amount, from, to]);

  return (
    <div>
      <Amount amount={amount} onHandleChange={setAmount} />
      <Select currency={from} setCurrency={setFrom} />
      <Select currency={to} setCurrency={setTo} />
      {!error ? <Output rate={rate} to={to} /> : <Error error={error} />}
    </div>
  );
}

function Amount({ amount, onHandleChange }) {
  function handleChange(e) {
    onHandleChange(e.target.value);
  }
  return <input type="number" value={amount} onChange={handleChange} />;
}

function Select({ currency, setCurrency }) {
  return (
    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="CAD">CAD</option>
      <option value="INR">INR</option>
    </select>
  );
}

function Output({ rate, to }) {
  return (
    <p>
      {rate} {to}
    </p>
  );
}

function Error({ error }) {
  return <p>{error}</p>;
}
