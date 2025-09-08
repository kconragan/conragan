// src/scripts/diveChartInitializer.js
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

// Helper function to get a CSS variable from the root element
function getCssVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// Wrap all chart logic in a single function
function initializeCharts() {
  document.querySelectorAll('.astro-dive-chart').forEach(chartContainer => {

    const canvas = chartContainer.querySelector('.dive-chart-canvas');
    if (!canvas) return;

    const metricProfileData = JSON.parse(canvas.dataset.profile);

    // --- Unit Conversion Helpers ---
    const metersToFeet = (m) => m * 3.28084;
    const celsiusToFahrenheit = (c) => (c * 9 / 5) + 32;
    const barToPsi = (bar) => bar * 14.5038;

    // --- Chart Color Setup ---
    const getFontColor = () => getCssVariable('--color-text');
    const getGridColor = () => getCssVariable('--color-grid');
    const depthColor = 'rgba(54, 162, 235, 1)';
    const tempColor = 'rgba(255, 99, 132, 1)';
    const pressureColor = 'rgba(255, 206, 86, 1)';

    // --- Chart Initialization ---
    const diveChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'Time (minutes)' },
            ticks: { stepSize: 5 },
          },
          yDepth: {
            type: 'linear',
            position: 'left',
            reverse: true,
            title: { display: true, text: 'Depth' },
          },
          yTemp: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Temp' },
            grid: { drawOnChartArea: false },
          },
          yPressure: {
            type: 'linear',
            position: 'right',
            title: { display: true, text: 'Pressure' },
            grid: { drawOnChartArea: false },
            min: 0,
          }
        },
        plugins: {
          datalabels: {}
        }
      }
    });

    // --- Main Update Function ---
    function updateChart(unit) {
      const isMetric = unit === 'metric';
      const fontColor = getFontColor();
      const gridColor = getGridColor();

      const displayData = {
        depth: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.depth })) : metricProfileData.map(d => ({ x: d.time, y: metersToFeet(d.depth) })),
        temp: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.temp })) : metricProfileData.map(d => ({ x: d.time, y: celsiusToFahrenheit(d.temp) })),
        pressure: isMetric ? metricProfileData.map(d => ({ x: d.time, y: d.pressure })) : metricProfileData.map(d => ({ x: d.time, y: barToPsi(d.pressure) })),
      };

      diveChart.data.datasets = [
        { label: `Depth (${isMetric ? 'm' : 'ft'})`, data: displayData.depth, borderColor: depthColor, backgroundColor: 'rgba(54, 162, 235, 0.2)', yAxisID: 'yDepth', fill: true, pointRadius: 0, borderWidth: 2 },
        { label: `Temp (${isMetric ? '°C' : '°F'})`, data: displayData.temp, borderColor: tempColor, yAxisID: 'yTemp', pointRadius: 0, borderWidth: 2 },
        { label: `Pressure (${isMetric ? 'bar' : 'psi'})`, data: displayData.pressure, borderColor: pressureColor, yAxisID: 'yPressure', pointRadius: 0, borderWidth: 2 }
      ];

      const allScales = [diveChart.options.scales.x, diveChart.options.scales.yDepth, diveChart.options.scales.yTemp, diveChart.options.scales.yPressure];
      allScales.forEach(scale => {
        scale.title.color = fontColor;
        scale.ticks.color = fontColor;
        if (scale.grid) {
          scale.grid.color = gridColor;
        }
      });

      diveChart.options.scales.yDepth.title.text = `Depth (${isMetric ? 'm' : 'ft'})`;
      diveChart.options.scales.yDepth.min = 0;
      diveChart.options.scales.yDepth.max = isMetric ? 30 : 100;
      diveChart.options.scales.yTemp.title.text = `Temp (${isMetric ? '°C' : '°F'})`;
      diveChart.options.scales.yPressure.title.text = `Pressure (${isMetric ? 'bar' : 'psi'})`;

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

      diveChart.update();
    }

    // --- Event Listeners ---
    const unitToggle = chartContainer.querySelector('.unit-toggle');
    let currentUnit = 'metric';
    unitToggle.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        currentUnit = e.target.dataset.unit;
        unitToggle.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        updateChart(currentUnit);
      }
    });

    const downloadBtn = chartContainer.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => {
      const url = diveChart.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dive-profile-chart.png';
      a.click();
    });

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
          updateChart(currentUnit);
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    updateChart(currentUnit);
  });
}

// Defer the execution of the entire chart initialization process
requestAnimationFrame(initializeCharts);
