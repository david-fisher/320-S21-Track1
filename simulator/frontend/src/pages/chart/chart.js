import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js';


function Radar({coverage, summary}) {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    // state for input

    const chartConfig = onChartChange(summary)
    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chart(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    return (
        <canvas
            ref={chartContainer}
            id="coverage-plot"
        />
    )

    function colorLimit(value) {
        if (value < 1.5) {
            return "rgba(255, 0, 0, 0.2)"
        }
        else if (value < 2.5) {
            return "rgba(255, 255, 0, 0.2)"
        }
        else {
            return "rgba(0, 128, 0, 0.2)"
        }
    }

    function onChartChange(input) {
        return {
            type: 'radar',
            data: {
                //labels: coverage.keys,
                labels: Object.keys(coverage),
                datasets: [{
                    label: "Student A",
                    backgroundColor: colorLimit(input),
                    data: Object.values(coverage)
                }]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        display: false
                    }
                }
            }
        };
    }
}

export default Radar;
