import React from 'react';
import Badge from 'react-bootstrap/Badge';
import '../App.css';


function Home() {
  return (
    <div className="container">
      <h1 className='text-primary'>Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge></h1>
      <h2 className='text-secondary'>Kiinteistöhaku</h2>
    </div>
  );
}


export default Home;

