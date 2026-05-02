import { driver } from 'driver.js';

export const siteOutlineDriver = driver({
  showProgress: true,
  disableActiveInteraction: true,
  stagePadding: 8,
  stageRadius: 4,
  steps: [
    {
      element: '.mapboxgl-map',
      popover: {
        description: 'Find your site on the map by zooming and scrolling.',
      },
    },
    {
      element: '.mapboxgl-ctrl-geocoder--input',
      popover: {
        description: 'Alternatively you can use the search bar to find your site, even by entering latitude-longitude coordinates.',
      },
    },
    {
      element: '.mapbox-gl-draw_ctrl-draw-btn',
      popover: {
        description: 'When this button is active, you can draw an outline on the map.',
      },
    },
    {
      element: '.mapboxgl-map',
      popover: {
        description: 'Then draw the outline around your community. You finish the outline by clicking a second time on the first or last point you drew.',
      },
    },
    {
      element: '.mapbox-gl-draw_trash',
      popover: {
        description: 'You can delete points or the entire drawing with the delete button.',
      },
    },
    {
      element: '.mapboxgl-style-switcher',
      popover: {
        description: 'You can also change the style of the map by choosing a different layer.',
      },
    },
    {
      element: '#calculate-button',
      popover: {
        description: 'Once you have drawn the outline, press calculate to get an initial distribution design.',
      },
    },
  ],
});

//↻
