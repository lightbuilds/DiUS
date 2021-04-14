const Checkout = require("./checkout");
const Product = require("./product");

describe("creating a new instance of 'Checkout'", () => {
	test("is successfull when no arguments are given", () => {
		let checkout = new Checkout();
		expect(checkout.priceRules).toEqual([]);
		expect(checkout.totalPrice).toEqual(0);
		expect(checkout.scannedProducts).toEqual([]);
	});

	test("is successfull when given an argument - price 'priceRules' are set & 'priceRules' are available in the instance", () => {
		let setPriceRules = [
				{
				sku: "ipd",
				discount_type: "bulkItemDiscount",
				method_arguments : {
					min_quantity_to_trigger_discount: 4,
					discounted_product_price: 499.99,
				},
			}
		];

		let checkout = new Checkout(setPriceRules);
		expect(checkout.priceRules).toEqual(
			expect.arrayContaining(setPriceRules)
		);
		expect(checkout.totalPrice).toEqual(0);
		expect(checkout.scannedProducts).toEqual([]);
	})
});

describe("testing instance methods for 'Checkout'", () => {
	// scan()
	test("testing 'scan()' - when a new item is scanned, it should be available in the instanac's scanned items", () => {
		let iPad = new Product("ipd", "Super iPad", 549.99);
		let expectedScannedProducts = [ { sku: "ipd", qty: 1, price: 549.99, subtotal: 549.99 } ];
		let checkout = new Checkout();
		checkout.scan(iPad);
		expect(checkout.scannedProducts).toEqual(
			expect.arrayContaining(expectedScannedProducts)
		);
	});


	// total()
	test("testing 'total()' - when a new item is scanned, calling total() should set the 'totalPrice' in an instance of 'Checkout'", () => {
		let iPad = new Product("ipd", "Super iPad", 549.99);
		let checkout = new Checkout();
		checkout.scan(iPad);
		checkout.total();
		expect(checkout.totalPrice).toEqual(549.99);
	});

	// applyDiscounts()
	describe("testing applyDiscounts() - when a new item is scanned, calling applyDiscounts()", () => {
		test("should not have changed 'totalPrice', when no discounts are set", () => {
			let iPad = new Product("ipd", "Super iPad", 549.99);
			let priceRules = []; // no discounts are set
			let checkout = new Checkout(priceRules);
			checkout.scan(iPad);
			checkout.scan(iPad);
			checkout.scan(iPad);

			checkout.total();
			// This is the total price before the "applyDiscounts()" method is called on "checkout"
			let totalPriceBefore = checkout.totalPrice;
			expect(checkout.totalPrice).toEqual(totalPriceBefore);
			checkout.applyDiscounts();
			expect(checkout.totalPrice).toEqual(totalPriceBefore);
		});

		test("should have changed 'totalPrice', when discounts are set", () => {
			let priceRules = [];
			let iPad = new Product("ipd", "Super iPad", 549.99);
			iPad.addBulkItemDiscount(2, 499.99);
			iPad.discounts.forEach((discount) => { priceRules.push(discount) }); // set discount

			let checkout = new Checkout(priceRules);
			checkout.scan(iPad);
			checkout.scan(iPad);

			// // Total price before discounts
			checkout.total();
			let totalPriceBefore = checkout.totalPrice;
			expect(totalPriceBefore).toEqual(549.99 * 2);

			// // Total price after discounts
			checkout.applyDiscounts();
			checkout.total();
			let totalPriceAfter = checkout.totalPrice;
			expect(checkout.totalPrice).toEqual(999.98);

			expect(totalPriceBefore).toBeGreaterThan(totalPriceAfter);
		});
	});


	describe("testing 'extractDiscountMethodNameFromPriceRule()' check the presence of a method in the 'Checkout' class, extracted from a string", () => {	
		test("when a searched method is present in the class, it should return the method name", () => {
			let discountType = "bundleItemDiscount";
			let checkout = new Checkout();
			let extractedMethod = checkout.extractDiscountMethodNameFromPriceRule(discountType);
			expect(typeof extractedMethod).toEqual("function");
		});

		test("when a searched method is NOT present in the class, it should throw an error", () => {
			let discountType = "nonExistantMethodName";
			let checkout = new Checkout();
			const extractedMethod = () => checkout.extractDiscountMethodNameFromPriceRule(discountType);
			expect(extractedMethod).toThrow("invalid 'discount_type' value in 'priceRules' array.");
		});
	});
	
	// bulkItemDiscount()
	describe("testing bulkItemDiscount()", () => {
		describe("setting bulk item discounts", () => {
			test("should NOT discount the total price, when scanned product quantities DON'T meet threshold", () => {
				let priceRules = [];
				let iPad = new Product("ipd", "Super iPad", 549.99);
				iPad.addBulkItemDiscount(2, 499.99); // 2 iPads must be scanned to get discount
				iPad.discounts.forEach((discount) => { priceRules.push(discount) });
				
				// Scanning only 1 iPad doesn't meet discount threshold - there should be no applied discounts
				let checkout = new Checkout(priceRules)
				checkout.scan(iPad);
				checkout.applyDiscounts();
				checkout.total();
				expect(checkout.totalPrice).toEqual(549.99);
			});

			test("should discount the total price, when scanned product quantities meet threshold", () => {
				let priceRules = [];
				let iPad = new Product("ipd", "Super iPad", 549.99);
				iPad.addBulkItemDiscount(2, 499.99); // 2 iPads must be scanned to get discount
				iPad.discounts.forEach((discount) => { priceRules.push(discount) });
				
				// Scanning 2 iPads should meet discount threshold (as per "priceRules"), which should apply discounts 
				let checkout = new Checkout(priceRules)
				checkout.scan(iPad);
				checkout.scan(iPad);
				checkout.applyDiscounts();
				checkout.total();
				expect(checkout.totalPrice).toEqual(999.98);
			});
		});

		describe("when no bulk item discounts are set", () => {
			test("should NOT discount the total price regardless of how many items are scanned", () => {
				let iPad = new Product("ipd", "Super iPad", 549.99);
				let checkout = new Checkout();
				checkout.scan(iPad);
				checkout.scan(iPad);
				checkout.scan(iPad);
				checkout.scan(iPad);
				checkout.applyDiscounts();
				checkout.total();
				expect(checkout.totalPrice).toEqual(549.99 * 4);
			});
		});
	});

	// Testing "bundleItemDiscount()" will follow the same pattern as the tests for "bulkItemDiscount()"

	// Testing bonusItem will follow the same pattern as the tests for "bulkItemDiscount()"
});