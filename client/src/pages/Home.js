import React from 'react';
import './Home.css';

function TestBoostrap() {
  return (
    <div className="container">
      <h1 className="text-primary">Kiinteistötietopankki DEMO</h1>
      <button className="btn btn-success">Btn</button>
    </div>
  );
}

function Home() {
  return (
    <>
    <TestBoostrap />
    </>
  );
}

export default Home;