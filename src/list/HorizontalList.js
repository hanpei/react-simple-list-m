import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getScrollParent, raf as rafThrottle } from './utils';
import HorizontalVirtualList from './virtualHorizontalList';

export default class HorizontalList extends Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    indexKey: PropTypes.func.isRequired,
    itemWidth: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    containerStyle: PropTypes.objectOf(PropTypes.any),
    loadMore: PropTypes.func,
    hasMore: PropTypes.bool,
    renderLoader: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    itemWidth: 0,
    containerStyle: null,
    loadMore: undefined,
    hasMore: undefined,
    renderLoader: undefined,
    className: undefined,
  };

  constructor() {
    super();
    this.state = {
      startIdx: 0,
      endIdx: 0,
      loading: false,
      contentWidth: 0,
      leftOffset: 0,
    };
    this.update = this.update.bind(this);
    this.rafUpdate = rafThrottle(this.update);
  }

  // rafUpdate = rafThrottle(this.update.bind(this));

  componentDidMount() {
    this.init();
    this.bindEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, itemWidth } = prevProps;
    const { items: nextItems } = this.props;
    // after loadMore, items changed
    if (items.length !== nextItems.length) {
      const contentWidth = nextItems.length * itemWidth;
      this.setState({ loading: false, contentWidth });
    }
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  init() {
    const { itemWidth, items } = this.props;
    this.wrapNode = getScrollParent(this.contentEle);
    // console.log(this.wrapNode);
    if (this.wrapNode === document.body || !this.wrapNode) {
      this.wrapNode = window;
    }
    this.setState({ contentWidth: items.length * itemWidth });
    this.list = new HorizontalVirtualList({
      wrapEle: this.wrapNode,
      contentEle: this.contentEle,
      items,
      itemWidth,
    });

    this.update();
  }

  bindEvents() {
    this.wrapNode.addEventListener('scroll', this.rafUpdate);
    this.wrapNode.addEventListener('resize', this.rafUpdate);
  }

  removeEvents() {
    this.wrapNode.removeEventListener('scroll', this.rafUpdate);
    this.wrapNode.removeEventListener('resize', this.rafUpdate);
  }

  handleScroll = () => {
    this.rafUpdate();
  };

  scrollByIndex = index => {
    const { itemWidth } = this.props;
    const width = this.wrapNode.clientWidth || this.wrapNode.innerWidth;
    const left = itemWidth * index - width / 2;
    this.left = left;
    // this.wrapNode.scrollLeft = left;
    this.scrollLeftTo(this.wrapNode, left, 200);
  };

  scrollLeftTo = (element, pos, duration) => {
    const node = element;
    const currentPos = node.scrollLeft;
    let start = null;
    const time = duration || 500;
    window.requestAnimationFrame(function step(currentTime) {
      start = !start ? currentTime : start;
      if (currentPos < pos) {
        const progress = currentTime - start;
        node.scrollLeft = ((pos - currentPos) * progress) / time + currentPos;
        if (progress < time) {
          window.requestAnimationFrame(step);
        } else {
          node.scrollLeft = pos;
        }
      } else {
        const progress = currentTime - start;
        node.scrollLeft = currentPos - ((currentPos - pos) * progress) / time;
        if (progress < time) {
          window.requestAnimationFrame(step);
        } else {
          node.scrollLeft = pos;
        }
      }
    });
  };

  update() {
    const { items, itemWidth } = this.props;
    // update starIdx endIdx when scrolling
    const { startIdx, endIdx } = this.list.getVisibleIndex();
    const { startIdx: prevStartIdx, endIdx: prevEndIdx } = this.state;
    if (startIdx !== prevStartIdx || endIdx !== prevEndIdx) {
      const leftOffset = startIdx * itemWidth;
      this.setState({
        leftOffset,
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
    const { loading, startIdx, endIdx, leftOffset, contentWidth } = this.state;
    const {
      className,
      itemWidth,
      renderItem,
      items,
      indexKey,
      containerStyle,
      hasMore,
      renderLoader,
    } = this.props;

    const visibleItems = items.slice(startIdx, endIdx + 1);
    const width = `${contentWidth}px`;
    const paddingLeft = `${leftOffset}px`;
    const itemStyle = { width: `${itemWidth}px`, boxSizing: 'border-box' };
    return (
      <div
        className={className}
        style={{ width: '100%', overflowX: 'scroll', ...containerStyle }}
      >
        <div
          ref={node => {
            this.contentEle = node;
          }}
          style={{
            width,
            paddingLeft,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={indexKey(item)} style={itemStyle}>
              {renderItem(item, startIdx + index)}
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
