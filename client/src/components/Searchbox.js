// import { Navbar, Nav } from 'react-bootstrap';  // Importing the necessary Bootstrap components
import { useState } from 'react';
import '../App.css';

function Searchbox() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
      console.log("Searching for:", searchQuery);
      // Perform search logic here, e.g., filter a list or call an API
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSearch(); // Trigger search on Enter key
        }
      };

    return (
        <div className="mt-4">
            
            {/* Search Form with original Bootstrap classes */}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Hae kiinteistötunnuksella..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}  // Trigger search on Enter key
                    aria-label="Search"
                    aria-describedby="button-addon2"
                />
                <button
                    className="btn btn-outline-secondary"
                    onClick={handleSearch}
                    id="button-addon2"
                >
                    Search
                </button>
            </div>
        </div>
    );
}

export default Searchbox;