export type ChartData = {
  label: string;
  value: number;
};

function getMaxValue(data: ChartData[]): number {
  let max = 1;
  for (const item of data) {
    if (item.value > max) {
      max = item.value;
    }
  }
  return max;
}

function getTotalValue(data: ChartData[]): number {
  let total = 0;
  for (const item of data) {
    total += item.value;
  }
  return total;
}

function getStartValue(
  data: ChartData[],
  currentIndex: number,
  totalValue: number,
): number {
  if (totalValue === 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < currentIndex; i++) {
    sum += data[i].value;
  }
  return sum / totalValue;
}

function getEndValue(
  data: ChartData[],
  currentIndex: number,
  totalValue: number,
): number {
  if (totalValue === 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i <= currentIndex; i++) {
    sum += data[i].value;
  }
  return sum / totalValue;
}

export function BarChart({
  data,
  colors,
  title,
}: {
  data: ChartData[];
  colors: string[];
  title: string;
}) {
  const maxValue = getMaxValue(data);

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-4">
        <h3 class="card-title text-sm text-base-content mb-4">{title}</h3>
        <div
          class="grid gap-4"
          style={`grid-template-columns: repeat(${data.length}, 1fr);`}
        >
          {data.map((item, i) => (
            <BarChartItem
              item={item}
              color={colors[i % colors.length]}
              maxValue={maxValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChartItem({
  item,
  color,
  maxValue,
}: {
  item: ChartData;
  color: string;
  maxValue: number;
}) {
  return (
    <div class="flex flex-col items-center gap-2">
      <div class="w-full flex flex-col justify-end" style="height: 150px;">
        {maxValue > 0 && (
          <div
            class="w-full rounded-t transition-all duration-500 ease-out"
            style={`height: ${(item.value * 100) / maxValue}%; background-color: ${color};`}
          >
            <div class="text-xs text-white font-semibold text-center pt-1">
              {item.value}
            </div>
          </div>
        )}
      </div>
      <div class="text-xs text-base-content text-center font-medium pt-3">
        {item.label}
      </div>
    </div>
  );
}

export function PieChart({
  data,
  colors,
  title,
}: {
  data: ChartData[];
  colors: string[];
  title: string;
}) {
  const totalValue = getTotalValue(data);

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-4 flex flex-col items-center">
        <h3 class="card-title text-sm text-base-content mb-2 w-full">
          {title}
        </h3>
        <table
          class="charts-css pie mx-auto mb-3"
          style="height: 120px; width: 120px; --labels-size: 0;"
        >
          <tbody>
            {data.map((item, i) => (
              <PieChartSlice
                item={item}
                index={i}
                allData={data}
                colors={colors}
                totalValue={totalValue}
              />
            ))}
          </tbody>
        </table>
        <div class="flex flex-col gap-1 w-full">
          {data.map((item, i) => (
            <PieChartLegendItem
              item={item}
              color={colors[i % colors.length]}
              totalValue={totalValue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PieChartSlice({
  item,
  index,
  allData,
  colors,
  totalValue,
}: {
  item: ChartData;
  index: number;
  allData: ChartData[];
  colors: string[];
  totalValue: number;
}) {
  const startValue = getStartValue(allData, index, totalValue);
  const endValue = getEndValue(allData, index, totalValue);
  const color = colors[index % colors.length];

  return (
    <tr>
      <td
        style={`--start: ${startValue}; --end: ${endValue}; --color: ${color};`}
      />
    </tr>
  );
}

function PieChartLegendItem({
  item,
  color,
  totalValue,
}: {
  item: ChartData;
  color: string;
  totalValue: number;
}) {
  const percentage =
    totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(0) : 0;

  return (
    <div class="flex items-center gap-2 justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-2.5 h-2.5 rounded-sm flex-shrink-0"
          style={`background-color: ${color};`}
        />
        <span class="text-xs text-base-content">{item.label}</span>
      </div>
      <span class="text-xs font-semibold text-base-content">{percentage}%</span>
    </div>
  );
}
