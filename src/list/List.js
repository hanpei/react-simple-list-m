import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getScrollParent, raf as rafThrottle } from './utils';
import VirtualList from './virtualList';

export default class List extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    indexKey: PropTypes.func.isRequired,
    itemHeight: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    containerStyle: PropTypes.objectOf(PropTypes.any),
    loadMore: PropTypes.func,
    hasMore: PropTypes.bool,
    renderLoader: PropTypes.func,
  };

  static defaultProps = {
    itemHeight: 0,
    containerStyle: null,
    loadMore: undefined,
    hasMore: undefined,
    renderLoader: undefined,
  };

  state = {
    startIdx: 0,
    endIdx: 0,
    loading: false,
    contentHeight: 0,
    topOffset: 0,
  };

  componentDidMount() {
    this.init();
    this.bindEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, itemHeight } = prevProps;
    const { items: nextItems } = this.props;
    // after loadMore, items changed
    if (items.length !== nextItems.length) {
      const contentHeight = nextItems.length * itemHeight;
      this.setState({ loading: false, contentHeight });
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  init() {
    const { itemHeight, items } = this.props;
    this.wrapNode = getScrollParent(this.contentEle);
    if (this.wrapNode === document.body || !this.wrapNode) {
      this.wrapNode = window;
    }
    this.setState({ contentHeight: items.length * itemHeight });
    this.list = new VirtualList({
      wrapEle: this.wrapNode,
      contentEle: this.contentEle,
      items,
      itemHeight,
    });

    this.update();
  }

  bindEvents() {
    this.wrapNode.addEventListener('scroll', this.handleScroll);
    this.wrapNode.addEventListener('resize', this.rafUpdate);
  }

  removeEvents() {
    this.wrapNode.removeEventListener('scroll', this.handleScroll);
    this.wrapNode.removeEventListener('resize', this.rafUpdate);
  }

  handleScroll = () => {
    // console.group('handleScroll');
    // console.log('handleScroll');
    // console.log('this.contentEle.clientHeight', this.contentEle.clientHeight);
    // console.log('this.contentEle.offsetTop', this.contentEle.offsetTop);
    // console.log('this.wrapNode.clientHeight', this.wrapNode.clientHeight);
    // console.log('this.wrapNode.scrollHeight', this.wrapNode.scrollHeight);
    // console.log('this.wrapNode.offsetTop', this.wrapNode.offsetTop);
    // console.log('this.wrapNode.scrollTop', this.wrapNode.scrollTop);
    // console.groupEnd();
    this.rafUpdate();
  };

  rafUpdate = rafThrottle(this.update);

  update() {
    const { items, itemHeight } = this.props;
    // update starIdx endIdx when scrolling
    const { startIdx, endIdx } = this.list.getVisibleIndex();
    const { startIdx: prevStartIdx, endIdx: prevEndIdx } = this.state;
    if (startIdx !== prevStartIdx || endIdx !== prevEndIdx) {
      const topOffset = startIdx * itemHeight;
      this.setState({
        topOffset,
        startIdx,
        endIdx,
      });
      // trigger loadMore
      if (endIdx >= items.length - 1) {
        this.handleLoadMore();
      }
    }
  }

  handleLoadMore = () => {
    const { loading } = this.state;
    const { loadMore, hasMore } = this.props;
    if (loading) {
      return;
    }
    if (hasMore && loadMore && typeof loadMore === 'function') {
      this.setState({ loading: true });
      loadMore();
    }
  };

  render() {
    const { loading, startIdx, endIdx, topOffset, contentHeight } = this.state;
    const {
      itemHeight,
      renderItem,
      items,
      indexKey,
      containerStyle,
      hasMore,
      renderLoader,
    } = this.props;

    const visibleItems = items.slice(startIdx, endIdx + 1);
    const height = `${contentHeight}px`;
    const paddingTop = `${topOffset}px`;
    const itemStyle = { height: `${itemHeight}px`, boxSizing: 'border-box' };
    return (
      <div style={containerStyle}>
        <div
          ref={(node) => {
            this.contentEle = node;
          }}
          style={{ height, paddingTop, boxSizing: 'border-box' }}
        >
          {visibleItems.map((item) => (
            <div key={indexKey(item)} style={itemStyle}>
              {renderItem(item)}
            </div>
          ))}
        </div>
        {renderLoader &&
          typeof renderLoader === 'function' &&
          renderLoader({ hasMore, loading })}
      </div>
    );
  }
}
