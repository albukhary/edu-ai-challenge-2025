# Audio Transcription, Summarization, and Analysis Tool

This console application transcribes audio files, generates summaries, and extracts meaningful analytics using OpenAI's Whisper and GPT models.

## Features

- **Audio Transcription**: Converts speech to text using OpenAI's Whisper model
- **Text Summarization**: Creates concise summaries of the transcribed content using GPT
- **Analytics Extraction**: Provides insights including:
  - Word count
  - Speaking speed (words per minute)
  - Frequently mentioned topics with mention counts
- **File Output**: Saves transcription, summary, and analytics to separate files

## Requirements

- Python 3.7 or higher
- OpenAI API key
- FFmpeg (optional, for accurate speaking speed calculation)

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
python audio_processor.py [audio_file_path] [--output-dir OUTPUT_DIR]
```

Arguments:
- `audio_file_path`: Path to the audio file (default: CAR0004.mp3)
- `--output-dir` or `-o`: Output directory for result files (optional)

Example:
```bash
python audio_processor.py my_recording.mp3 --output-dir results
```

If no arguments are provided, the application will process the default file `CAR0004.mp3` in the current directory.

## Output Files

The application generates the following output files:

1. `transcription.md`: The full transcription of the audio file
2. `summary.md`: A concise summary of the transcription
3. `analysis.json`: Analytics data in JSON format

Additionally, timestamped versions of these files are created for historical tracking:
- `transcription_[filename]_[timestamp].md`
- `summary_[filename]_[timestamp].md`
- `analysis_[filename]_[timestamp].json`

## How It Works

1. **Transcription**: The audio file is sent to OpenAI's Whisper API, which converts speech to text with high accuracy.
2. **Summarization**: The transcription is processed by GPT to generate a concise summary capturing the main points.
3. **Analysis**: The application extracts analytics like word count and speaking speed, and uses GPT to identify frequently mentioned topics.
4. **Output**: Results are displayed in the console and saved to files.

## Notes

- For accurate speaking speed calculation, FFmpeg should be installed on your system.
- Processing time depends on the length of the audio file and your internet connection speed.
- The application supports various audio formats compatible with the Whisper API.
