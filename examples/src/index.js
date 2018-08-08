import React, { Component } from 'react';
import { render } from 'react-dom';
import List from '../../src';

const itemsArr = (() => {
  const arr = [];
  for (let i = 0; i < 1000; i += 1) {
    arr.push(i.toString());
  }
  return arr;
})();

const fakeApi = callbak => {
  setTimeout(() => {
    const result = itemsArr;
    const last = Number(itemsArr[itemsArr.length - 1]);
    for (let i = 1; i <= 10; i += 1) {
      result.push((last + i).toString());
    }
    callbak(result);
  }, 2000);
};

class App extends Component {
  state = { items: itemsArr };

  loadMore = () => {
    fakeApi(res => {
      this.setState({ items: res });
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
