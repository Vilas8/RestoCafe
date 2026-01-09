-- ============================================
-- RestoCafe Sample Data
-- Run this AFTER schema.sql
-- ============================================

-- Note: Replace UUID placeholders with actual IDs from your database
-- You can get category IDs by running: SELECT id, name FROM menu_categories;

-- ============================================
-- SAMPLE MENU ITEMS
-- ============================================

-- Get category IDs first
DO $$
DECLARE
  cat_appetizers UUID;
  cat_pizza UUID;
  cat_burger UUID;
  cat_pasta UUID;
  cat_biryani UUID;
  cat_beverages UUID;
  cat_desserts UUID;
  cat_sandwiches UUID;
  
  custom_extra_cheese UUID;
  custom_no_onions UUID;
  custom_extra_spicy UUID;
  custom_less_oil UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_appetizers FROM public.menu_categories WHERE name = 'Appetizers';
  SELECT id INTO cat_pizza FROM public.menu_categories WHERE name = 'Pizzas';
  SELECT id INTO cat_burger FROM public.menu_categories WHERE name = 'Burgers';
  SELECT id INTO cat_pasta FROM public.menu_categories WHERE name = 'Pasta';
  SELECT id INTO cat_biryani FROM public.menu_categories WHERE name = 'Biryani';
  SELECT id INTO cat_beverages FROM public.menu_categories WHERE name = 'Beverages';
  SELECT id INTO cat_desserts FROM public.menu_categories WHERE name = 'Desserts';
  SELECT id INTO cat_sandwiches FROM public.menu_categories WHERE name = 'Sandwiches';
  
  -- Get customization IDs
  SELECT id INTO custom_extra_cheese FROM public.menu_customizations WHERE name = 'Extra Cheese';
  SELECT id INTO custom_no_onions FROM public.menu_customizations WHERE name = 'No Onions';
  SELECT id INTO custom_extra_spicy FROM public.menu_customizations WHERE name = 'Extra Spicy';
  SELECT id INTO custom_less_oil FROM public.menu_customizations WHERE name = 'Less Oil';

  -- Insert Appetizers
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_appetizers, 'Vegetable Spring Rolls', 'Crispy rolls filled with fresh vegetables', 149, true, 2, ARRAY[custom_extra_spicy, custom_less_oil], 15),
  (cat_appetizers, 'Paneer Tikka', 'Grilled cottage cheese with Indian spices', 199, true, 3, ARRAY[custom_extra_spicy, custom_less_oil], 20),
  (cat_appetizers, 'French Fries', 'Crispy golden fries with seasoning', 99, true, 0, ARRAY[custom_extra_spicy], 10),
  (cat_appetizers, 'Garlic Bread', 'Toasted bread with garlic butter', 129, true, 0, ARRAY[custom_extra_cheese], 12);

  -- Insert Pizzas
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_pizza, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 299, true, 0, ARRAY[custom_extra_cheese, custom_no_onions], 25),
  (cat_pizza, 'Pepperoni Pizza', 'Loaded with pepperoni and cheese', 399, false, 1, ARRAY[custom_extra_cheese], 25),
  (cat_pizza, 'Veggie Supreme', 'Loaded with fresh vegetables', 349, true, 1, ARRAY[custom_extra_cheese, custom_no_onions], 25),
  (cat_pizza, 'Paneer Tikka Pizza', 'Indian fusion with paneer tikka topping', 379, true, 3, ARRAY[custom_extra_cheese, custom_extra_spicy], 28);

  -- Insert Burgers
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_burger, 'Classic Veg Burger', 'Crispy veg patty with fresh veggies', 149, true, 1, ARRAY[custom_extra_cheese, custom_no_onions], 15),
  (cat_burger, 'Paneer Burger', 'Grilled paneer patty with special sauce', 179, true, 2, ARRAY[custom_extra_cheese, custom_no_onions, custom_extra_spicy], 18),
  (cat_burger, 'Chicken Burger', 'Juicy grilled chicken patty', 199, false, 2, ARRAY[custom_extra_cheese, custom_no_onions], 18),
  (cat_burger, 'Mushroom Swiss Burger', 'Mushroom and swiss cheese delight', 219, true, 1, ARRAY[custom_extra_cheese], 20);

  -- Insert Pasta
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_pasta, 'Pasta Alfredo', 'Creamy white sauce pasta', 249, true, 0, ARRAY[custom_extra_cheese], 20),
  (cat_pasta, 'Pasta Arrabiata', 'Spicy tomato sauce pasta', 229, true, 4, ARRAY[custom_extra_spicy, custom_less_oil], 20),
  (cat_pasta, 'Pesto Pasta', 'Fresh basil pesto with pasta', 269, true, 1, ARRAY[custom_extra_cheese], 22),
  (cat_pasta, 'Mac and Cheese', 'Classic macaroni with cheese sauce', 219, true, 0, ARRAY[custom_extra_cheese], 18);

  -- Insert Biryani
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_biryani, 'Veg Biryani', 'Aromatic rice with mixed vegetables', 199, true, 3, ARRAY[custom_extra_spicy, custom_less_oil], 30),
  (cat_biryani, 'Paneer Biryani', 'Fragrant rice with paneer cubes', 249, true, 3, ARRAY[custom_extra_spicy], 30),
  (cat_biryani, 'Chicken Biryani', 'Traditional chicken biryani', 299, false, 3, ARRAY[custom_extra_spicy], 35),
  (cat_biryani, 'Egg Biryani', 'Flavorful rice with boiled eggs', 219, false, 2, ARRAY[custom_extra_spicy], 28);

  -- Insert Sandwiches
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, available_customizations, preparation_time) VALUES
  (cat_sandwiches, 'Grilled Veg Sandwich', 'Grilled sandwich with vegetables', 129, true, 1, ARRAY[custom_extra_cheese, custom_no_onions], 12),
  (cat_sandwiches, 'Paneer Sandwich', 'Grilled paneer with spices', 149, true, 2, ARRAY[custom_extra_cheese, custom_extra_spicy], 15),
  (cat_sandwiches, 'Chicken Sandwich', 'Grilled chicken breast sandwich', 169, false, 2, ARRAY[custom_no_onions], 15),
  (cat_sandwiches, 'Club Sandwich', 'Triple-decker sandwich delight', 189, false, 1, ARRAY[custom_no_onions], 18);

  -- Insert Beverages
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, spice_level, preparation_time) VALUES
  (cat_beverages, 'Cappuccino', 'Classic Italian coffee', 99, true, 0, 5),
  (cat_beverages, 'Latte', 'Smooth and creamy coffee', 109, true, 0, 5),
  (cat_beverages, 'Cold Coffee', 'Chilled coffee with ice cream', 129, true, 0, 7),
  (cat_beverages, 'Fresh Lime Soda', 'Refreshing lime soda', 69, true, 0, 5),
  (cat_beverages, 'Mango Shake', 'Thick mango milkshake', 119, true, 0, 7),
  (cat_beverages, 'Soft Drink', 'Coke/Pepsi/Sprite', 49, true, 0, 2);

  -- Insert Desserts
  INSERT INTO public.menu_items (category_id, name, description, price, is_vegetarian, preparation_time) VALUES
  (cat_desserts, 'Chocolate Brownie', 'Warm chocolate brownie with ice cream', 149, true, 10),
  (cat_desserts, 'Tiramisu', 'Classic Italian dessert', 179, true, 5),
  (cat_desserts, 'Gulab Jamun', 'Traditional Indian sweet', 89, true, 5),
  (cat_desserts, 'Ice Cream Sundae', 'Three scoops with toppings', 159, true, 8);

