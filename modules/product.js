class Product {
	constructor(sku, name, price) {
		if (!sku || !name || !price) throw "Missing arguments required for new product.";
		// Add a condition to validate the price.
		this.sku = sku;
		this.name = name;
		this.price = price;
		this.discounts = [];
	}

	/**
	* Requires two args:
	* 1. First arg indicates how many items must be purchased before discounts kick-in
	* 2. Second arg determines the product's new price.
	*/
	addBulkItemDiscount(min_quantity_to_trigger_discount, discounted_product_price) {
		if (!min_quantity_to_trigger_discount || !discounted_product_price){
			throw ("Method arguments missing - addBulkItemDiscount() requires two numeric arguemnts.");
		}

		let discountDetails = {
			sku: this.sku,
			discount_type: "bulkItemDiscount",
			method_arguments : {
				min_quantity_to_trigger_discount: min_quantity_to_trigger_discount,
				discounted_product_price: discounted_product_price,
			},
		};
		
		this.discounts.push(discountDetails);
	}

	/**
	* Requires two args:
	* 1. First arg indicates that for each time this limit is reached, a bundle discount kicks-in
	* 2. Second arg determines the number of products that will be chargable, every time the limit from the 
	*    first arg is reached.
	*/
	addBundleItemDiscount(min_quantity_to_trigger_bundle, number_of_payable_items) {
		if (!min_quantity_to_trigger_bundle || !number_of_payable_items){
			throw ("Method arguments missing - addBundleItemDiscount() requires two numeric arguemnts.");
		}

		let discountDetails = {
			sku: this.sku,
			discount_type: "bundleItemDiscount",
			method_arguments : {
				min_quantity_to_trigger_bundle: min_quantity_to_trigger_bundle,
				number_of_payable_items: number_of_payable_items,
			},
		};

		this.discounts.push(discountDetails);
	}

	/**
	* Requires one arg:
	* 1. First arg indicates what the bonus item is. It must be the "sku" of the item that will be given away.
	*/
	addBonusItem(give_away_item_sku) {
		if (!give_away_item_sku){
			throw ("Method arguments missing - give_away_item_sku() requires one argument.");
		}

		let discountDetails = {
			sku: this.sku,
			discount_type: "bonusItem",
			method_arguments : {
				give_away_item_sku: give_away_item_sku,
			},
		};

		this.discounts.push(discountDetails);
	}

}

module.exports = Product;