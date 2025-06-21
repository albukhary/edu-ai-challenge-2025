#!/usr/bin/env python3
"""
Service Analyzer - A console application that generates comprehensive reports about services or products
using the OpenAI API.
"""

import os
import sys
import argparse
from typing import Optional, Dict, Any
import openai

# Check if OpenAI API key is set
if not os.environ.get("OPENAI_API_KEY"):
    print("Error: OPENAI_API_KEY environment variable is not set.")
    print("Please set your OpenAI API key as an environment variable:")
    print("export OPENAI_API_KEY=your_api_key_here")
    sys.exit(1)

# Configure OpenAI client
client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def generate_service_report(input_text: str) -> str:
    """
    Generate a comprehensive report about a service using the OpenAI API.
    
    Args:
        input_text: Either a service name or a description of a service
        
    Returns:
        A markdown-formatted report
    """
    # Determine if input is likely a service name or description
    is_service_name = len(input_text.split()) <= 3
    
    # Create the prompt based on input type
    if is_service_name:
        prompt = create_service_name_prompt(input_text)
    else:
        prompt = create_service_description_prompt(input_text)
    
    # Call OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-4",  # Using GPT-4 for best analysis
            messages=[
                {"role": "system", "content": "You are a professional service analyzer that provides comprehensive, accurate, and well-structured reports about services or products."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating report: {str(e)}"

def create_service_name_prompt(service_name: str) -> str:
    """Create a prompt for analyzing a known service by name."""
    return f"""
Please provide a comprehensive analysis of {service_name} in markdown format.
Your report must include the following sections:

1. **Brief History**: Founding year, key milestones, and evolution
2. **Target Audience**: Primary user segments and demographics
3. **Core Features**: Top 2-4 key functionalities that define the service
4. **Unique Selling Points**: Key differentiators from competitors
5. **Business Model**: How the service generates revenue
6. **Tech Stack Insights**: Technologies, frameworks, or infrastructure used (if known)
7. **Perceived Strengths**: Standout positive aspects
8. **Perceived Weaknesses**: Known limitations or drawbacks

Format your response as a well-structured markdown document with clear headings for each section.
Be factual, balanced, and comprehensive in your analysis.
"""

def create_service_description_prompt(description: str) -> str:
    """Create a prompt for analyzing a service based on its description."""
    return f"""
Based on the following service description, please provide a comprehensive analysis in markdown format:

"{description}"

Your report must include the following sections:

1. **Brief History**: Infer or extract founding information and timeline if available
2. **Target Audience**: Identify the primary user segments based on the description
3. **Core Features**: Extract or infer 2-4 key functionalities from the description
4. **Unique Selling Points**: Identify key differentiators mentioned or implied
5. **Business Model**: Analyze how this service likely generates revenue
6. **Tech Stack Insights**: Note any technologies, frameworks, or infrastructure mentioned or implied
7. **Perceived Strengths**: Highlight positive aspects from the description
8. **Perceived Weaknesses**: Identify potential limitations or challenges

Format your response as a well-structured markdown document with clear headings for each section.
If certain information is not available in the description, make reasonable inferences and note them as such.
"""

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Generate a comprehensive report about a service or product.")
    parser.add_argument("input", nargs="?", help="Service name or description (optional, will prompt if not provided)")
    parser.add_argument("--output", "-o", help="Output file to save the report (optional)")
    return parser.parse_args()

def main():
    """Main function to run the service analyzer."""
    args = parse_arguments()
    
    # Get input from command line or prompt
    if args.input:
        input_text = args.input
    else:
        print("\n=== Service Analyzer ===")
        print("\nEnter a service name (e.g., 'Spotify', 'Notion') or paste a service description:")
        input_text = input("> ")
    
    # Generate report
    print("\nGenerating report... This may take a moment.")
    report = generate_service_report(input_text)
    
    # Output report
    if args.output:
        with open(args.output, "w") as f:
            f.write(report)
        print(f"\nReport saved to {args.output}")
    else:
        print("\n" + "=" * 80)
        print(report)
        print("=" * 80)

if __name__ == "__main__":
    main()