END $$;

-- ============================================
-- SAMPLE COMBO DEALS
-- ============================================

DO $$
DECLARE
  item_margherita UUID;
  item_pepperoni UUID;
  item_garlic_bread UUID;
  item_soft_drink UUID;
  item_burger UUID;
  item_fries UUID;
  item_pasta UUID;
BEGIN
  -- Get item IDs
  SELECT id INTO item_margherita FROM public.menu_items WHERE name = 'Margherita Pizza' LIMIT 1;
  SELECT id INTO item_pepperoni FROM public.menu_items WHERE name = 'Pepperoni Pizza' LIMIT 1;
  SELECT id INTO item_garlic_bread FROM public.menu_items WHERE name = 'Garlic Bread' LIMIT 1;
  SELECT id INTO item_soft_drink FROM public.menu_items WHERE name = 'Soft Drink' LIMIT 1;
  SELECT id INTO item_burger FROM public.menu_items WHERE name = 'Classic Veg Burger' LIMIT 1;
  SELECT id INTO item_fries FROM public.menu_items WHERE name = 'French Fries' LIMIT 1;
  SELECT id INTO item_pasta FROM public.menu_items WHERE name = 'Pasta Alfredo' LIMIT 1;

  -- Insert Combo Deals
  INSERT INTO public.combo_deals (name, description, item_ids, original_price, discounted_price, discount, valid_from, valid_until) VALUES
  ('Family Pizza Feast', '2 Large Pizzas + Garlic Bread + 2 Drinks', 
   ARRAY[item_margherita, item_pepperoni, item_garlic_bread, item_soft_drink], 
   899, 699, 200, '2026-01-01', '2026-12-31'),
  
  ('Burger Combo', 'Burger + Fries + Drink', 
   ARRAY[item_burger, item_fries, item_soft_drink], 
   349, 279, 70, '2026-01-01', '2026-12-31'),
  
  ('Pasta Special', '2 Pasta Dishes + Garlic Bread', 
   ARRAY[item_pasta, item_pasta, item_garlic_bread], 
   627, 499, 128, '2026-01-01', '2026-12-31');

