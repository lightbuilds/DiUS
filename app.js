const Product = require("./modules/product");
const Checkout = require("./modules/checkout");

let priceRules = [];

// Create the 4 products
let iPad = new Product("ipd", "Super iPad", 549.99);
let MacBookPro = new Product("mbp",	"MacBook Pro", 1399.99);
let AppleTv = new Product("atv", "Apple TV", 109.50);
let VgaAdapter = new Product("vga",	"VGA adapter", 30.00);

// Add some discounts and special offers 
iPad.addBulkItemDiscount(4, 499.99);
AppleTv.addBundleItemDiscount(3, 2);
MacBookPro.addBonusItem("vga");

// Configure price rules - for each product (eg: iPad) add its available discounts into the "priceRules" array.
iPad.discounts.forEach((discount) => { priceRules.push(discount) });
AppleTv.discounts.forEach((discount) => { priceRules.push(discount) });
MacBookPro.discounts.forEach((discount) => { priceRules.push(discount) });

// Start scanning items
let checkout = new Checkout(priceRules);
checkout.scan(iPad);
checkout.scan(iPad);
checkout.scan(iPad);
checkout.scan(iPad);

checkout.total();
checkout.applyDiscounts();
checkout.total();

console.log(`The total price is : ${checkout.totalPrice}`);
