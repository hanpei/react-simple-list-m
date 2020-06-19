import React from 'react';
import { shallow, mount } from 'enzyme';

import { HorizontalList as List } from '../src';

describe('HorizontalList', () => {
  const data = (() => {
    const arr = [];
    for (let i = 0; i < 30; i += 1) {
      arr.push(i.toString());
    }
    return arr;
  })();

  it('render', () => {
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
    };
    const nextProps = {
      items: data.concat([31, 32, 33, 34]),
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
    };
    const component = shallow(<List {...props} />);
    expect(component).toMatchSnapshot();
    component.setProps(nextProps);
    expect(component).toMatchSnapshot();
    component.unmount();
    expect(component).toMatchSnapshot();
  });

  it('render loading', () => {
    const fn = jest.fn();
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      renderLoader: (state) => <div>{state.loading && 'loading...'}</div>,
      loadMore: fn,
    };
    const component = shallow(<List {...props} />);
    component.setState({
      loading: true,
    });
    expect(component).toMatchSnapshot();
  });

  it('handleLoadMore, status', () => {
    const fn = jest.fn();
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      renderLoader: (state) => <div>{state.loading && 'loading...'}</div>,
      loadMore: fn,
      hasMore: true,
    };
    const component = shallow(<List {...props} />);
    component.instance().handleLoadMore();
    expect(fn).toBeCalled();

    component.setState({ loading: true });
    component.instance().handleLoadMore();
    component.instance().handleLoadMore();
    component.instance().handleLoadMore();
    expect(fn).toHaveBeenCalledTimes(1);

    component.setState({ loading: false });
    component.instance().handleLoadMore();
    expect(fn).toHaveBeenCalledTimes(2);

    component.setState({ loading: false });
    component.setProps({ hasMore: false });
    component.instance().handleLoadMore();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('handleLoadMore, scroll down to trigger', () => {
    const fn = jest.fn();
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      renderLoader: (state) => <div>{state.loading && 'loading...'}</div>,
      loadMore: fn,
      hasMore: true,
    };

    const component = shallow(<List {...props} />);
    const spy = jest.spyOn(component.instance(), 'handleLoadMore');
    window.scrollLeft = 2000;
    component.instance().update();
    expect(spy).toBeCalled();
  });

  it('update', () => {
    const fn = jest.fn();
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      renderLoader: (state) => <div>{state.loading && 'loading...'}</div>,
      loadMore: fn,
      hasMore: true,
    };
    const component = shallow(<List {...props} />);
    const spy = jest.spyOn(component.instance(), 'rafUpdate');
    component.instance().handleScroll();
    expect(spy).toBeCalled();
  });

  it('mount in container', () => {
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      containerStyle: {
        padding: '20px',
        borderSizing: 'border-box',
        background: 'yellow',
        height: '400px',
        overflowY: 'scroll',
      },
    };
    const component = mount(<List {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('mount document body', () => {
    const fn = jest.fn();
    const props = {
      items: data,
      itemWidth: 60,
      indexKey: (item) => Number(item),
      renderItem: (item) => <div>{item.toString()}</div>,
      renderLoader: (state) => <div>{state.loading && 'loading...'}</div>,
      loadMore: fn,
      hasMore: true,
    };

    const component = mount(<List {...props} />);
    expect(component).toMatchSnapshot();

    // scrolling
    window.scrollLeft = 2000;
    component.instance().update();
    expect(component).toMatchSnapshot();
  });
});
