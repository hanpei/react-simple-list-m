import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'; // eslint-disable-line
import Home from './Home';
import ListDemo from './ListDemo'
import HorizontalListDemo from './HorizontalListDemo'

import styles from './index.css';

function App() {
  return (
    <div className={styles.container}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={ListDemo} />
          <Route path="/horizontal-list" component={HorizontalListDemo} />
        </Switch>
      </Router>
    </div>
  );
}

render(<App />, document.getElementById('root'));
