# cost
about 5USD and about 90 minutes of back and forth with claude sonnet 3.7

I relied on Cline in Cursor to do most of the coding.


# to do
It's not ideal

I want to be able to record the keys e.g. https://www.youtube.com/shorts/T269m18_zd4

and then control playback speed as fast as I want.

The code is not there yet.

# Playable Piano App

A web-based interactive piano application that allows users to play, record, and learn piano through a graphical interface. This application provides a virtual piano keyboard with customizable features for both casual play and learning.

GitHub Repository: https://github.com/pleabargain/playable-piano-app

## Features

- **Interactive Piano Keyboard**
  - Choose between 2 or 4 octaves
  - Realistic piano key layout with proper black key positioning
  - Visual feedback with pink highlighting when keys are played
  - Note labels on each key for easy identification

- **Playback Options**
  - Play individual keys by clicking or using keyboard input
  - Record your performances with timestamp information
  - Adjustable playback speed (0.1x to 2x) for learning difficult passages
  - Loop playback functionality for practice sessions

- **Advanced Input Methods**
  - Direct key input (e.g., "C1", "D#2")
  - Manual text entry for sequences and chords
  - Support for chord notation using brackets (e.g., "[C1E1G1]")

- **Recording Management**
  - Record, save, and load piano performances
  - JSON format for easy sharing and editing
  - Manual editing of recorded sequences
  - Clear recordings with a single click

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (vanilla, no frameworks)
- **Audio**: HTML5 Audio API for sound playback
- **Storage**: LocalStorage for saving playback settings
- **Data Format**: JSON for recording storage and manipulation

## Installation and Setup

1. **Clone the repository**
   ```
   git clone https://github.com/pleabargain/playable-piano-app.git
   cd playable-piano-app
   ```

2. **Run locally**
   - Simply open `index.html` in any modern web browser
   - No build process or server required

3. **Browser Compatibility**
   - Works best in Chrome, Firefox, Safari, and Edge
   - Requires a browser with HTML5 Audio support

## Usage Guide

### Playing the Piano

- **Direct Interaction**: Click on piano keys to play them
- **Key Input**: Enter a note (e.g., "C1", "D#2") in the input field and press Enter or click "Play"
- **Octave Selection**: Choose between 2 or 4 octaves using the radio buttons

### Recording and Playback

1. **Recording**:
   - Click "Record" to start recording
   - Play keys on the piano
   - Click "Stop Recording" (same button) when finished

2. **Playback**:
   - Click "Play Recording" to play back your recorded sequence
   - Adjust playback speed using the slider (0.1x to 2x)
   - Toggle "Loop" to repeat the playback continuously

3. **Managing Recordings**:
   - Click "Clear" to delete the current recording
   - Enter a filename and click "Save Recording" to save as JSON
   - Use "Choose File" and "Load Recording" to load a saved recording

### Manual Key Entry

1. Enter notes in the "Manual Key Entry" field using the following format:
   - Individual notes separated by commas: `C1, E1, G1`
   - Chords using brackets: `[C1E1G1]`
   - Combinations: `[C1E1G1], D2, [F1A1]`

2. Click "Parse Input" to convert to a recording or "Play Input" to play immediately

## Project Structure

- **index.html**: Main HTML structure and UI elements
- **style.css**: All styling and responsive design
- **script.js**: JavaScript functionality including piano generation and playback
- **audio/**: Directory containing piano key sound files (MP3 format)
- **piano-recording.json**: Example/default recording file

## Future Enhancements

- MIDI input support
- More instrument sound options
- Metronome functionality
- Tutorial mode with guided lessons
- Visualization of music notation

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
