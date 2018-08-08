import React, { Component } from 'react';
import { render } from 'react-dom';
import List from '../../src';

const data = (() => {
  const arr = [];
  for (let i = 0; i < 30; i += 1) {
    arr.push(i.toString());
  }
  return arr;
})();

let count = 30;
const fakeApi = callbak => {
  setTimeout(() => {
    const result = [];
    const last = count;
    for (let i = 0; i < 30; i += 1) {
      result.push((last + i).toString());
    }
    count += 30;
    callbak(result);
  }, 2000);
};

class App extends Component {
  state = { items: data };

  loadMore = () => {
    fakeApi(res => {
      this.setState(({ items }) => ({
        items: items.concat(res),
      }));
    });
  };

  render() {
    const { items } = this.state;
    return (
      <div style={{ background: '#eee', marginTop: '100px' }}>
        <h2>demo</h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <List
          containerStyle={{ padding: '20px', background: 'yellow' }}
          items={items}
          itemHeight={100}
          indexKey={item => item}
          loadMore={this.loadMore}
          hasMore={count <= 120}
          renderItem={item => (
            <div style={{ background: '#fff', height: '90px' }} key={item}>
              {item}
            </div>
          )}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
