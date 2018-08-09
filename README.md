# react-simple-list-m

## react mobile list, virtual list, infinite list, load more

[![Build Status](https://travis-ci.org/hanpei/react-simple-list-m.svg?branch=master)](https://travis-ci.org/hanpei/react-simple-list-m)
[![codecov](https://codecov.io/gh/hanpei/react-simple-list-m/branch/master/graph/badge.svg)](https://codecov.io/gh/hanpei/react-simple-list-m)

## Demo online
- [Demo online](https://hanpei.github.io/react-simple-list-m/)

## install
```
npm install --save react-simple-list-m
```

## example

```js
import List from 'react-simple-list-m'

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
        <List
          containerStyle={{
            padding: '20px',
            borderSizing: 'border-box',
            background: 'yellow',
            // scrollable container
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

```