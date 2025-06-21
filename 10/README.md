# Product Search Based on User Preferences

This application allows users to search for products using natural language queries. It leverages OpenAI's function calling capabilities to interpret user preferences and filter products accordingly.

## Features

- Natural language input for product search preferences
- Filtering by category, price, rating, and stock availability
- Uses OpenAI's function calling to process user queries
- Displays results in a formatted, easy-to-read manner

## Requirements

- Python 3.7+
- OpenAI API key

## Installation

1. Clone the repository or download the source code
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Set up your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Note: The application is configured to read the API key from the environment variable `OPENAI_API_KEY`. Make sure this is set before running the application.

## Usage

Run the application using Python:

```bash
python product_search.py
```

When prompted, enter your product search preferences in natural language. For example:
- "I need electronics under $200 with a rating above 4"
- "Show me fitness products that are in stock"
- "Looking for kitchen items under $50"

The application will process your query and display matching products from the dataset.

## How It Works

1. The application loads product data from `products.json`
2. User inputs their preferences in natural language
3. The OpenAI API interprets the user's preferences using function calling
4. The application filters the products based on the extracted preferences
5. Matching products are displayed to the user

## Files

- `product_search.py`: Main application code
- `products.json`: Product dataset
- `requirements.txt`: Required Python packages
- `sample_outputs.md`: Example runs of the application
