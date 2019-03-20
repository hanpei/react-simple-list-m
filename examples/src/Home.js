import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line

const Home = () => (
  <div>
    <h2>Demo</h2>
    <ul>
      <li>
        <Link to="/list">List Demo</Link>
      </li>
      <li>
        <Link to="/horizontal-list">Horizontal List Demo</Link>
      </li>
    </ul>
  </div>
  );

export default Home;
