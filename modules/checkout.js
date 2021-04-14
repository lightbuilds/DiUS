class Checkout {
	constructor(priceRules) {
		this.priceRules = priceRules ? priceRules : [];
		this.scannedProducts = [];
		this.totalPrice = 0;
	}

	// Adds items to "ScannedProducts"
	scan(product) {
		// Increment qty in "ScannedProducts" if the item type has already been scanned
		let itemTypeAlreadyScanned = false;
		this.scannedProducts.forEach( (scannedProduct) => {
			if (scannedProduct["sku"] == product.sku) {
				scannedProduct["qty"] += 1;
				scannedProduct["subtotal"] = scannedProduct["price"] * scannedProduct["qty"];
				itemTypeAlreadyScanned = true;
				return;
			}
		});
		// Add item as a new object in "scannedProducts"
		if (!itemTypeAlreadyScanned) {
			this.scannedProducts.push(
				{ sku: product.sku, qty: 1, price: product.price, subtotal: product.price }
			)
		}
	}

	applyDiscounts() {
		this.priceRules.forEach( (rule) => { 
			this.scannedProducts.forEach( (scannedProduct, index) => {
				// If there's a "rule" for the iterated "scannedProduct" instance
				if (rule["sku"] === scannedProduct["sku"]) {
					// Check what type of price rule is available for the "scannedProduct"

					let discountMethod = this.extractDiscountMethodNameFromPriceRule(rule["discount_type"]);
					discountMethod = discountMethod.bind(this); 

					// Call the extracted discount method and pass it arguments from the price rule object. 
					discountMethod(index, rule["method_arguments"]);
				}
			});
		}); 
	}

	total() {
		// console.log(this.scannedProducts); // Prints object containing all scanned products.
		this.totalPrice = 0; // set "totalPrice" to 0, incase it was pre-calculated.
		this.scannedProducts.forEach((scannedProduct) => {
			this.totalPrice = this.totalPrice + scannedProduct["subtotal"];
		});
	}

	/**
		* @bulkItemDiscount applies a bulk item discount - if the qty meets a threshold, a discount applies
		* @method_arguments is an object containing qty & price used to calculate discounts. 
		* An example of the structure in this argument is: { min_quantity_to_trigger_discount: 4, discounted_product_price: 100 }
		* @product_index_in_scanned_products_array is the index of the item found in "scannedProducts" array. This is the item to be discounted
	*/
	bulkItemDiscount(product_index_in_scanned_products_array, method_arguments) {
		// Finds the product to be discounted, in the "ScannedProducts" array.
		let product = this.scannedProducts[product_index_in_scanned_products_array];
		if (product["qty"] < method_arguments["min_quantity_to_trigger_discount"]) return; // No discounts applicable.
		// If the item's qty is eligible for discounts, then apply discounted price.
		product["price"] = method_arguments["discounted_product_price"]; 
		product["subtotal"] = method_arguments["discounted_product_price"] * product["qty"];
	}

	/**
		* @bundleItemDiscount applies bundle deal (eg: 3 for 2 Apple TVs) - if the qty meets a threshold, a bundle price applies
		* @method_arguments is an object containing a min qty for bundle eligibility & the number of items that are chargable. 
		* An example of the structure in this argument is: { min_quantity_to_trigger_bundle: 3, number_of_payable_items: 2 }
		* @product_index_in_scanned_products_array is the index of the item found in "scannedProducts" array. This is the item to be discounted
	*/
	bundleItemDiscount(product_index_in_scanned_products_array, method_arguments) {
		// Finds the product to be discounted, in the "ScannedProducts" array.
		let product = this.scannedProducts[product_index_in_scanned_products_array];
		if (product["qty"] < method_arguments["min_quantity_to_trigger_bundle"]) return; // No discounts applicable.
		
		// Start - calculate total payable price for bundled items
		let remaining_undiscountable_items = (product["qty"] % method_arguments["min_quantity_to_trigger_bundle"]);
		let numberOfDiscountableItems = product["qty"] - remaining_undiscountable_items;

		let totalNumberOfBundles = (numberOfDiscountableItems / method_arguments["min_quantity_to_trigger_bundle"]);
		let totalPayableBundleItems = totalNumberOfBundles * method_arguments["number_of_payable_items"]; // Get bundle payable items
		let totalPrice = totalPayableBundleItems * product['price']; // Total price for all bundled items
		totalPrice = totalPrice + (remaining_undiscountable_items * product['price']); // Adding full priced items. 
		// End - calculate total payable price for bundled items

		product['subtotal'] = totalPrice; // Apply bundle price to items.
	}

	/**
		* @bulkItemDiscount looks in "scannedProducts" and applies a give away product for everytime a certain product is scanned.
		* @method_arguments is an object containing the sku of the give away item.
		* An example of the structure in this argument is: { give_away_item_sku: 'vga' }
		* @product_index_in_scanned_products_array is the index of the item found in "scannedProducts" array. This is the item to be discounted
	*/
	bonusItem(product_index_in_scanned_products_array, method_arguments){
		// Check if the give away item has already been scanned (added to "scannedProducts").
		let scannedProductEligibleForBonusItem = this.scannedProducts[product_index_in_scanned_products_array];
		let numberOfItemsToGiveAway = scannedProductEligibleForBonusItem["qty"];
		let operationComplete = false; // no give away item prices have been applied to scanned items yet.

		for (let product of this.scannedProducts) {
			// If the bonus item specificied in the "priceRules" array is already scanned
			if (product["sku"] == method_arguments["give_away_item_sku"]) {
				// Generous feature - if only one give away item's been scanned and the customer's eligible for more, give it away!
				if (product["qty"] < numberOfItemsToGiveAway) product["qty"] = numberOfItemsToGiveAway;
				let NumberOfBonusItemsNotEligibleForGiveAway = product["qty"] - numberOfItemsToGiveAway;
				NumberOfBonusItemsNotEligibleForGiveAway = NumberOfBonusItemsNotEligibleForGiveAway * product["price"];
				product["subtotal"] = NumberOfBonusItemsNotEligibleForGiveAway;
				operationComplete = true;
				break;
			}
		}

		if (operationComplete) return;
		// If the bonus item isn't scanned at all, and the user is eligible for it, add it to scannedProducts - free of charge.
		this.scannedProducts.push(
			{
				sku: method_arguments["give_away_item_sku"], 
				qty: numberOfItemsToGiveAway, 
				price: 30,
				subtotal: 0
			}
		);
	}

	extractDiscountMethodNameFromPriceRule(ruleDiscountType) {
		var extractDiscountMethodName = this[ruleDiscountType];
		// Check if the method is found in this class.
		let applyDiscountFunction = extractDiscountMethodName;
		if (typeof applyDiscountFunction !== "function") throw ("invalid 'discount_type' value in 'priceRules' array.");
		return applyDiscountFunction;
	}

}

module.exports = Checkout;