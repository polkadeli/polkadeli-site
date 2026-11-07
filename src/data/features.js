// Soft-launch switches.
// Set a feature to false to hide it everywhere on the site; set it back to true to turn it on.
// After changing a switch, commit and push: Netlify rebuilds the site in about a minute.
export const features = {
  onlineOrdering: true, // /order page, "Order for pick-up" buttons and the Pick-up choice under Order now.
  //                       Off: menu pages show "Call to order" with the Silver Spring number instead.
  shop: true, //           Shop page and its link in the menu.
  polish: true, //         Polish version (/pl/) and the EN | PL switch.
};
