import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './crypto_tracker.css';

const CryptoTracker = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      TI_API_KEY: '924d2537a5c94398bd6f25fe049c42ed'
    }
  };

  useEffect(() => {
    fetchCryptos();
  }, []);

  // Fetch all coins once when the page loads
  const fetchCryptos = async () => {
    try {
      const response = await fetch('https://api.tokeninsight.com/api/v1/coins/list', options);
      const data = await response.json();
      setCryptos(data.data.items);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle the actual search and display the filtered coins
  const handleSearch = () => {
    // Search by coin ID (or any other parameter you want to search)
    const filtered = cryptos.filter(crypto => 
      crypto.id.toString().includes(searchTerm.toLowerCase()) // search based on the coin id
    );
    setCryptos(filtered);
  };

  // Reset search to show all coins again
  const handleReset = () => {
    setSearchTerm('');
    fetchCryptos();  // Reset to show all coins again
  };

  const fetchCryptoDetails = async (cryptoId) => {
    try {
      const response = await fetch(`https://api.tokeninsight.com/api/v1/coins/${cryptoId}`, options);
      const data = await response.json();
      setSelectedCrypto(data.data);
    } catch (err) {
      console.error('Error fetching crypto details:', err);
    }
  };

  const addToPortfolio = (crypto) => {
    const quantity = prompt("Please Enter the Quantity You Have:");
    if (quantity) {
      alert(`Added ${quantity} ${crypto.symbol} to portfolio`);
    }
  };

  // If a user has selected a coin, show its details
  if (selectedCrypto) {
    return (
      <div className="details-container">
        <button
          onClick={() => setSelectedCrypto(null)}
          className="back-button"
        >
          Back to List
        </button>
        <div>
          <img
            src={selectedCrypto.logo}
            alt={`${selectedCrypto.name} logo`}
            className="crypto-logo centered-logo"
          />
          <>
            <h1>{selectedCrypto.name} ({selectedCrypto.symbol})</h1>
            <h1>Rank: {selectedCrypto.rank}</h1>
            <h1>Rating: {selectedCrypto.rating?.rating}</h1>
            <h1>Last Update: {selectedCrypto.rating?.update_date &&
              new Date(selectedCrypto.rating.update_date).toLocaleDateString()}</h1>
            <h2 id="description">Description:</h2>
            <h3 id="description">{selectedCrypto.localization[1].description}</h3>
          </>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Crypto Tracker</h1>
        <div className="button-group">
          <button className="btn btn-green"
            onClick={() => navigate('/top-gainers')}>Top Gainers</button>
          <button className="btn btn-red" onClick={() => navigate('/top-looers')}>Top Losers</button>
          <button className="btn btn-blue" onClick={() => navigate('/newly-listed')}>New Listings</button>
          <button className="btn btn-purple">My Portfolio</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Coin ID..."
            onChange={handleSearchChange}
            value={searchTerm}
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-green">Search</button>
          <button onClick={handleReset} className="btn btn-purple">Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="crypto-container">
          {cryptos.length > 0 ? (
            cryptos.map(crypto => (
              <div key={crypto.id} className="crypto-card">
                <img
                  src={crypto.logo}
                  alt={`${crypto.name} logo`}
                  className="crypto-logo"
                />
                <div className="crypto-name">{crypto.name}</div>
                <div className="crypto-symbol">{crypto.symbol}</div>
                <div className="crypto-price">${crypto.price ? crypto.price.toFixed(2) : 'N/A'}</div>
                <div className="crypto-volume">
                  24h Volume: ${crypto.spot_volume_24h ? crypto.spot_volume_24h.toFixed(2) : 'N/A'}
                </div>
                <div className={`crypto-change ${crypto.price_change_percentage_24h < 0 ? 'negative' : ''}`}>
                  Change (24h): {crypto.price_change_percentage_24h ? crypto.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                </div>
                <div className="button-container">
                  <button
                    onClick={() => window.open(crypto.url, '_blank')}
                    className="btn btn-blue"
                  >
                    More Info
                  </button>
                  <button
                    onClick={() => fetchCryptoDetails(crypto.id)}
                    className="btn btn-green"
                  >
                    View Details
                  </button>
                
                </div>
              </div>
            ))
          ) : (
            <div>No coins found matching your search criteria</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoTracker;
