import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react"; // ✅ Import useState and useEffect
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ fullData, type }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (fullData && fullData.length > 0) {
      const months = fullData.map((item) => item.month);
      const data = fullData.map(
        (item) => item.totalSales || item.totalPurchases
      );

      setChartData({
        labels: months,
        datasets: [
          {
            label: type,
            data: data,
            borderColor: type === "Monthly Sales" ? "blue" : "green", // Different color for Sales & Purchases
            backgroundColor:
              type === "Monthly Sales"
                ? "rgba(0, 0, 255, 0.1)"
                : "rgba(0, 128, 0, 0.1)",
            fill: true,
          },
        ],
      });
    }
  }, [fullData, type]); // ✅ Update when fullData or type changes

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full">
      {chartData.datasets.length > 0 ? (
        <Line options={options} data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default LineGraph;
