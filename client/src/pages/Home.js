import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import '../App.css';
import Searchbox from '../components/Searchbox';


function Home() {
  return (
    <div className="container mt-4">
      <h1 className="text-primary">
        Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
      </h1>

      <Searchbox></Searchbox>

      {/* Add more content below this if needed */}
    </div>
  );
}


export default Home;

