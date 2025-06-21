#!/usr/bin/env python3
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def load_products(file_path):
    """Load products from JSON file"""
    with open(file_path, 'r') as file:
        return json.load(file)

def search_products(user_query, products_data):
    """
    Search products based on user preferences using OpenAI function calling
    """
    # Define the function that OpenAI can call
    functions = [
        {
            "type": "function",
            "function": {
                "name": "filter_products",
                "description": "Filter products based on user preferences",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "category": {
                            "type": "string",
                            "description": "Product category (Electronics, Fitness, Kitchen, Books, Clothing)"
                        },
                        "max_price": {
                            "type": "number",
                            "description": "Maximum price the user is willing to pay"
                        },
                        "min_rating": {
                            "type": "number",
                            "description": "Minimum rating the user wants (from 1 to 5)"
                        },
                        "in_stock": {
                            "type": "boolean",
                            "description": "Whether the product should be in stock"
                        }
                    }
                }
            }
        }
    ]

    # Call OpenAI API with function calling
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",  # Using a model that supports function calling
        messages=[
            {"role": "system", "content": "You are a helpful assistant that helps users find products based on their preferences."},
            {"role": "user", "content": f"I'm looking for products with these preferences: {user_query}. Here's the product data: {json.dumps(products_data)}"}
        ],
        tools=functions,
        tool_choice={"type": "function", "function": {"name": "filter_products"}}
    )

    # Extract the function arguments from the response
    function_call = response.choices[0].message.tool_calls[0]
    filter_args = json.loads(function_call.function.arguments)
    
    # Apply the filters to the product data
    filtered_products = filter_products_with_args(products_data["products"], filter_args)
    
    return filtered_products

def filter_products_with_args(products, filter_args):
    """Apply the filter arguments to the products"""
    filtered = products.copy()
    
    # Apply category filter if provided
    if "category" in filter_args and filter_args["category"]:
        filtered = [p for p in filtered if p["category"].lower() == filter_args["category"].lower()]
    
    # Apply max price filter if provided
    if "max_price" in filter_args and filter_args["max_price"] is not None:
        filtered = [p for p in filtered if p["price"] <= filter_args["max_price"]]
    
    # Apply min rating filter if provided
    if "min_rating" in filter_args and filter_args["min_rating"] is not None:
        filtered = [p for p in filtered if p["rating"] >= filter_args["min_rating"]]
    
    # Apply in stock filter if provided
    if "in_stock" in filter_args and filter_args["in_stock"] is not None:
        filtered = [p for p in filtered if p["in_stock"] == filter_args["in_stock"]]
    
    return filtered

def display_products(products):
    """Display the filtered products in a formatted way"""
    if not products:
        print("No products match your preferences.")
        return
    
    print("\nFiltered Products:")
    for i, product in enumerate(products, 1):
        in_stock_status = "In Stock" if product["in_stock"] else "Out of Stock"
        print(f"{i}. {product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {in_stock_status}")

def main():
    # Path to the products JSON file
    products_file = "products.json"
    
    # Load products data
    products_data = load_products(products_file)
    
    # Get user query
    print("Welcome to the Product Search Tool!")
    print("Describe what you're looking for (e.g., 'electronics under $200 with rating above 4'):")
    user_query = input("> ")
    
    # Search products based on user query
    filtered_products = search_products(user_query, products_data)
    
    # Display results
    display_products(filtered_products)

if __name__ == "__main__":
    main()
