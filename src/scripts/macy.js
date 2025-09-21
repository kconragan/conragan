import Macy from 'macy';

let macyInstance = null;

export function initializeMacy() {
  const container = document.querySelector('.photo-grid');
  if (!container) {
    console.warn('Macy container element not found.');
    return;
  }

  if (macyInstance) {
    macyInstance.remove(); // Destroy previous instance
    macyInstance = null;
  }

  macyInstance = new Macy({
    container: '.photo-grid',
    trueOrder: true,
    waitForImages: false,
    useOwnImageLoader: true,
    debug: false,
    mobileFirst: true,
    columns: 1,
    margin: {
      x: 4,
      y: 4,
    },
    breakAt: {
      600: 2,
      1200: 3,
      1800: 4,
      2400: 5,
      2800: 6,
    },
  });

  // Recalculate
  macyInstance.runOnImageLoad(() => {
    macyInstance.recalculate(true);
  }, true);

  return () => {
    if (macyInstance) {
      macyInstance.remove();
    }
  };
}
