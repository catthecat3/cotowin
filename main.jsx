import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const tg = window.Telegram.WebApp;
tg.expand();

function App() {
  const [balance, setBalance] = useState(0);
  const [result, setResult] = useState(null);
  const telegramId = tg.initDataUnsafe.user?.id;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${telegramId}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance));
  }, []);

  const spin = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId })
    })
      .then(res => res.json())
      .then(data => {
        setBalance(data.newBalance);
        setResult(data.result);
      });
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>💰 Баланс: {balance}</h2>
      <button onClick={spin}>🎰 SPIN</button>
      {result && <p>{result > 0 ? `+${result} выигрыш!` : `${result} проигрыш`}</p>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);