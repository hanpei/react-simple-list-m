import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getScrollParent, raf } from './utils';

export default class List extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    indexKey: PropTypes.func.isRequired,
    itemHeight: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.any),
    containerStyle: PropTypes.objectOf(PropTypes.any),
    loadMore: PropTypes.func,
    hasMore: PropTypes.bool,
  };

  static defaultProps = {
    itemHeight: 0,
    items: [],
    containerStyle: null,
    loadMore: undefined,
    hasMore: undefined,
  };

  state = {
    startIdx: 0,
    endIdx: 0,
    loading: false,
    contentHeight: 0,
  };

  rafUpdate = raf(this.update.bind(this))

  componentDidMount() {
    this.init();
    this.bindEvents();
  }

  componentWillReceiveProps(nextProps) {
    const { items, itemHeight } = this.props;
    const { items: nextItems } = nextProps;
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
    this.wrapEle = getScrollParent(this.contentEle);
    this.setState({ contentHeight: items.length * itemHeight });

    this.update();
  }

  bindEvents() {
    if (this.wrapEle === document.body) {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.rafUpdate);
    } else {
      this.wrapEle.addEventListener('scroll', this.handleScroll);
      this.wrapEle.addEventListener('resize', this.rafUpdate);
    }
  }

  removeEvents() {
    if (this.wrapEle === document.body) {
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.rafUpdate);
    } else {
      this.wrapEle.removeEventListener('scroll', this.handleScroll);
      this.wrapEle.removeEventListener('resize', this.rafUpdate);
    }
  }

  handleScroll = () => {
    // console.group('handleScroll');
    // console.log('handleScroll');
    // console.log('this.contentEle.clientHeight', this.contentEle.clientHeight);
    // console.log('this.contentEle.offsetTop', this.contentEle.offsetTop);
    // console.log('this.wrapEle.clientHeight', this.wrapEle.clientHeight);
    // console.log('this.wrapEle.scrollHeight', this.wrapEle.scrollHeight);
    // console.log('this.wrapEle.offsetTop', this.wrapEle.offsetTop);
    // console.log('this.wrapEle.scrollTop', this.wrapEle.scrollTop);
    // console.groupEnd();
    this.rafUpdate();
  };

  update() {
    const { items, itemHeight } = this.props;
    const { startIdx, endIdx } = this.calculate(
      this.wrapEle,
      this.contentEle,
      itemHeight,
    );
    const { startIdx: prevStartIdx, endIdx: prevEndIdx } = this.state;

    if (startIdx !== prevStartIdx || endIdx !== prevEndIdx) {
      const topOffset = startIdx * itemHeight;
      this.setState({
        topOffset,
        startIdx,
        endIdx,
      });
      // trigger loadMore
      if (endIdx === items.length) {
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

  calculate = (wrapEle, contentEle, itemHeight) => {
    const startIdx = Math.max(
      0,
      Math.floor((wrapEle.scrollTop - contentEle.offsetTop) / itemHeight),
    );
    const visibleItemsLength = Math.ceil(wrapEle.clientHeight / itemHeight);
    const endIdx = startIdx + visibleItemsLength;
    return { startIdx, endIdx };
  };

  renderFooter() {
    const { hasMore } = this.props;
    const { loading } = this.state;
    if (!hasMore) {
      return <div style={{ height: '100px' }}>没有更多了</div>;
    }
    if (loading) {
      return (
        <div style={{ height: '100px', background: 'red' }}>loading...</div>
      );
    }
    return null;
  }

  render() {
    const {
      startIdx,
      endIdx,
      topOffset,
      contentHeight,
    } = this.state;
    const {
      itemHeight,
      renderItem,
      items,
      indexKey,
      containerStyle,
    } = this.props;

    const visibleItems = items.slice(startIdx, endIdx);
    const height = `${contentHeight}px`;
    const paddingTop = `${topOffset}px`;
    const itemStyle = { height: `${itemHeight}px`, boxSizing: 'border-box' };
    return (
      <div style={{ containerStyle }}>
        <div
          ref={node => {
            this.contentEle = node;
          }}
          style={{ height, paddingTop, boxSizing: 'border-box' }}
        >
          {visibleItems.map(item => (
            <div key={indexKey(item)} style={itemStyle}>
              {renderItem(item)}
            </div>
          ))}
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}
