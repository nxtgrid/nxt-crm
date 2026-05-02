const intersection = (arr1, arr2) => arr1.filter(val => arr2.includes(val));

// Add white-label customer entries here.
// Each key must match a subdomain segment of the vanity URL.
// Each value must have a `name` (display name) and a `folder` (subfolder under public/branding/).
const BRANDED_CUSTOMERS = {
  example: { name: 'Example Organisation', folder: 'example' },
};

// Set brand by vanity URL
const hostParts = window.location.hostname.split('.');
const [ match ] = intersection(Object.keys(BRANDED_CUSTOMERS), hostParts);
if(match) {
  const BRAND = window.BRAND = BRANDED_CUSTOMERS[match];
  document.title = 'Dashboard | ' + BRAND.name;
}
