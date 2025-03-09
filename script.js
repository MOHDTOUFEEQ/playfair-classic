// Function to generate Playfair cipher key square
function generatePlayfairKeySquare(key) {
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+={}[\\]:;"\'<>,.?/\\|`~';
    let uniqueKeyChars = Array.from(new Set(key.toUpperCase().replace(/[^A-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/g, ''))); // Remove non-alphanumeric characters
    let keySquare = uniqueKeyChars;

    // Fill remaining positions with the alphabet
    for (let char of alphabet) {
        if (!keySquare.includes(char)) {
            keySquare.push(char);
        }
    }

    let square = [];
    for (let i = 0; i < 5; i++) {
        square.push(keySquare.slice(i * 5, i * 5 + 5));
    }

    return square;
}

// Function to find the position of a character in the key square
function findPosition(keySquare, char) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (keySquare[row][col] === char) {
                return { row, col };
            }
        }
    }
    // Return null or an error message if the character is not found
    return null; // Change this to handle the error gracefully
}


// Function to prepare the text for encryption (including symbols and numbers)
function prepareTextWithSymbols(text) {
    text = text.toUpperCase().replace(/[^A-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]/g, ''); // Keep symbols and numbers
    let digraphs = [];

    for (let i = 0; i < text.length; i += 2) {
        if (i + 1 < text.length) {
            if (text[i] === text[i + 1]) {
                digraphs.push(text[i] + 'X'); // Add 'X' to avoid repeated letters
                i--; // Recheck the same letter
            } else {
                digraphs.push(text[i] + text[i + 1]);
            }
        } else {
            digraphs.push(text[i] + 'X'); // Add 'X' if last character is single
        }
    }

    return digraphs;
}

// Encryption function for the updated cipher (handles symbols and numbers)
function updatedEncryptText() {
    let inputText = document.getElementById('updatedInputText').value;
    let key = document.getElementById('updatedKey').value;

    let keySquare = generatePlayfairKeySquare(key); // Generate the key square using the updated key
    let digraphs = prepareTextWithSymbols(inputText); // Prepare text for ciphering
    let ciphertext = '';

    for (let digraph of digraphs) {
        let pos1 = findPosition(keySquare, digraph[0]);
        let pos2 = findPosition(keySquare, digraph[1]);

        // Check if both positions are valid (not null)
        if (pos1 === null || pos2 === null) {
            console.error(`Character(s) not found in key square: ${digraph}`);
            return; // Stop further processing if the character is not found
        }

        // Same row
        if (pos1.row === pos2.row) {
            ciphertext += keySquare[pos1.row][(pos1.col + 1) % 5];
            ciphertext += keySquare[pos2.row][(pos2.col + 1) % 5];
        }
        // Same column
        else if (pos1.col === pos2.col) {
            ciphertext += keySquare[(pos1.row + 1) % 5][pos1.col];
            ciphertext += keySquare[(pos2.row + 1) % 5][pos2.col];
        }
        // Rectangle case
        else {
            ciphertext += keySquare[pos1.row][pos2.col];
            ciphertext += keySquare[pos2.row][pos1.col];
        }
    }

    document.getElementById('updatedOutputText').value = ciphertext;
}

// Decryption function for the updated cipher (handles symbols and numbers)
function updatedDecryptText() {
    let inputText = document.getElementById('updatedInputText').value;
    let key = document.getElementById('updatedKey').value;

    let keySquare = generatePlayfairKeySquare(key); // Generate the key square using the updated key
    let digraphs = prepareTextWithSymbols(inputText); // Prepare text for ciphering
    let plaintext = '';

    for (let digraph of digraphs) {
        let pos1 = findPosition(keySquare, digraph[0]);
        let pos2 = findPosition(keySquare, digraph[1]);

        // Same row
        if (pos1.row === pos2.row) {
            plaintext += keySquare[pos1.row][(pos1.col + 4) % 5];
            plaintext += keySquare[pos2.row][(pos2.col + 4) % 5];
        }
        // Same column
        else if (pos1.col === pos2.col) {
            plaintext += keySquare[(pos1.row + 4) % 5][pos1.col];
            plaintext += keySquare[(pos2.row + 4) % 5][pos2.col];
        }
        // Rectangle case
        else {
            plaintext += keySquare[pos1.row][pos2.col];
            plaintext += keySquare[pos2.row][pos1.col];
        }
    }

    document.getElementById('updatedOutputText').value = plaintext;
}

// Function to generate the standard Playfair cipher key square (for regular alphabetic characters)
function generateStandardPlayfairKeySquare(key) {
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    let uniqueKeyChars = Array.from(new Set(key.toUpperCase().replace(/[^A-Z]/g, ''))); // Remove non-alphabet characters
    let keySquare = uniqueKeyChars;

    // Fill remaining positions with the alphabet
    for (let char of alphabet) {
        if (!keySquare.includes(char)) {
            keySquare.push(char);
        }
    }

    let square = [];
    for (let i = 0; i < 5; i++) {
        square.push(keySquare.slice(i * 5, i * 5 + 5));
    }

    return square;
}

// Function to encrypt using the standard Playfair cipher
function encryptText() {
    let inputText = document.getElementById('inputText').value;
    let key = document.getElementById('key').value;

    let keySquare = generateStandardPlayfairKeySquare(key); // Generate the key square using the key
    let digraphs = prepareTextWithSymbols(inputText); // Prepare text for ciphering
    let ciphertext = '';

    for (let digraph of digraphs) {
        let pos1 = findPosition(keySquare, digraph[0]);
        let pos2 = findPosition(keySquare, digraph[1]);

        // Same row
        if (pos1.row === pos2.row) {
            ciphertext += keySquare[pos1.row][(pos1.col + 1) % 5];
            ciphertext += keySquare[pos2.row][(pos2.col + 1) % 5];
        }
        // Same column
        else if (pos1.col === pos2.col) {
            ciphertext += keySquare[(pos1.row + 1) % 5][pos1.col];
            ciphertext += keySquare[(pos2.row + 1) % 5][pos2.col];
        }
        // Rectangle case
        else {
            ciphertext += keySquare[pos1.row][pos2.col];
            ciphertext += keySquare[pos2.row][pos1.col];
        }
    }

    document.getElementById('outputText').value = ciphertext;
}

// Function to decrypt using the standard Playfair cipher
function decryptText() {
    let inputText = document.getElementById('inputText').value;
    let key = document.getElementById('key').value;

    let keySquare = generateStandardPlayfairKeySquare(key); // Generate the key square using the key
    let digraphs = prepareTextWithSymbols(inputText); // Prepare text for ciphering
    let plaintext = '';

    for (let digraph of digraphs) {
        let pos1 = findPosition(keySquare, digraph[0]);
        let pos2 = findPosition(keySquare, digraph[1]);

        // Same row
        if (pos1.row === pos2.row) {
            plaintext += keySquare[pos1.row][(pos1.col + 4) % 5];
            plaintext += keySquare[pos2.row][(pos2.col + 4) % 5];
        }
        // Same column
        else if (pos1.col === pos2.col) {
            plaintext += keySquare[(pos1.row + 4) % 5][pos1.col];
            plaintext += keySquare[(pos2.row + 4) % 5][pos2.col];
        }
        // Rectangle case
        else {
            plaintext += keySquare[pos1.row][pos2.col];
            plaintext += keySquare[pos2.row][pos1.col];
        }
    }

    document.getElementById('outputText').value = plaintext;
}
