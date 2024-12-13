const cardContainer = document.querySelector(".card-container");
cardContainer.innerHTML = ""; // Clear existing content

let gameEmojis = [];
let flippedCards = [];
let canFlip = false;

// Function to fetch a random Pokemon
async function fetchRandomPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1; // As of now, there are 898 Pokémon
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  return data.sprites.front_default; // URL of the Pokémon image
}

// Function to initialize the game
async function initializeGame() {
  const uniqueCards = [];
  const duplicates = [];

  // Fetch 8 unique Pokémon images
  while (uniqueCards.length < 8) {
    const sprite = await fetchRandomPokemon();
    if (sprite && !uniqueCards.includes(sprite)) {
      uniqueCards.push(sprite);
    }
  }

  // Duplicate each image for matching
  duplicates.push(...uniqueCards, ...uniqueCards);

  // Shuffle the duplicated array
  gameEmojis = duplicates.sort(() => Math.random() - 0.5);

  // Generate the card elements
  for (let i = 0; i < gameEmojis.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = gameEmojis[i]; // Store the image URL in a data attribute

    const frontFace = document.createElement("img");
    frontFace.src = gameEmojis[i];
    frontFace.classList.add("front-face");
    frontFace.style.display = "none"; // Hide the image initially

    const backFace = document.createElement("div");
    backFace.classList.add("back-face");
    backFace.textContent = "❓"; // You can customize the back face

    card.appendChild(frontFace);
    card.appendChild(backFace);
    cardContainer.appendChild(card);
  }

  // Add click event listeners to all cards
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => flipCard(card));
  });

  // Show all cards for 5 seconds before starting the game
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("flipped");
    card.querySelector(".front-face").style.display = "block";
  });

  setTimeout(() => {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("flipped");
      card.querySelector(".front-face").style.display = "none";
    });
    // Enable card flipping after the initial reveal
    canFlip = true;
  }, 5000); // 5000 milliseconds = 5 seconds
}

function flipCard(card) {
  if (
    !canFlip ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("flipped");
  card.querySelector(".front-face").style.display = "block";
  card.querySelector(".back-face").style.display = "none";
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    canFlip = false;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    canFlip = true;
    celebrate(); // Call the celebrate function when a match is found
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.querySelector(".front-face").style.display = "none";
      card1.querySelector(".back-face").style.display = "block";
      card2.querySelector(".front-face").style.display = "none";
      card2.querySelector(".back-face").style.display = "block";
      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

function celebrate() {
  // You can add celebration effects here
  console.log("It's a match!");
}

// Initialize the game on page load
initializeGame();


