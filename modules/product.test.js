const Product = require("./product");

describe("creating a new instance of Product", () => {
	test("is successfull when three args are passed to 'Product'", () => {
		const iPad = new Product("ipd", "Super iPad", 549.99);
		expect(iPad.name).toBe("Super iPad");
		expect(iPad.sku).toBe("ipd");
		expect(iPad.price).toBe(549.99);
	});

	test("throws an error when argments are missing for 'Product'", () => {
		const iPad = () => new Product("ipd");
		expect(iPad).toThrow("Missing arguments required for new product.");
	});
	
	// Add a test to for price validity...
});

describe("testing instance methods for 'Product', specifically", () => {
	let iPad;

	beforeEach(() => {
		iPad = new Product("ipd", "Super iPad", 549.99);
	});

	afterEach(() => {
		iPad = null;
	});

	// addBulkItemDiscount
	describe("the 'addBulkItemDiscount()' method", () => {
		test("throws an error when arguments are missing", () => {
			const bulkDiscount = () => iPad.addBulkItemDiscount();
			expect(bulkDiscount).toThrow("Method arguments missing - addBulkItemDiscount() requires two numeric arguemnts.");
		});

		test("successfully adds a bulk item discount", () => {
			iPad.addBulkItemDiscount(4, 499.99);
			let expectedDiscountObject = {
				sku: iPad.sku,
				discount_type: "bulkItemDiscount",
				method_arguments : {
					min_quantity_to_trigger_discount: 4,
					discounted_product_price: 499.99,
				},
			};
			expect(iPad.discounts).toEqual(
				expect.arrayContaining([expectedDiscountObject])
			);
		});
	});

	// add test for addBundleItemDiscount
	describe("the 'addBundleItemDiscount()' method", () => {
		test("throws an error when arguments are missing", () => {
			const bundleDiscount = () => iPad.addBundleItemDiscount();
			expect(bundleDiscount).toThrow("Method arguments missing - addBundleItemDiscount() requires two numeric arguemnts.");
		});

		test("successfully adds a bundle item discount", () => {
			iPad.addBundleItemDiscount(3, 2);
			let expectedDiscountObject = {
				sku: iPad.sku,
				discount_type: "bundleItemDiscount",
				method_arguments : {
					min_quantity_to_trigger_bundle: 3,
					number_of_payable_items: 2,
				},
			};
			expect(iPad.discounts).toEqual(
				expect.arrayContaining([expectedDiscountObject])
			);
		});
	});
	
	// add test for addBonusItem
	describe("the 'addBonusItem()' method", () => {
		test("throws an error when argument is missing", () => {
			const bonusItem = () => iPad.addBonusItem();
			expect(bonusItem).toThrow("Method arguments missing - give_away_item_sku() requires one argument.");
		});

		test("successfully adds a bonus item discount", () => {
			iPad.addBonusItem("vga");
			let expectedDiscountObject = {
				sku: iPad.sku,
				discount_type: "bonusItem",
				method_arguments : {
					give_away_item_sku: "vga",
				},
			};
			expect(iPad.discounts).toEqual(
				expect.arrayContaining([expectedDiscountObject])
			);
		});
	});
});
