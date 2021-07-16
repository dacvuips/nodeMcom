import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDashboardContext } from "../provider/dashboard-privder";

export function Chart(props) {
  const { selectedTime } = props;
  const { dataChart, loadReportChart, getDate } = useDashboardContext();
  console.log("dataChart", dataChart, selectedTime);
  const labels = [],
    data = [0, 20, 20, 60, 60, 120, 12, 180, 120, 125, 105, 110, 170];
  for (let i = 0; i < 12; ++i) {
    labels.push(i.toString());
  }
  const [lineChartData, setLineChartData] = useState({
    align: "left",
    datasets: [
      {
        data: data,
        borderColor: ["rgba(13, 87, 239)"],
        borderWidth: 2,
        backgroundColor: "rgba(13, 87, 239, 0.0)",
        label: "Tăng trưởng",
      },
    ],
    labels: labels,
  });
  const [barChartData, setBarChartData] = useState({
    align: "left",
    datasets: [
      {
        data: data,
        backgroundColor: ["rgba(13, 87, 239, 1)"],
        borderColor: ["rgba(13, 87, 239, 1)"],
        borderWidth: 2,
        label: "Tăng trưởng",
      },
    ],
    labels: labels,
  });
  useEffect(() => {
    let date = getDate(selectedTime);
    loadReportChart(date.fromDate, date.toDate);
  }, [selectedTime]);
  return (
    <>
      <div className="grid grid-cols-3">
        {lineChartData && (
          <div className="col-span-2">
            <Line
              height={100}
              width={200}
              data={lineChartData}
              options={{
                responsive: true,
                legend: {
                  position: "bottom",
                  align: "left",
                },
              }}
            />
          </div>
        )}
        {barChartData && (
          <div className="">
            <Bar
              height={100}
              width={100}
              data={barChartData}
              options={{
                responsive: true,
                legend: { position: "bottom", align: "left" },
                scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] },
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
