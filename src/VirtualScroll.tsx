import React, { useRef, useState, useEffect } from "react";

export interface ScrollSettings {
  itemHeight: number;
  amount: number;
  tolerance: number;
  minIndex: number;
  maxIndex: number;
  startIndex: number;
}

interface ScrollerProps {
  settings: {
    itemHeight: number;
    amount: number;
    tolerance: number;
    minIndex: number;
    maxIndex: number;
    startIndex: number;
  };
  get: (index: number, bufferedItems: number) => any[];
  row: (data: any, index: number) => JSX.Element;
}

interface ScrollState {
  settings: {
    itemHeight: number;
    amount: number;
    tolerance: number;
    minIndex: number;
    maxIndex: number;
    startIndex: number;
  };
  viewportHeight: number;
  totalHeight: number;
  toleranceHeight: number;
  bufferHeight: number;
  bufferedItems: number;
  topPaddingHeight: number;
  bottomPaddingHeight: number;
  initialPosition: number;
  data: any[];
}

const Scroller: React.FC<ScrollerProps> = ({ settings, get, row }) => {
  const [state, setState] = useState<ScrollState>(() => {
    const { itemHeight, amount, tolerance, minIndex, maxIndex, startIndex } =
      settings;
    const viewportHeight = amount * itemHeight;
    const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
    const toleranceHeight = tolerance * itemHeight;
    const bufferHeight = viewportHeight + 2 * toleranceHeight;
    const bufferedItems = amount + 2 * tolerance;
    const itemsAbove = startIndex - tolerance - minIndex;
    const topPaddingHeight = itemsAbove * itemHeight;
    const bottomPaddingHeight = totalHeight - topPaddingHeight;
    const initialPosition = topPaddingHeight + toleranceHeight;
    return {
      settings,
      viewportHeight,
      totalHeight,
      toleranceHeight,
      bufferHeight,
      bufferedItems,
      topPaddingHeight,
      bottomPaddingHeight,
      initialPosition,
      data: [],
    };
  });

  const viewportElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportElement.current) {
      viewportElement.current.scrollTop = state.initialPosition;
      if (!state.initialPosition) {
        runScroll({ target: { scrollTop: 0 } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runScroll = ({ target: { scrollTop } }: any) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = state;
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data = get(index, bufferedItems);
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );
    setState((prevState) => ({
      ...prevState,
      topPaddingHeight,
      bottomPaddingHeight,
      data,
    }));
  };

  const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = state;

  return (
    <div
      ref={viewportElement}
      onScroll={runScroll}
      className="viewport"
      style={{ height: viewportHeight }}
    >
      <div style={{ height: topPaddingHeight }} />
      {data.map((rowData, index) => row(rowData, index))}
      <div style={{ height: bottomPaddingHeight }} />
    </div>
  );
};

export default Scroller;
