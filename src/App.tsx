import "./App.css";
import VirtualScroll, { ScrollSettings } from "./VirtualScroll";

interface Item {
  index: number;
  text: string;
}

const SETTINGS: ScrollSettings = {
  itemHeight: 20,
  amount: 15,
  tolerance: 5,
  minIndex: 1,
  maxIndex: 250000,
  startIndex: 1,
};

function App() {
  const getData = (offset: number, limit: number): Item[] => {
    const data: Item[] = [];
    const start = Math.max(SETTINGS.minIndex, offset);
    const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
    console.log(
      `request [${offset}..${offset + limit - 1}] -> [${start}..${end}] items`
    );
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push({ index: i, text: `item ${i}` });
      }
    }
    console.log("data", data);

    return data;
  };

  const rowTemplate = (item: Item) => (
    <div className="item" key={item.index}>
      {item.text}
    </div>
  );

  return (
    <div className="App">
      <VirtualScroll get={getData} settings={SETTINGS} row={rowTemplate} />
    </div>
  );
}

export default App;
