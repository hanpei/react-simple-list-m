import React, { Component } from 'react';
import { HorizontalList } from '../../src';

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

class HorizontalListDemo extends Component {
  state = { items: data, currentIndex: undefined };

  loadMore = () => {
    fakeApi(res => {
      this.setState(({ items }) => ({
        items: items.concat(res),
      }));
    });
  };

  scrollByIndex = index => {
    this.listNode.scrollByIndex(index);
  };

  render() {
    const { items, currentIndex } = this.state;
    return (
      <div
        style={{
          background: '#eee',
          marginTop: '100px',
          textAlign: 'center',
        }}
      >
        <h2>demo</h2>
        <br />
        <br />
        <br />
        <br />
        <input
          type="number"
          onChange={e => {
            this.setState({ currentIndex: e.target.value });
          }}
        />
        <button type="submit" onClick={() => this.scrollByIndex(currentIndex)}>
          scroll to
        </button>
        <br />
        <br />
        <HorizontalList
          ref={n => {
            this.listNode = n;
          }}
          containerStyle={{
            width: '100%',
            borderSizing: 'border-box',
            padding: '20px 0',
            marginBottom: '10px',
            background: '#ddd',
          }}
          items={items}
          itemWidth={100}
          indexKey={item => item}
          // loadMore={this.loadMore}
          // hasMore={count <= 120}
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
                margin: '10px',
              }}
            >
              {item}
            </div>
          )}
        />
      </div>
    );
  }
}

export default HorizontalListDemo;
