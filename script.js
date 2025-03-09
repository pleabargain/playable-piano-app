const pianoContainer = document.querySelector(".piano-container");
const octaveRadios = document.querySelectorAll('input[name="octaves"]');
const base = "./audio/";

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
            
            // For playing audio on click
            const audioIndex = (i % 24) + 1;
            const audioNumber = audioIndex <= 9 ? "0" + audioIndex : audioIndex;
            
            key.addEventListener("click", () => {
                new Audio(`${base}key${audioNumber}.mp3`).play();
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
            
            // For playing audio on click
            const audioIndex = (i % 24) + 1;
            const audioNumber = audioIndex <= 9 ? "0" + audioIndex : audioIndex;
            
            key.addEventListener("click", () => {
                new Audio(`${base}key${audioNumber}.mp3`).play();
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
        
        // Get the audio index from the key's dataset
        const index = keyElement.dataset.index;
        const audioIndex = (index % 24) + 1;
        const audioNumber = audioIndex <= 9 ? "0" + audioIndex : audioIndex;
        
        // Play the audio
        new Audio(`${base}key${audioNumber}.mp3`).play();
    } else {
        alert(`Key ${noteWithOctave} not found. Make sure you have the correct octave selected.`);
    }
}

// Initialize piano with default octaves (2)
window.onload = () => {
    console.log("Window loaded");
    
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
};
