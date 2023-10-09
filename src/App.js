// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
import { useState, useEffect } from "react";

export default function App() {
  const [amount, setAmount] = useState(10);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState("");

  useEffect(() => {
    async function fetchRate() {
      setIsLoading(true);
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
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred");
        setIsLoading(false);
      }
    }
    fetchRate();
  }, [amount, from, to]);

  return (
    <div>
      <Amount
        amount={amount}
        onHandleChange={setAmount}
        isLoading={isLoading}
      />
      <Select currency={from} setCurrency={setFrom} isLoading={isLoading} />
      <Select currency={to} setCurrency={setTo} isLoading={isLoading} />
      {error && <Error error={error} />}
      {isLoading && <p>Loading...</p>}
      {!error && !isLoading && <Output rate={rate} to={to} />}
    </div>
  );
}

function Amount({ amount, onHandleChange, isLoading }) {
  function handleChange(e) {
    onHandleChange(e.target.value);
  }
  return (
    <input
      type="number"
      value={amount}
      onChange={handleChange}
    />
  );
}

function Select({ currency, setCurrency, isLoading }) {
  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      disabled={isLoading}
    >
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