END $$;

-- ============================================
-- SAMPLE DAILY SPECIALS
-- ============================================

DO $$
DECLARE
  item_pizza UUID;
  item_burger UUID;
  item_pasta UUID;
  item_biryani UUID;
BEGIN
  SELECT id INTO item_pizza FROM public.menu_items WHERE name = 'Margherita Pizza' LIMIT 1;
  SELECT id INTO item_burger FROM public.menu_items WHERE name = 'Classic Veg Burger' LIMIT 1;
  SELECT id INTO item_pasta FROM public.menu_items WHERE name = 'Pasta Alfredo' LIMIT 1;
  SELECT id INTO item_biryani FROM public.menu_items WHERE name = 'Veg Biryani' LIMIT 1;

  INSERT INTO public.daily_specials (menu_item_id, day_of_week, discount_percentage, description, start_time, end_time) VALUES
  (item_pizza, 1, 20, 'Monday Pizza Special - 20% off all pizzas!', '11:00', '23:00'),
  (item_burger, 2, 25, 'Tasty Tuesday - 25% off all burgers!', '12:00', '22:00'),
  (item_pasta, 3, 15, 'Pasta Wednesday - 15% off all pasta dishes!', '12:00', '21:00'),
  (item_biryani, 4, 30, 'Biryani Thursday - 30% off all biryanis!', '11:30', '22:30');

END $$;

-- ============================================
-- SAMPLE HAPPY HOUR PRICING
-- ============================================

DO $$
DECLARE
  cat_beverages UUID;
  cat_appetizers UUID;
BEGIN
  SELECT id INTO cat_beverages FROM public.menu_categories WHERE name = 'Beverages';
  SELECT id INTO cat_appetizers FROM public.menu_categories WHERE name = 'Appetizers';

  INSERT INTO public.happy_hour_pricing (name, discount_percentage, start_time, end_time, days_of_week, applicable_categories) VALUES
  ('Evening Happy Hour', 30, '17:00', '19:00', ARRAY[1,2,3,4,5], ARRAY[cat_beverages, cat_appetizers]),
  ('Weekend Brunch Special', 25, '11:00', '14:00', ARRAY[0,6], ARRAY[cat_beverages]),
  ('Late Night Deals', 20, '21:00', '23:00', ARRAY[5,6], ARRAY[]::UUID[]); -- Empty array means all categories

END $$;

-- ============================================
-- SAMPLE COUPONS
-- ============================================

INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_until) VALUES
('WELCOME20', 'Welcome offer - 20% off on first order', 'percentage', 20, 299, 200, 1000, '2026-01-01', '2026-12-31'),
('FLAT100', 'Flat ₹100 off on orders above ₹500', 'fixed', 100, 500, 100, NULL, '2026-01-01', '2026-12-31'),
('WEEKEND25', 'Weekend special - 25% off', 'percentage', 25, 399, 300, NULL, '2026-01-01', '2026-12-31'),
('BIRYANI50', 'Flat ₹50 off on Biryani orders', 'fixed', 50, 199, 50, NULL, '2026-01-01', '2026-12-31');

-- ============================================
-- VERIFICATION
-- ============================================

-- Count records in each table
SELECT 'menu_categories' as table_name, COUNT(*) as count FROM public.menu_categories
UNION ALL
SELECT 'menu_customizations', COUNT(*) FROM public.menu_customizations
UNION ALL
SELECT 'menu_items', COUNT(*) FROM public.menu_items
UNION ALL
SELECT 'combo_deals', COUNT(*) FROM public.combo_deals
UNION ALL
SELECT 'daily_specials', COUNT(*) FROM public.daily_specials
UNION ALL
SELECT 'happy_hour_pricing', COUNT(*) FROM public.happy_hour_pricing
UNION ALL
SELECT 'coupons', COUNT(*) FROM public.coupons;