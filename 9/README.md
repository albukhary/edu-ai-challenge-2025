# Service Analyzer

A console application that generates comprehensive, markdown-formatted reports about services or products from multiple perspectives - business, technical, and user-focused.

## Features

- Accepts either a known service name (e.g., "Spotify", "Notion") or a raw service description
- Generates a detailed markdown report with the following sections:
  - Brief History
  - Target Audience
  - Core Features
  - Unique Selling Points
  - Business Model
  - Tech Stack Insights
  - Perceived Strengths
  - Perceived Weaknesses
- Uses OpenAI API to analyze and generate insights

## Requirements

- Python 3.7+
- OpenAI API key set as environment variable `OPENAI_API_KEY`

## Installation

1. Clone this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the application using:

```bash
python service_analyzer.py
```

You will be prompted to either:
1. Enter a known service name (e.g., "Spotify", "Notion")
2. Paste a raw service description

The application will then generate and display a markdown-formatted report in the console.

Alternatively, you can specify a service name or description directly as a command-line argument:

```bash
python service_analyzer.py "Spotify"
```

Or to save the output to a file:

```bash
python service_analyzer.py "Spotify" --output report.md
```

## Environment Variables

The application requires an OpenAI API key to function. Set it as an environment variable:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Note: Never commit your API key to version control!
