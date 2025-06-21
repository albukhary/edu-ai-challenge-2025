#!/usr/bin/env python3
import os
import json
import time
import argparse
from datetime import datetime
from pathlib import Path
import openai
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def transcribe_audio(audio_file_path):
    """
    Transcribe audio file using OpenAI's Whisper API
    """
    print(f"Transcribing audio file: {audio_file_path}")
    
    try:
        with open(audio_file_path, "rb") as audio_file:
            # Call Whisper API for transcription
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        
        # Extract transcription text
        transcription = response.text
        print("Transcription completed successfully!")
        return transcription
    
    except Exception as e:
        print(f"Error during transcription: {e}")
        raise

def summarize_text(text):
    """
    Summarize text using OpenAI's GPT model
    """
    print("Generating summary...")
    
    try:
        # Call GPT for summarization
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text. Create a concise summary that captures the main points and key details."},
                {"role": "user", "content": f"Please summarize the following text:\n\n{text}"}
            ]
        )
        
        # Extract summary
        summary = response.choices[0].message.content
        print("Summary generated successfully!")
        return summary
    
    except Exception as e:
        print(f"Error during summarization: {e}")
        raise

def analyze_transcript(text, duration_seconds=None):
    """
    Analyze transcript to extract statistics
    """
    print("Analyzing transcript...")
    
    try:
        # Calculate word count
        words = text.split()
        word_count = len(words)
        
        # Calculate speaking speed if duration is provided
        speaking_speed = None
        if duration_seconds:
            speaking_speed = int((word_count / duration_seconds) * 60)
        
        # Use GPT to extract frequently mentioned topics
        prompt = f"""
        Analyze the following transcript and identify the top 5 most frequently mentioned topics or themes.
        For each topic, count how many times it's mentioned.
        Return the result as a valid JSON object with this format:
        {{
          "word_count": [total number of words],
          "speaking_speed_wpm": [words per minute, or null if not available],
          "frequently_mentioned_topics": [
            {{ "topic": "[Topic 1]", "mentions": [count] }},
            {{ "topic": "[Topic 2]", "mentions": [count] }},
            ...
          ]
        }}
        
        Transcript:
        {text}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes text and returns structured data in JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        analysis = json.loads(response.choices[0].message.content)
        
        # Override the word count and speaking speed with our calculated values
        analysis["word_count"] = word_count
        analysis["speaking_speed_wpm"] = speaking_speed
        
        print("Analysis completed successfully!")
        return analysis
    
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise

def save_to_file(content, filename):
    """
    Save content to a file
    """
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Content saved to {filename}")
    except Exception as e:
        print(f"Error saving to file {filename}: {e}")
        raise

def get_audio_duration(audio_file_path):
    """
    Try to get audio duration using ffprobe if available
    Returns duration in seconds or None if not available
    """
    try:
        import subprocess
        cmd = [
            'ffprobe', 
            '-v', 'error', 
            '-show_entries', 'format=duration', 
            '-of', 'default=noprint_wrappers=1:nokey=1', 
            audio_file_path
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            return float(result.stdout.strip())
    except Exception as e:
        print(f"Could not determine audio duration: {e}")
    
    return None

def process_audio(audio_file_path, output_dir=None):
    """
    Process audio file: transcribe, summarize, and analyze
    """
    # Create timestamp for unique filenames
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Set output directory
    if output_dir is None:
        output_dir = os.path.dirname(os.path.abspath(audio_file_path))
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get base filename without extension
    base_filename = os.path.splitext(os.path.basename(audio_file_path))[0]
    
    # Define output filenames
    transcription_file = os.path.join(output_dir, f"transcription_{base_filename}_{timestamp}.md")
    summary_file = os.path.join(output_dir, f"summary_{base_filename}_{timestamp}.md")
    analysis_file = os.path.join(output_dir, f"analysis_{base_filename}_{timestamp}.json")
    
    # Also create the required specific output files for the task
    task_transcription_file = os.path.join(output_dir, "transcription.md")
    task_summary_file = os.path.join(output_dir, "summary.md")
    task_analysis_file = os.path.join(output_dir, "analysis.json")
    
    # Get audio duration if possible
    duration = get_audio_duration(audio_file_path)
    
    # Process the audio
    transcription = transcribe_audio(audio_file_path)
    summary = summarize_text(transcription)
    analysis = analyze_transcript(transcription, duration)
    
    # Save results to files
    save_to_file(transcription, transcription_file)
    save_to_file(summary, summary_file)
    save_to_file(json.dumps(analysis, indent=2), analysis_file)
    
    # Save to task-specific files
    save_to_file(transcription, task_transcription_file)
    save_to_file(summary, task_summary_file)
    save_to_file(json.dumps(analysis, indent=2), task_analysis_file)
    
    return {
        "transcription": transcription,
        "summary": summary,
        "analysis": analysis,
        "files": {
            "transcription": transcription_file,
            "summary": summary_file,
            "analysis": analysis_file
        }
    }

def main():
    """
    Main function to run the script
    """
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Process audio files using OpenAI APIs')
    parser.add_argument('audio_file', nargs='?', default='CAR0004.mp3', 
                        help='Path to the audio file (default: CAR0004.mp3)')
    parser.add_argument('--output-dir', '-o', help='Output directory for results')
    
    args = parser.parse_args()
    
    # Check if API key is set
    if not os.environ.get("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("Please set your OpenAI API key as an environment variable:")
        print("export OPENAI_API_KEY=your_api_key_here")
        return 1
    
    # Check if file exists
    if not os.path.isfile(args.audio_file):
        print(f"Error: Audio file not found: {args.audio_file}")
        return 1
    
    # Process the audio file
    try:
        start_time = time.time()
        results = process_audio(args.audio_file, args.output_dir)
        end_time = time.time()
        
        # Print results to console
        print("\n" + "="*50)
        print("PROCESSING COMPLETE")
        print("="*50)
        print(f"Processing time: {end_time - start_time:.2f} seconds")
        print("\nSUMMARY:")
        print("-"*50)
        print(results["summary"])
        print("\nANALYSIS:")
        print("-"*50)
        print(json.dumps(results["analysis"], indent=2))
        print("\nOutput files:")
        for key, filepath in results["files"].items():
            print(f"- {key.capitalize()}: {filepath}")
        
        return 0
    
    except Exception as e:
        print(f"Error processing audio file: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
