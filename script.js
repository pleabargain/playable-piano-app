const pianoContainer = document.querySelector(".piano-container");
const octaveRadios = document.querySelectorAll('input[name="octaves"]');
const base = "./audio/";

// Recording variables
let isRecording = false;
let recordingStartTime = 0;
let recordedKeys = [];

// Playback variables
let playbackSpeed = 1.0; // Default playback speed multiplier
let isLooping = false; // Loop playback flag

// Define the structure of a piano octave (0 = white key, 1 = black key)
const keyPattern = [
    { type: "white", note: "C" },
    { type: "black", note: "C#" },
    { type: "white", note: "D" },
    { type: "black", note: "D#" },
    { type: "white", note: "E" },
    { type: "white", note: "F" },
    { type: "black", note: "F#" },
    { type: "white", note: "G" },
    { type: "black", note: "G#" },
    { type: "white", note: "A" },
    { type: "black", note: "A#" },
    { type: "white", note: "B" }
];

// Function to generate piano keys based on number of octaves
function generatePianoKeys(octaves) {
    console.log(`Generating piano with ${octaves} octaves`);
    
    // Clear existing keys
    pianoContainer.innerHTML = "";
    
    // Calculate total keys
    const totalKeys = octaves * 12;
    
    // Create white keys first (7 per octave)
    let whiteKeyCount = 0;
    
// Create all white keys first
    for (let i = 0; i < totalKeys; i++) {
        const keyInfo = keyPattern[i % 12];
        if (keyInfo.type === "white") {
            const key = document.createElement("div");
            key.classList.add("key", "white-key");
            key.dataset.note = keyInfo.note;
            key.dataset.octave = Math.floor(i / 12) + 1;
            key.dataset.index = i;
            
            // Add note label with octave number
            const octaveNumber = Math.floor(i / 12) + 1;
            const noteLabel = document.createElement("span");
            noteLabel.classList.add("note-label");
            noteLabel.textContent = `${keyInfo.note}${octaveNumber}`;
            key.appendChild(noteLabel);
            
            // Add click event listener
            key.addEventListener("click", () => {
                // Get the audio file number based on note and octave
                const audioNumber = getAudioFileNumber(keyInfo.note, octaveNumber);
                
                if (audioNumber) {
                    // Play the audio
                    new Audio(`${base}key${audioNumber}.mp3`).play();
                    
                    // Record key press if recording is active
                    recordKeyPress(keyInfo.note, octaveNumber);
                }
            });
            
            pianoContainer.appendChild(key);
            whiteKeyCount++;
        }
    }
    
    // Then add black keys with correct positioning
    const whiteKeyWidth = 4.37; // em, from CSS
    
    for (let i = 0; i < totalKeys; i++) {
        const keyInfo = keyPattern[i % 12];
        if (keyInfo.type === "black") {
            const key = document.createElement("div");
            key.classList.add("key", "black-key");
            key.dataset.note = keyInfo.note;
            key.dataset.octave = Math.floor(i / 12) + 1;
            key.dataset.index = i;
            
            // Add click event listener
            const octaveNumber = Math.floor(i / 12) + 1;
            key.addEventListener("click", () => {
                // Get the audio file number based on note and octave
                const audioNumber = getAudioFileNumber(keyInfo.note, octaveNumber);
                
                if (audioNumber) {
                    // Play the audio
                    new Audio(`${base}key${audioNumber}.mp3`).play();
                    
                    // Record key press if recording is active
                    recordKeyPress(keyInfo.note, octaveNumber);
                }
            });
            
            // Calculate position based on the note
            // Black keys should be positioned at the junction of white keys
            const octaveOffset = Math.floor(i / 12) * 7 * whiteKeyWidth; // 7 white keys per octave
            const blackKeyWidth = 3; // em, from CSS (updated to match the wider black keys)
            let position;
            
            // Position black keys at the junction of white keys
            // For a real piano, black keys are not centered but positioned at specific points
            // Adding an additional offset of 0.625em (approximately 10px) to move black keys to the right
            const additionalOffset = 0.625; // ~10px in em units
            
            switch (keyInfo.note) {
                case "C#": // At the junction of C and D
                    position = octaveOffset + whiteKeyWidth - (blackKeyWidth / 2) + additionalOffset;
                    break;
                case "D#": // At the junction of D and E
                    position = octaveOffset + (whiteKeyWidth * 2) - (blackKeyWidth / 2) + additionalOffset;
                    break;
                case "F#": // At the junction of F and G
                    position = octaveOffset + (whiteKeyWidth * 4) - (blackKeyWidth / 2) + additionalOffset;
                    break;
                case "G#": // At the junction of G and A
                    position = octaveOffset + (whiteKeyWidth * 5) - (blackKeyWidth / 2) + additionalOffset;
                    break;
                case "A#": // At the junction of A and B
                    position = octaveOffset + (whiteKeyWidth * 6) - (blackKeyWidth / 2) + additionalOffset;
                    break;
            }
            
            key.style.left = `${position}em`;
            pianoContainer.appendChild(key);
        }
    }
}

