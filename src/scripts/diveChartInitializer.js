// src/scripts/diveChartInitializer.js
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

// Helper function to get CSS variables for theming.
function getCssVariable(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// Main function to set up all dive charts on the page.
function initializeCharts() {
  document.querySelectorAll('.astro-dive-chart').forEach(chartContainer => {
    const canvas = chartContainer.querySelector('.dive-chart-canvas');
    if (!canvas || !canvas.dataset.profile) return;

    // --- 1. DATA PREPARATION ---
    const metricProfileData = JSON.parse(canvas.dataset.profile);
    const avgDepthMetric = canvas.dataset.avgDepth ? parseFloat(canvas.dataset.avgDepth) : null;

    // Conversion utilities
    const metersToFeet = (m) => m * 3.28084;
    const celsiusToFahrenheit = (c) => (c * 9 / 5) + 32;
    const barToPsi = (bar) => bar * 14.5038;

    // Color theme variables
    const depthColor = 'rgba(54, 162, 235, 1)';
    const tempColor = 'rgba(255, 99, 132, 1)';
    const pressureColor = 'rgba(255, 206, 86, 1)';
    const avgDepthColor = 'rgba(150, 150, 150, 0.7)';
    const getFontColor = () => getCssVariable('--color-text');
    const getGridColor = () => getCssVariable('--color-grid');

    // --- 2. CHART INITIALIZATION ---
    const diveChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { datasets: [] },
      options: { // Initialize with base options
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        interaction: { mode: 'index', intersect: false, axis: 'x' },
        plugins: {
          tooltip: { multiKeyBackground: '#000' },
        },
      },
    });

    // --- 3. DYNAMIC UPDATE FUNCTION ---
    function updateChart(unit) {
      const isMetric = unit === 'metric';

      // Check which data types are actually present
      const hasTempData = metricProfileData.some(d => d.temp !== null && typeof d.temp === 'number');
      const hasPressureData = metricProfileData.some(d => d.pressure !== null && typeof d.pressure === 'number');
      const hasAvgDepthData = avgDepthMetric !== null && !isNaN(avgDepthMetric);

      // --- DATASETS (Conditionally built) ---
      const datasets = [];

      // Always add Depth Profile
      datasets.push({
        label: `Depth (${isMetric ? 'm' : 'ft'})`,
        data: metricProfileData.map(d => ({
          x: d.time,
          y: d.depth === null ? null : (isMetric ? d.depth : metersToFeet(d.depth))
        })),
        borderColor: depthColor,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'yDepth',
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      });

      // Add Average Depth if available
      if (hasAvgDepthData) {
        const avgDepthValue = isMetric ? avgDepthMetric : metersToFeet(avgDepthMetric);
        const lastTimePoint = metricProfileData[metricProfileData.length - 1]?.time || 0;
        datasets.push({
          label: `Avg Depth (${isMetric ? 'm' : 'ft'})`,
          data: [{ x: 0, y: avgDepthValue }, { x: lastTimePoint, y: avgDepthValue }],
          borderColor: avgDepthColor,
          borderDash: [5, 5],
          yAxisID: 'yDepth',
          pointRadius: 0,
          borderWidth: 1.5,
        });
      }

      // Add Temperature if available
      if (hasTempData) {
        datasets.push({
          label: `Temp (${isMetric ? '°C' : '°F'})`,
          data: metricProfileData.map(d => ({
            x: d.time,
            y: d.temp === null ? null : (isMetric ? d.temp : celsiusToFahrenheit(d.temp))
          })),
          borderColor: tempColor,
          yAxisID: 'yTemp',
          pointRadius: 0,
          borderWidth: 2,
        });
      }

      // Add Pressure if available
      if (hasPressureData) {
        datasets.push({
          label: `Pressure (${isMetric ? 'bar' : 'psi'})`,
          data: metricProfileData.map(d => ({
            x: d.time,
            y: d.pressure === null ? null : (isMetric ? d.pressure : barToPsi(d.pressure))
          })),
          borderColor: pressureColor,
          yAxisID: 'yPressure',
          pointRadius: 0,
          borderWidth: 2,
        });
      }

      // --- SCALES (Dynamically built) ---
      const fontColor = getFontColor();
      const gridColor = getGridColor();
      const scales = {
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
          title: { display: true, text: `Depth (${isMetric ? 'm' : 'ft'})`, color: fontColor },
          ticks: { color: fontColor },
          grid: { color: gridColor },
          min: 0,
        },
      };

      if (hasTempData) {
        scales.yTemp = {
          display: true,
          type: 'linear',
          position: 'right',
          title: { display: true, text: `Temp (${isMetric ? '°C' : '°F'})`, color: fontColor },
          ticks: { color: fontColor },
          grid: { drawOnChartArea: false },
        };
      }

      if (hasPressureData) {
        scales.yPressure = { display: false }; // Still needed for scaling, but not visible
      }

      // --- PLUGINS ---
      const plugins = {
        legend: {
          display: window.innerWidth >= 768,
          labels: { boxWidth: 12, boxHeight: 12, padding: 20, color: fontColor }
        },
        tooltip: { multiKeyBackground: '#000' },
        datalabels: {
          display: (context) => context.dataset.label.includes('Pressure') && hasPressureData,
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
        }
      };

      // --- FINAL CHART UPDATE ---
      diveChart.data.datasets = datasets;
      diveChart.options.scales = scales;
      diveChart.options.plugins = plugins;
      diveChart.update();
    }

    // --- 4. EVENT LISTENERS & INITIAL RENDER ---
    const unitToggle = chartContainer.querySelector('.unit-toggle');
    let currentUnit = 'metric';
    if (unitToggle) {
      unitToggle.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
          currentUnit = button.dataset.unit;
          unitToggle.querySelector('.active')?.classList.remove('active');
          button.classList.add('active');
          updateChart(currentUnit);
        }
      });
    }

    const downloadBtn = chartContainer.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => { /* ... existing logic ... */ });
    }

    // Update chart if the website's color scheme changes
    const observer = new MutationObserver(() => updateChart(currentUnit));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-scheme'] });

    // Initial render
    updateChart(currentUnit);
  });
}

// Use requestAnimationFrame to ensure the DOM is ready.
requestAnimationFrame(initializeCharts);
