// src/scripts/diveChartInitializer.js
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

const canvas = document.getElementById('diveProfileChart');

if (canvas) {
  // Original metric data from the server
  const metricProfileData = JSON.parse(canvas.dataset.profile);

  // --- Unit Conversion Helpers ---
  const metersToFeet = (m) => m * 3.28084;
  const celsiusToFahrenheit = (c) => (c * 9 / 5) + 32;
  const barToPsi = (bar) => bar * 14.5038;

  // --- Chart Setup (colors, etc.) ---
  const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const gridColor = isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const fontColor = isDarkMode() ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  const depthColor = 'rgba(54, 162, 235, 1)';
  const tempColor = 'rgba(255, 99, 132, 1)';
  const pressureColor = 'rgba(255, 206, 86, 1)';

  // --- Chart Initialization ---
  const diveChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { datasets: [] }, // Start with empty datasets
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Time (minutes)', color: fontColor },
          ticks: { color: fontColor, stepSize: 5 },
          grid: { color: gridColor },
        },
        yDepth: {
          type: 'linear',
          position: 'left',
          reverse: true,
          title: { display: true, text: 'Depth', color: fontColor },
          ticks: { color: fontColor },
          grid: { color: gridColor },
        },
        yTemp: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Temp', color: fontColor },
          ticks: { color: fontColor },
          grid: { drawOnChartArea: false },
        },
        yPressure: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Pressure', color: fontColor },
          ticks: { color: fontColor },
          grid: { drawOnChartArea: false },
          min: 0,
        }
      },
      plugins: {
        datalabels: { /* ... configuration will be set in the update function ... */ }
      }
    }
  });

  // --- Main Update Function ---
  function updateChart(unit) {
    const isMetric = unit === 'metric';

    // 1. Convert Data based on selected unit
    const displayData = {
      depth: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.depth })) : metricProfileData.map(d => ({ x: d.time, y: metersToFeet(d.depth) })),
      temp: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.temp })) : metricProfileData.map(d => ({ x: d.time, y: celsiusToFahrenheit(d.temp) })),
      pressure: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.pressure })) : metricProfileData.map(d => ({ x: d.time, y: barToPsi(d.pressure) })),
    };

    // 2. Update Chart Datasets
    diveChart.data.datasets = [
      { label: `Depth (${isMetric ? 'm' : 'ft'})`, data: displayData.depth, borderColor: depthColor, backgroundColor: 'rgba(54, 162, 235, 0.2)', yAxisID: 'yDepth', fill: true, pointRadius: 0, borderWidth: 2 },
      { label: `Temp (${isMetric ? '°C' : '°F'})`, data: displayData.temp, borderColor: tempColor, yAxisID: 'yTemp', pointRadius: 0, borderWidth: 2 },
      { label: `Pressure (${isMetric ? 'bar' : 'psi'})`, data: displayData.pressure, borderColor: pressureColor, yAxisID: 'yPressure', pointRadius: 0, borderWidth: 2 }
    ];

    // 3. Update Axis Labels and Scales
    diveChart.options.scales.yDepth.title.text = `Depth (${isMetric ? 'm' : 'ft'})`;
    diveChart.options.scales.yDepth.min = 0;
    diveChart.options.scales.yDepth.max = isMetric ? 30 : 100;

    diveChart.options.scales.yTemp.title.text = `Temp (${isMetric ? '°C' : '°F'})`;
    diveChart.options.scales.yPressure.title.text = `Pressure (${isMetric ? 'bar' : 'psi'})`;

    // 4. Update Datalabels
    diveChart.options.plugins.datalabels = {
      display: (context) => context.dataset.label.includes('Pressure'),
      formatter: (value, context) => {
        const lastIndex = context.dataset.data.length - 1;
        if (context.dataIndex === 0 || context.dataIndex === lastIndex) {
          return `${Math.round(value.y)} ${isMetric ? 'bar' : 'psi'}`;
        }
        return null;
      },
      align: (context) => context.dataIndex === 0 ? 'start' : 'end',
      anchor: (context) => context.dataIndex === 0 ? 'start' : 'end',
      color: fontColor,
      font: { weight: 'bold' },
      offset: 8,
    };

    // 5. Redraw the Chart
    diveChart.update();
  }

  // --- Event Listener for the Toggle ---
  const unitToggle = document.getElementById('unitToggle');
  unitToggle.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const selectedUnit = e.target.dataset.unit;

      // Update active button style
      unitToggle.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');

      updateChart(selectedUnit);
    }
  });

  // Initial chart render
  updateChart('metric');

  // --- Download Button Logic ---
  document.getElementById('downloadChartBtn').addEventListener('click', () => {
    const url = diveChart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dive-profile-chart.png';
    a.click();
  });
}
