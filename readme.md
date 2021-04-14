# DiUS Shopping

A checkout system for DiUS, built with vanilla Javascript. However `npm` is used to enable running the code in terminal as well as supporting a testing framework ([Jest](https://jestjs.io)).

# Downloading The Repository - for GitHub beginers

To clone this repository,
1. Simply open up terminal on your machine and navigate to the directory you'd like to clone this repository.
2. Then run

```git clone https://github.com/lightbuilds/DiUS.git```

You'll now have access to the repository. Please read on to install prerequisites to successfully run the project.

# Installation

To run this project successfully, three things must be installed on your machine. While you're in the cloned project directory in terminal, follow the steps below to install:

## 1. npm

If you don't already have it, install npm on your machine by running the following in terminal1

```npm install npm@latest```

If you're unsure whether or not its installed, simply run 

```npm -v```

If you get a version number returned, then you've got it installed.

## 2. Jest

Next you'll need to have [Jest](https://jestjs.io) installed to enable testing. 

If you don't already have it, run the following in terminal

```npm install --save-dev jest```

## 3. CommonJs

[CommonJS](https://www.npmjs.com/package/common-js) allows us to use `require()` to include files and modules in vanilla Javascript.

CommonJS is used in this project because Jest doesn't play well with importing and exporting modules in ES6. In hines sight, this is probably not the best testing framework for vanilla JS.

To install it, simply run the following in terminal

```npm install common-js```

# Running The Code

Navigate to the project direcotry in terminal and run 

```node app.js``` 

To calculate the total price for the scanned items

## Scanning More Items

To scan more items, simply open up **app.js** in the root directory of the project. 

At the near bottom of this file, where `Checkout` is instantiated like so 

```let checkout = new Checkout(priceRules);``` 

add the items you'd like to scan. For example:

```
checkout.scan(iPad)
checkout.scan(iPad)
checkout.scan(iPad)
checkout.scan(iPad)
checkout.scan(MacBookPro)
checkout.scan(AppleTv)
checkout.scan(VgaAdapter)
```

In the above code example, iPad will be scanned 4 times - its quantity will be 4 at the checkout.

Try it by saving the changes made to **app.js** and run the following in terminal

```node app.js```

# Price Rule Configuration

If the "indecisive sales manager" needs to change the discount rules, there are 3 things that they could do. 

**Note -** these changes must be made in the **app.js** file in the root directory.

## 1. Modify The 3 For 2 Deal

We currently have a bulk discount deal available on iPads - if 4 iPads are scanned, they'll each be discounted by $50! 

This discount deal is configured in **app.js** on line 13

```iPad.addBulkItemDiscount(4, 499.99);```

- Where the first argument (4) is the min number of iPads a user must purchase, for the bulk discounts.
- And the second argument (499.99) is the discounted price for the item.

Right now, 4 iPads must be purchased in order to get the bulk discount. If the manager wanted to change the min order for bulk discounts from 4 to 10, they could change the above line of code to the following

```iPad.addBulkItemDiscount(10, 499.99);```

## 2. Modify The Bulk Discount Prices

We currently have a 3 for 2 deal on Apple TVs.

This deal is configured in **app.js** on line 14

```AppleTv.addBundleItemDiscount(3, 2);```

- The first argument (3) is the min number of items that must be scanned before the bundle offer kicks-in
- The second argument (2) is the number of chargable items

If the manager wanted to change the bundle deal to 5 for 3, they could do the following

```AppleTv.addBundleItemDiscount(5, 3);```

## 3. Modify The Bundle Item

We currently have a bundle deal where users get a free VGA adapter everytime they purchase a MacBook Pro. 

This deal is configured in **app.js** on line 15

```MacBookPro.addBonusItem("vga");```

If the manager wants to give away an Apple Tv instead of a VGA adapter, they just need to replace `vga` with the sku of the Apple TV like so

```MacBookPro.addBonusItem("atv");```

Also, the sku for the Super iPad is `ipd`, incase the manager was kind enough to give it away for free.

## Additional configuration

The code is flexable as it also works without any exsiting discounts and price rules. 

If the manager is in a grumpy mood and they don't feel like giving discounts, they can simply comment out lines 13, 14 and 15 in **app.js** like so

```
// iPad.addBulkItemDiscount(4, 499.99);
// AppleTv.addBundleItemDiscount(3, 2);
// MacBookPro.addBonusItem("vga");
```

Then saving the file and running the following in terminal

```node app.js```

Should return the total price without discounts.


# Running Tests (With Jest)

Navigate to the project directory in terminal and run

```npm test```

Everything should pass after a few seconds of waiting. Two files are being tested (product.js and checkout.js)
