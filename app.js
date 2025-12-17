let menu = {};
let cart = {};
let discountPercent = 0;

/* Load menu.json */
fetch("menu.json")
  .then(res => res.json())
  .then(data => {
    menu = data;
    renderMenu();
  });

function renderMenu() {
  const container = document.getElementById("menu");
  container.innerHTML = "";

  for (let category in menu) {
    container.innerHTML += `<h2 class="category">${category}</h2>`;

    menu[category].forEach(item => {

      /* Pizza with sizes */
      if (item.sizes) {
        Object.keys(item.sizes).forEach(size => {
          const key = item.name + "_" + size;

          if (!cart[key]) {
            cart[key] = {
              name: `${item.name} (${size})`,
              price: item.sizes[size],
              qty: 0
            };
          }

          container.innerHTML += itemRow(cart[key], key);
        });
      }

      /* Normal & combo items */
      else {
        const key = item.name;

        if (!cart[key]) {
          cart[key] = {
            name: item.name,
            price: item.price,
            qty: 0
          };
        }

        container.innerHTML += itemRow(cart[key], key);
      }
    });
  }

  calculateTotal();
}

function itemRow(item, key) {
  return `
    <div class="item">
      <div>
        <b>${item.name}</b><br>
        ₹${item.price}
      </div>
      <div class="qty">
        <button onclick="updateQty('${key}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty('${key}', 1)">+</button>
      </div>
    </div>
  `;
}

function updateQty(key, change) {
  cart[key].qty = Math.max(0, cart[key].qty + change);
  renderMenu();
}

function calculateTotal() {
  let subtotal = 0;

  for (let k in cart) {
    subtotal += cart[k].qty * cart[k].price;
  }

  let discountAmount = subtotal * (discountPercent / 100);
  let grandTotal = subtotal - discountAmount;

  document.getElementById("subtotal").innerText = subtotal.toFixed(0);
  document.getElementById("discount").innerText = discountAmount.toFixed(0);
  document.getElementById("grand").innerText = grandTotal.toFixed(0);
}

function applyDiscount() {
  discountPercent = Number(prompt("Enter discount %")) || 0;
  calculateTotal();
}