// Function to record a key press
function recordKeyPress(note, octave) {
    if (isRecording) {
        const timestamp = Date.now() - recordingStartTime;
        recordedKeys.push({
            note: note,
            octave: octave,
            timestamp: timestamp
        });
        updateRecordingDisplay();
    }
}

// Function to update the recording display
function updateRecordingDisplay() {
    const recordingTextarea = document.getElementById("recording-textarea");
    if (recordingTextarea) {
        // Format the JSON with proper indentation for better readability
        recordingTextarea.value = JSON.stringify(recordedKeys, null, 2);
        console.log("Updated recording display:", recordedKeys);
    }
}

// Function to get the audio file number for a note and octave
function getAudioFileNumber(note, octave) {
    // Map notes to their position in the octave (0-11)
    const notePositions = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    
    // Calculate the index based on octave and note position
    const notePosition = notePositions[note];
    if (notePosition === undefined) {
        return null;
    }
    
    // Calculate the absolute position (0-based)
    const absolutePosition = ((octave - 1) * 12) + notePosition;
    
    // Map to audio file number (1-24)
    // We have 24 audio files, so we need to wrap around if we go beyond that
    const audioIndex = (absolutePosition % 24) + 1;
    
    // Format with leading zero if needed
    return audioIndex <= 9 ? `0${audioIndex}` : `${audioIndex}`;
}

