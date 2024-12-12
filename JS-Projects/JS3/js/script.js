class MenuItem {
  constructor(name, weight, category, price, inStock) {
    this.name = name;
    this.weight = weight;
    this.category = category;
    this.price = price;
    this.inStock = inStock;
  }
}

class CartItem {
  constructor(menuItem) {
    this.menuItem = menuItem;
    this.quantity = 1;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice() {
    return this.menuItem.price * this.quantity;
  }
}

let menu = JSON.parse(localStorage.getItem("menu")) || [];
menu = menu.map(
  (item) =>
    new MenuItem(
      item.name,
      item.weight,
      item.category,
      item.price,
      item.inStock
    )
);
let cart = [];

function addDish(event) {
  event.preventDefault();
  const name = document.getElementById("dish-name").value;
  const weight = parseInt(document.getElementById("dish-weight").value);
  const category = document.getElementById("dish-category").value;
  const price = parseFloat(document.getElementById("dish-price").value);
  const inStock = document.getElementById("dish-stock").checked;

  const newDish = new MenuItem(name, weight, category, price, inStock);
  menu.push(newDish);

  updateMenuList();
  updateCustomerView();
  event.target.reset();
}

function updateMenuList() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  menu.forEach((dish, index) => {
    const item = document.createElement("div");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
                    <span>${dish.name} - ${dish.weight}g - ${
      dish.category === "first" ? "ראשונה" : "עיקרית"
    } - ₪${dish.price.toFixed(2)} (${
      dish.inStock ? "במלאי" : "אזל מהמלאי"
    })</span>
                    <div>
                        <button class="btn btn-sm btn-warning me-2" onclick="editDish(${index})">
                            <i class="fas fa-edit"></i> ערוך
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmRemoveDish(${index})">
                            <i class="fas fa-trash"></i> הסר
                        </button>
                    </div>
                `;
    menuList.appendChild(item);
  });
  localStorage.setItem("menu", JSON.stringify(menu));
}

function updateCustomerView() {
  const dishCards = document.getElementById("dish-cards");
  dishCards.innerHTML = "";
  menu.forEach((dish, index) => {
    if (dish.inStock) {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
                        <div class="card dish-card">
                            <div class="card-body">
                                <h5 class="card-title">${dish.name}</h5>
                                <p class="card-text">משקל: ${dish.weight}g</p>
                                <p class="card-text">קטגוריה: ${
                                  dish.category === "first"
                                    ? "ראשונה"
                                    : "עיקרית"
                                }</p>
                                <p class="card-text">מחיר: ₪${dish.price.toFixed(
                                  2
                                )}</p>
                                <button class="btn btn-primary" onclick="addToCart(${index})">
                                    <i class="fas fa-cart-plus"></i> הוסף לעגלה
                                </button>
                            </div>
                        </div>
                    `;
      dishCards.appendChild(card);
    }
  });
}

function addToCart(index) {
  const menuItem = menu[index];
  const existingCartItem = cart.find(
    (item) => item.menuItem.name === menuItem.name
  );

  if (existingCartItem) {
    existingCartItem.increaseQuantity();
  } else {
    cart.push(new CartItem(menuItem));
  }

  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
                    ${item.menuItem.name} - ₪${item
      .getTotalPrice()
      .toFixed(2)} (x${item.quantity})
                    <div>
                        <button class="btn btn-sm btn-secondary me-1" onclick="decreaseQuantity(${index})">-</button>
                        <button class="btn btn-sm btn-secondary me-1" onclick="increaseQuantity(${index})">+</button>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
    cartItems.appendChild(li);
    total += item.getTotalPrice();
  });

  cartTotal.textContent = total.toFixed(2);
}

function increaseQuantity(index) {
  cart[index].increaseQuantity();
  updateCart();
}

function decreaseQuantity(index) {
  cart[index].decreaseQuantity();
  if (cart[index].quantity === 0) {
    removeFromCart(index);
  } else {
    updateCart();
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function editDish(index) {
  const dish = menu[index];
  document.getElementById("dish-name").value = dish.name;
  document.getElementById("dish-weight").value = dish.weight;
  document.getElementById("dish-category").value = dish.category;
  document.getElementById("dish-price").value = dish.price;
  document.getElementById("dish-stock").checked = dish.inStock;
  menu.splice(index, 1);
  updateMenuList();
  updateCustomerView();
}

function confirmRemoveDish(index) {
  if (confirm("האם אתה בטוח שברצונך להסיר מנה זו?")) {
    menu.splice(index, 1);
    updateMenuList();
    updateCustomerView();
  }
}

function placeOrder() {
  if (cart.length === 0) {
    alert("העגלה ריקה. אנא הוסף פריטים לפני ביצוע ההזמנה.");
    return;
  }
  alert("ההזמנה בוצעה בהצלחה!");
  cart = [];
  updateCart();
}

function searchMenu(query) {
  const lowercaseQuery = query.toLowerCase();
  const filteredMenu = menu.filter((dish) =>
    dish.name.toLowerCase().includes(lowercaseQuery)
  );
  updateMenuList(filteredMenu);
  updateCustomerView(filteredMenu);
}

document.getElementById("dish-form").addEventListener("submit", addDish);
document
  .getElementById("menu-search")
  .addEventListener("input", (e) => searchMenu(e.target.value));
document
  .getElementById("customer-search")
  .addEventListener("input", (e) => searchMenu(e.target.value));

// Add initial dishes
const initialDishes = [
  new MenuItem("סלט ירוק", 250, "first", 35, true),
  new MenuItem("מרק היום", 300, "first", 28, true),
  new MenuItem("פוקצ'ה", 200, "first", 32, true),
  new MenuItem("קרפצ'יו בקר", 180, "first", 62, true),
  new MenuItem("פיצה מרגריטה", 450, "main", 58, true),
  new MenuItem("פסטה ברוטב עגבניות", 380, "main", 52, true),
  new MenuItem("המבורגר", 320, "main", 65, true),
  new MenuItem("סטייק אנטריקוט", 300, "main", 128, true),
];

if (menu.length === 0) {
  initialDishes.forEach((dish) => menu.push(dish));
}

updateMenuList();
updateCustomerView();
