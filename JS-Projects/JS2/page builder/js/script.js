function addElement() {
    const elementId = document.getElementById('elementId').value;
    const elementType = document.getElementById('elementType').value;
    const elementWidth = document.getElementById('elementWidth').value;
    const elementHeight = document.getElementById('elementHeight').value;
    const elementContent = document.getElementById('elementContent').value;
    const fontColor = document.getElementById('fontColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const fontSize = document.getElementById('fontSize').value;
    const fontType = document.getElementById('fontType').value;
    const borderColor = document.getElementById('borderColor').value;
    const borderStyle = document.getElementById('borderStyle').value;
    const borderThickness = document.getElementById('borderThickness').value;
    const padding = document.getElementById('padding').value;
    const margin = document.getElementById('margin').value;
    const shadowX = document.getElementById('shadowX').value;
    const shadowY = document.getElementById('shadowY').value;
    const borderRadius = document.getElementById('borderRadius').value;

    // Create the new element
    const newElement = document.createElement(elementType);
    if (elementId) newElement.id = elementId; // Set the ID attribute if provided
    newElement.style.width = elementWidth ? `${elementWidth}px` : 'auto';
    newElement.style.height = elementHeight ? `${elementHeight}px` : 'auto';
    newElement.style.color = fontColor;
    newElement.style.backgroundColor = bgColor;
    newElement.style.fontSize = `${fontSize}px`;
    newElement.style.fontFamily = fontType;
    newElement.textContent = elementContent;

    // Set border properties
    newElement.style.border = `${borderThickness}px ${borderStyle} ${borderColor}`;

    // Set padding and margin properties
    newElement.style.padding = padding ? `${padding}px` : '0px';
    newElement.style.margin = margin ? `${margin}px` : '0px';

    // Set shadow properties
    newElement.style.boxShadow = `${shadowX}px ${shadowY}px 5px rgba(0, 0, 0, 0.5)`;

    // Set border radius
    newElement.style.borderRadius = borderRadius ? `${borderRadius}px` : '0px';

    // Append the new element to the container
    document.getElementById('container').appendChild(newElement);

    // Automatically save after adding an element
    saveElements();
}

// Function to save the elements in the container to localStorage
function saveElements() {
    const container = document.getElementById('container');
    localStorage.setItem('savedElements', container.innerHTML);
    alert('אלמנטים נשמרו!');
}
// Function to load saved elements from localStorage
function loadSavedElements() {
    const savedElements = localStorage.getItem('savedElements');
    if (savedElements) {
        document.getElementById('container').innerHTML = savedElements;
    }
}
// Function to clear the screen and localStorage
function clearScreen() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    sessionStorage.clear('container');
    alert('המסך נוקה בהצלחה!');
}