// Function to play a specific key by note and octave (e.g., "C1", "D2", "C#1", etc.)
function playKey(noteWithOctave) {
    // Convert to uppercase to handle case-insensitive input
    noteWithOctave = noteWithOctave.toUpperCase();
    
    // Check if it's a valid format
    if (!/^[A-G](#)?[1-4]$/.test(noteWithOctave)) {
        alert("Please enter a valid key (e.g., C1, D2, C#1, etc.)");
        return;
    }
    
    // Extract note, accidental, and octave
    let note, octave, isSharp = false;
    
    if (noteWithOctave.includes('#')) {
        // Handle sharp notes (e.g., C#1)
        note = noteWithOctave.charAt(0) + "#";
        octave = parseInt(noteWithOctave.substring(2));
        isSharp = true;
    } else {
        // Handle natural notes (e.g., C1)
        note = noteWithOctave.charAt(0);
        octave = parseInt(noteWithOctave.substring(1));
    }
    
    // Find the key element with the matching note and octave
    const selector = isSharp ? 
        `.black-key[data-note="${note}"][data-octave="${octave}"]` : 
        `.white-key[data-note="${note}"][data-octave="${octave}"]`;
    
    const keyElement = document.querySelector(selector);
    
    if (keyElement) {
        // Highlight the key
        keyElement.classList.add("active");
        setTimeout(() => {
            keyElement.classList.remove("active");
        }, 300);
        
        // Get the audio file number based on note and octave
        const audioNumber = getAudioFileNumber(note, octave);
        
        if (audioNumber) {
            // Play the audio
            new Audio(`${base}key${audioNumber}.mp3`).play();
            
            // Record key press if recording is active
            recordKeyPress(note, octave);
        }
    } else {
        alert(`Key ${noteWithOctave} not found. Make sure you have the correct octave selected.`);
    }
}

// Function to parse manual key entry
function parseManualInput(input) {
    if (!input || input.trim() === "") {
        return [];
    }

    const result = [];
    let currentTime = 0;
    const timeIncrement = 500; // 500ms between sequential notes
    
    // Split by commas, but preserve brackets
    const parts = input.split(/,\s*(?![^\[]*\])/);
    
    for (let part of parts) {
        part = part.trim();
        
        if (part.startsWith('[') && part.endsWith(']')) {
            // This is a chord
            const chordNotes = part.substring(1, part.length - 1)
                .match(/[a-gA-G](#)?[1-4]?/g) || [];
            
            if (chordNotes.length > 0) {
                // Add each note in the chord with the same timestamp
                for (const noteStr of chordNotes) {
                    const { note, octave } = parseNoteAndOctave(noteStr);
                    if (note && octave) {
                        result.push({
                            note: note,
                            octave: octave,
                            timestamp: currentTime
                        });
                    }
                }
                currentTime += timeIncrement;
            }
        } else {
            // This is a single note
            const { note, octave } = parseNoteAndOctave(part);
            if (note && octave) {
                result.push({
                    note: note,
                    octave: octave,
                    timestamp: currentTime
                });
                currentTime += timeIncrement;
            }
        }
    }
    
    return result;
}

// Helper function to parse a note string into note and octave
function parseNoteAndOctave(noteStr) {
    noteStr = noteStr.trim().toUpperCase();
    
    // Match pattern like C1, D#2, etc.
    const match = noteStr.match(/^([A-G](#)?)([1-4])?$/);
    if (!match) {
        return { note: null, octave: null };
    }
    
    let note = match[1];
    let octave = match[3] ? parseInt(match[3]) : 1; // Default to octave 1 if not specified
    
    return { note, octave };
}

// Function to save playback speed to localStorage
function savePlaybackSpeed(speed) {
    try {
        localStorage.setItem('pianoPlaybackSpeed', speed.toString());
    } catch (error) {
        console.error('Error saving playback speed to localStorage:', error);
    }
}

// Function to load playback speed from localStorage
function loadPlaybackSpeed() {
    try {
        const savedSpeed = localStorage.getItem('pianoPlaybackSpeed');
        if (savedSpeed !== null) {
            return parseFloat(savedSpeed);
        }
    } catch (error) {
        console.error('Error loading playback speed from localStorage:', error);
    }
    return 1.0; // Default speed if not found or error
}

// Function to update the speed display
function updateSpeedDisplay() {
    const speedValueElement = document.getElementById('speed-value');
    if (speedValueElement) {
        speedValueElement.textContent = playbackSpeed.toFixed(2) + 'x';
    }
}

// Function to play a sequence of notes
function playSequence(sequence) {
    if (!sequence || sequence.length === 0) {
        return;
    }
    
    let lastTimestamp = 0;
    const minDelay = 500; // Minimum 500ms between notes for better playback
    
    // Calculate total duration of the sequence for looping
    const totalDuration = sequence.length > 0 ? 
        Math.max(...sequence.map(note => note.timestamp)) + minDelay : 0;
    
    sequence.forEach(noteObj => {
        // Calculate delay, ensuring at least minDelay between notes
        let delay = noteObj.timestamp - lastTimestamp;
        if (delay < minDelay) {
            delay = minDelay;
        }
        
        // Apply playback speed multiplier (only for recorded sequences)
        delay = delay / playbackSpeed;
        
        setTimeout(() => {
            const noteWithOctave = `${noteObj.note}${noteObj.octave}`;
            playKey(noteWithOctave);
        }, delay);
        
        // Update lastTimestamp based on the actual delay used
        lastTimestamp = noteObj.timestamp;
    });
    
    // If looping is enabled, restart the sequence after it finishes
    if (isLooping && totalDuration > 0) {
        const loopDelay = (totalDuration / playbackSpeed) + 100; // Add a small buffer
        setTimeout(() => {
            playSequence(sequence);
        }, loopDelay);
    }
}

// Function to check if notes are within the current octave range
function checkOctaveRange(notes, currentOctaves) {
    if (!notes || notes.length === 0) {
        return true;
    }
    
    // Find the highest octave in the notes
    const highestOctave = Math.max(...notes.map(note => 
        typeof note.octave === 'string' ? parseInt(note.octave) : note.octave
    ));
    
    return highestOctave <= currentOctaves;
}

// Initialize piano with default octaves (2)
window.onload = () => {
    console.log("Window loaded");
    
    // Load playback speed from localStorage
    playbackSpeed = loadPlaybackSpeed();
    updateSpeedDisplay();
    
    // Set the slider value to match the loaded playback speed
    const playbackSpeedSlider = document.getElementById('playback-speed');
    if (playbackSpeedSlider) {
        playbackSpeedSlider.value = playbackSpeed;
        
        // Add event listener for the playback speed slider
        playbackSpeedSlider.addEventListener('input', () => {
            playbackSpeed = parseFloat(playbackSpeedSlider.value);
            updateSpeedDisplay();
            savePlaybackSpeed(playbackSpeed);
        });
    }
    
    // Get the checked radio button value
    const checkedRadio = document.querySelector('input[name="octaves"]:checked');
    console.log("Initial octave value:", checkedRadio.value);
    
    // Generate piano with initial value
    generatePianoKeys(parseInt(checkedRadio.value));
    
    // Add event listeners for radio buttons
    octaveRadios.forEach(radio => {
        radio.addEventListener("change", (event) => {
            console.log("Radio changed to:", event.target.value);
            generatePianoKeys(parseInt(event.target.value));
        });
    });
    
    // Add event listener for play button
    const playButton = document.getElementById("play-button");
    const keyInput = document.getElementById("key-input");
    
    playButton.addEventListener("click", () => {
        playKey(keyInput.value);
    });
    
    // Add event listener for Enter key in the input field
    keyInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            playKey(keyInput.value);
        }
    });
    
    // Manual key entry controls
    const manualKeyInput = document.getElementById("manual-key-input");
    const parseManualInputButton = document.getElementById("parse-manual-input");
    const playManualInputButton = document.getElementById("play-manual-input");
    
    // Parse manual input button
    parseManualInputButton.addEventListener("click", () => {
        const input = manualKeyInput.value;
        const parsedSequence = parseManualInput(input);
        
        if (parsedSequence.length > 0) {
            recordedKeys = parsedSequence;
            updateRecordingDisplay();
        } else {
            alert("No valid keys found in the input. Please check the format.");
        }
    });
    
    // Play manual input button
    playManualInputButton.addEventListener("click", () => {
        const input = manualKeyInput.value;
        const parsedSequence = parseManualInput(input);
        
        if (parsedSequence.length > 0) {
            playSequence(parsedSequence);
        } else {
            alert("No valid keys found in the input. Please check the format.");
        }
    });
    
    // Recording controls
    const recordButton = document.getElementById("record-button");
    const clearRecordingButton = document.getElementById("clear-recording-button");
    const recordingTextarea = document.getElementById("recording-textarea");
    
    // Record button event listener
    recordButton.addEventListener("click", () => {
        if (!isRecording) {
            // Start recording
            isRecording = true;
            recordingStartTime = Date.now();
            recordedKeys = [];
            recordButton.textContent = "Stop Recording";
            recordButton.classList.add("recording");
            updateRecordingDisplay();
        } else {
            // Stop recording
            isRecording = false;
            recordButton.textContent = "Record";
            recordButton.classList.remove("recording");
        }
    });
    
    // Clear recording button event listener
    clearRecordingButton.addEventListener("click", () => {
        recordedKeys = [];
        updateRecordingDisplay();
    });
    
    // Save recording button event listener
    const saveButton = document.getElementById("save-button");
    const saveFilename = document.getElementById("save-filename");
    
    saveButton.addEventListener("click", () => {
        if (recordedKeys.length === 0) {
            alert("No recording to save. Record some keys first.");
            return;
        }
        
        const filename = saveFilename.value || "piano-recording.json";
        const recordingData = JSON.stringify(recordedKeys, null, 2);
        
        // Create a blob and download link
        const blob = new Blob([recordingData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Load recording button event listener
    const loadButton = document.getElementById("load-button");
    const loadFile = document.getElementById("load-file");
    
    loadButton.addEventListener("click", () => {
        if (!loadFile.files || loadFile.files.length === 0) {
            alert("Please select a file to load.");
            return;
        }
        
        const file = loadFile.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const loadedData = JSON.parse(event.target.result);
                
                // Validate the loaded data
                if (Array.isArray(loadedData)) {
                    // Check each item in the array
                    const isValid = loadedData.every(item => 
                        typeof item === 'object' && 
                        item !== null &&
                        typeof item.note === 'string' && 
                        (typeof item.octave === 'number' || typeof item.octave === 'string') &&
                        (typeof item.timestamp === 'number' || typeof item.timestamp === 'string')
                    );
                    
                    if (isValid) {
                        // Convert string numbers to actual numbers if needed
                        const normalizedData = loadedData.map(item => ({
                            note: item.note,
                            octave: typeof item.octave === 'string' ? parseInt(item.octave) : item.octave,
                            timestamp: typeof item.timestamp === 'string' ? parseInt(item.timestamp) : item.timestamp
                        }));
                        
                        // Check if the loaded notes are within the current octave range
                        const currentOctaves = parseInt(document.querySelector('input[name="octaves"]:checked').value);
                        if (!checkOctaveRange(normalizedData, currentOctaves)) {
                            const highestOctave = Math.max(...normalizedData.map(note => note.octave));
                            
                            if (confirm(`Warning: This recording contains notes in octave ${highestOctave}, but you only have ${currentOctaves} octaves selected. Would you like to switch to 4 octaves to hear all notes?`)) {
                                // Switch to 4 octaves
                                const fourOctavesRadio = document.querySelector('input[name="octaves"][value="4"]');
                                if (fourOctavesRadio) {
                                    fourOctavesRadio.checked = true;
                                    generatePianoKeys(4);
                                }
                            }
                        }
                        
                        recordedKeys = normalizedData;
                        updateRecordingDisplay();
                        alert("Recording loaded successfully!");
                    } else {
                        throw new Error("Invalid recording format: Some items are missing required properties");
                    }
                } else {
                    throw new Error("Invalid recording format: Not an array");
                }
            } catch (error) {
                alert("Error loading recording: " + error.message);
            }
        };
        
        reader.readAsText(file);
    });
    
    // Add a Play Recording button to the file controls
    const fileControls = document.querySelector(".file-controls");
    const playRecordingButton = document.createElement("button");
    playRecordingButton.id = "play-recording-button";
    playRecordingButton.textContent = "Play Recording";
    playRecordingButton.addEventListener("click", () => {
        if (recordedKeys.length === 0) {
            alert("No recording to play. Record some keys or load a recording first.");
            return;
        }
        
        playSequence(recordedKeys);
    });
    
    // Add the button to the file controls
    const playRecordingDiv = document.createElement("div");
    playRecordingDiv.className = "play-recording-controls";
    playRecordingDiv.appendChild(playRecordingButton);
    
    // Create Loop button
    const loopButton = document.createElement("button");
    loopButton.id = "loop-button";
    loopButton.textContent = "Loop: Off";
    loopButton.addEventListener("click", () => {
        isLooping = !isLooping;
        loopButton.textContent = isLooping ? "Loop: On" : "Loop: Off";
        
        // Add/remove active class for visual feedback
        if (isLooping) {
            loopButton.classList.add("active");
        } else {
            loopButton.classList.remove("active");
        }
    });
    
    // Add the loop button to the play recording controls
    playRecordingDiv.appendChild(loopButton);
    fileControls.appendChild(playRecordingDiv);
    
    // Allow manual editing of the recording
    recordingTextarea.addEventListener("input", () => {
        try {
            const editedData = JSON.parse(recordingTextarea.value);
            if (Array.isArray(editedData)) {
                recordedKeys = editedData;
            }
        } catch (error) {
            // Ignore parsing errors during editing
        }
    });
};
