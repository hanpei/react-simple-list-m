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
      <div
        style={{ background: '#eee', marginTop: '100px', textAlign: 'center' }}
      >
        <h2>demo</h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <List
          containerStyle={{
            padding: '20px',
            borderSizing: 'border-box',
            background: 'yellow',
            // height: '400px',
            // overflow: 'scroll',
          }}
          items={items}
          itemHeight={100}
          indexKey={item => item}
          loadMore={this.loadMore}
          hasMore={count <= 120}
          renderItem={item => (
            <div
              style={{
                background: '#fff',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                height: '90px',
                textAlign: 'center',
              }}
            >
              {item}
            </div>
          )}
          renderLoader={({ hasMore, loading }) => {
            if (!hasMore) {
              return <div style={{ height: '100px' }}>没有更多了</div>;
            }
            if (loading) {
              return (
                <div style={{ height: '100px', background: 'red' }}>
                  loading...
                </div>
              );
            }
            return null;
          }}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
