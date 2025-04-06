// Searchbox.js
import React, { useState } from 'react';

function Searchbox({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    onSearch(searchQuery); // Pass the search query to the parent
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  return (
    <div className="mt-4">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Hae kiinteistötunnuksella..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          aria-describedby="button-addon2"
        />
        <button
          className="btn btn-outline-secondary"
          onClick={handleSearch}
          id="button-addon2"
        >
          Hae
        </button>
      </div>
    </div>
  );
}

export default Searchbox;