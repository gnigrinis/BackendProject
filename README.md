# Backend Documentation

This API REST allows you to manage shopping carts and their associated products.
## Base URL

The base URL for all endpoints is: `localhost:8080/api`
## Endpoints for Cart
### Create a new cart 
- URL: `/carts/` 
- Method: `POST`
- Description: Creates a new cart.
- Request Body: N/A 
- Response Body: 
- `message` (string): A success message indicating that the cart was created successfully. 
- Status Codes: 
- `201`: Cart created successfully 
- `500`: Internal server error
### Get products of a cart 
- URL: `/carts/:id` 
- Method: `GET`
- Description: Retrieves the products of a specific cart. 
- Request Parameters: 
- `id` (string): The ID of the cart. 
- Response Body: 
- `cart` (object): The cart object containing the following properties: 
- `id` (string): The ID of the cart. 
- `products` (array): An array of product objects, each containing the following properties: 
- `product` (string): The ID of the product. 
- `quantity` (number): The quantity of the product in the cart. 
- Status Codes: 
- `200`: Success 
- `404`: Cart not found
### Add a product to a cart 
- URL: `/carts/:cid/product/:pid` 
- Method: `POST`
- Description: Adds a product to a specific cart. 
- Request Parameters: 
- `cid` (string): The ID of the cart. 
- `pid` (string): The ID of the product to be added.
- Request Body: N/A 
- Response Body: 
- `message` (string): A success message indicating that the product was added to the cart successfully. 
- Status Codes: 
- `200`: Product added to cart successfully 
- `400`: Bad request

Please note that you need to replace `:id`, `:cid`, and `:pid` in the URLs with the actual IDs when making requests to the API.

## Endpoints for Products
### Get all products or filtered products 
- URL: `/products` 
- Method: `GET`
- Description: Retrieves all products or filters products based on search keywords, price range, and limit. 
- Request Query Parameters: 
- `search` (string): Optional. Search keywords to filter products by. 
- `max` (number): Optional. Maximum price to filter products by. 
- `min` (number): Optional. Minimum price to filter products by. 
- `limit` (number): Optional. Limits the number of products returned. 
- Response Body: 
- `products` (array): An array of product objects, each containing the following properties: 
- `id` (string): The ID of the product. 
- `title` (string): The title of the product. 
- `description` (string): The description of the product. 
- `price` (number): The price of the product. 
- `keywords` (array): An array of keywords associated with the product. 
- Status Codes: 
- `200`: Success
### Get a product by ID 
- URL: `/products/:id` 
- Method: `GET`
- Description: Retrieves a specific product by its ID. 
- Request Parameters: 
- `id` (string): The ID of the product. 
- Response Body: 
- `product` (object): The product object containing the following properties: 
- `id` (string): The ID of the product. 
- `title` (string): The title of the product. 
- `description` (string): The description of the product. 
- `price` (number): The price of the product. 
- `keywords` (array): An array of keywords associated with the product. 
- Status Codes: 
- `200`: Success 
- `404`: Product not found
### Add a new product 
- URL: `/products` 
- Method: `POST`
- Description: Adds a new product. 
- Request Body: 
- `title` (string): The title of the product. 
- `description` (string): The description of the product. 
- `price` (number): The price of the product. 
- `keywords` (array): An array of keywords associated with the product. 
- Response Body: 
- `message` (string): A success message indicating that the product was added successfully. 
- Status Codes: 
- `201`: Product added successfully 
- `400`: Bad request
### Update a product 
- URL: `/products/:id` 
- Method: `PUT`
- Description: Updates a specific product by its ID. 
- Request Parameters: 
- `id` (string): The ID of the product. 
- Request Body: Any of the following fields can be updated: 
- `title` (string): The updated title of the product. 
- `description` (string): The updated description of the product. 
- `price` (number): The updated price of the product. 
- `keywords` (array): The updated keywords associated with the product. 
- Response Body: 
- `message` (string): A success message indicating that the product was updated successfully. 
- Status Codes: 
- `200`: Product updated successfully 
- `404`: Product not found
### Delete a product 
- URL: `/products/:id` 
- Method: `DELETE`
- Description: Deletes a specific product by its ID. 
- Request Parameters: 
- `id` (string): The ID of the product. 
- Response Body: 
- `message` (string): A success message indicating that the product was deleted successfully. 
- Status Codes: 
- `200`: Product deleted successfully 
- `404`: Product not found

Please note that you need to replace `:id` in the URLs with the actual ID when making requests to the API.


