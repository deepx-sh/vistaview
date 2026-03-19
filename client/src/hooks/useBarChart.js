import { useEffect } from "react";
import Chart from "chart.js/auto"

const useBarChart = (canvasRef, labels, data, colors) => {
    useEffect(() => {
        if (!canvasRef.current || !data.length) return;

        const ctx = canvasRef.current.getContext("2d");
        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets:[{data,backgroundColor:colors,borderRadius:3,borderSkipped:false}]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                    y:{beginAtZero:true,ticks:{font:{size:11}}}
                }
            }
        })

        return () => chart.destroy();
    },[data])
};

export default useBarChart;