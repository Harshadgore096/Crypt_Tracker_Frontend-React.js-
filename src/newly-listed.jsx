import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './crypto_tracker.css';

const NewListed = () => {
  const [newListed, setNewListed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      TI_API_KEY: '924d2537a5c94398bd6f25fe049c42ed'
    }
  };

  // Fetch newly listed coins
  useEffect(() => {
    fetchNewListed();
  }, []);

  const fetchNewListed = async () => {
    try {
      const response = await fetch('https://api.tokeninsight.com/api/v1/coins/list/newly-listed', options);
      const data = await response.json();
      setNewListed(data.data.items || []);  // Ensure we access `data.items` as in the first code
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Newly Listed:', err);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>Newly Listed</h1>
          <button 
            onClick={handleBack}
            className="btn btn-blue"
          >
            Back to Main
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="crypto-container">
          {newListed.length === 0 ? (
            <div>No newly listed coins available.</div>
          ) : (
            newListed.map(coin => (
              <div key={coin.id} className="crypto-card">
                <img 
                  src={coin.logo} 
                  alt={`${coin.name} Logo`} 
                  className="crypto-logo"
                />
                <div className="crypto-name">{coin.name}</div>
                <div className="crypto-symbol">{coin.symbol}</div>
                <div className="crypto-price">Price: ${coin.price?.toFixed(8)}</div>
                <div className="listing-time">
                  Listing Time: {new Date(coin.listing_time).toLocaleString()}
                </div>
                <div className="spot-volume">
                  24h Spot Volume: ${coin.spot_volume_24h?.toFixed(2)}
                </div>
                
                <div className="button-container">
                  <button
                    onClick={() => window.open(coin.url, '_blank')}
                    className="btn btn-blue"
                  >
                    More Info
                  </button>
                  <button
                    onClick={() => navigate(`/details/${coin.id}`)}
                    className="btn btn-green"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NewListed;
