// Описания товаров
const productDescriptions = {
  1: "Летнее платье: Легкое платье из хлопка с цветочным принтом. Короткий рукав, А-силуэт, длина до колена. Идеально для жаркого дня и прогулок по городу.",
  2: "Уютный свитер: Мягкий свитер крупной вязки с высоким воротом. Теплый и объемный, идеально подходит для холодных вечеров. Приятный бежевый оттенок.",
  3: "К сожалению, товар закончился.",
  4: "Классический костюм: Строгий костюм-двойка темно-синего цвета. Приталенный пиджак и прямые брюки. Подходит для деловых встреч и торжественных мероприятий.",
  5: "Спортивный комплект: Удобный спортивный костюм из эластичной ткани. Толстовка на молнии и облегающие леггинсы. Отличный выбор для тренировок и активного отдыха.",
  // Добавьте описания для остальных товаров
};

// Модальное окно для товара
const modal = document.getElementById('modal');
const openModalButtons = document.querySelectorAll('.open-modal');
const closeModalButtons = document.querySelectorAll('.close');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const productId = card.getAttribute('data-id');
    const productName = card.querySelector('h3').innerText;
    modalTitle.innerText = productName;
    modalDescription.innerText = productDescriptions[productId];
    modal.style.display = 'flex';
  });
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'none';
    cartModal.style.display = 'none';
  });
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

// Корзина
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItems = document.getElementById('cart-items');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.getElementById('cart-count');

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const productId = card.getAttribute('data-id');
    const productName = card.querySelector('h3').innerText;
    const productPrice = card.querySelector('p').innerText;
    const selectedSize = card.querySelector('.size-select').value;

    if (!selectedSize) {
      alert("Пожалуйста, выберите размер!");
      return;
    }

    const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, name: productName, price: productPrice, size: selectedSize, quantity: 1 });
    }
    updateCart();
    saveCartToLocalStorage();
  });
});

cartIcon.addEventListener('click', () => {
  cartModal.style.display = 'flex';
});

function updateCart() {
  cartItems.innerHTML = '';
  let totalCount = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} (${item.size}) - ${item.price} 
      <button onclick="changeQuantity('${item.id}', '${item.size}', -1)">-</button>
      ${item.quantity}
      <button onclick="changeQuantity('${item.id}', '${item.size}', 1)">+</button>
      <button onclick="removeItem('${item.id}', '${item.size}')">Удалить</button>
    `;
    cartItems.appendChild(li);
    totalCount += item.quantity;
  });
  cartCount.innerText = totalCount;
}

function changeQuantity(id, size, delta) {
  const item = cart.find(item => item.id === id && item.size === size);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeItem(id, size);
    else updateCart();
  }
  saveCartToLocalStorage();
}

function removeItem(id, size) {
  const index = cart.findIndex(item => item.id === id && item.size === size);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
  }
  saveCartToLocalStorage();
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Инициализация корзины при загрузке страницы
updateCart();

// Оформление заказа
document.getElementById('checkout').addEventListener('click', () => {
  const contactForm = document.getElementById('contact-form');
  const messageField = document.getElementById('message');

  let message = 'Заказ:\n';
  cart.forEach(item => {
    message += `${item.name} (${item.size}) - ${item.price} x ${item.quantity}\n`;
  });

  messageField.value = message;
  contactForm.style.display = 'block';
  cartModal.style.display = 'none';

  // Прокрутка к контактной форме
  contactForm.scrollIntoView({ behavior: 'smooth' });
});

// Отправка формы в WhatsApp
document.getElementById('order-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;

  const phoneNumber = "79198962818"; // Замените на ваш номер телефона
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Имя: ${name}\n${message}`)}`;
  window.open(url, '_blank');
});

// Темный режим
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.innerText = body.dataset.theme === 'dark' ? '☀️' : '🌙';
});
