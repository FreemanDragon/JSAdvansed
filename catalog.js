function sendRequest(url) {
  // pending->fulfulled|rejected
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status !== 200) {
          reject();
        }
        const goods = JSON.parse(xhr.responseText);

        resolve(goods);
      }
    };
    xhr.send();
  });
}

class ItemsList {
  constructor(container = ".products", url = "/goods") {
    this.items = [];
    this.container = container;
    this.url = url;
  }

  fetchItems() {
    return sendRequest(this.url)
      .then((items) => {
        this.items = items;
      });
  }

  render() {
    return this.items.map((item) => new Item(item.title, item.price).render()).join('');
  }
}

class Item {
  constructor(id, title, price, img = `https://placehold.it/200x150` ) {
    this.price = price;
    this.title = title;
    this.img = img;
    this.id = id;
  }

  render() {
    return `<div class="product-item">
                 <img src="${this.img}" alt="${this.title}">
                 <div class="desc">
                     <h3>${this.title}</h3>
                     <p>Цена: ${this.price}</p>
                     <button class="buy-btn" 
                        data-id="${this.id}"
                       data-title="${this.title}"
                       data-price="${this.price}"
                     >Купить</button>
                 </div>
             </div>`
  }
};

class Cart {
  constructor(container = ".cart", url = "/cart") {
    this.items = [];
    this.element = null;
    this.url = url;
    this.container = container;
  }

  fetchItems() {
    return sendRequest(this.url)
        .then((items) => {
          this.items = items;
        });
  }

  add(item) {
    this.items.push(item);
  }

  update(id, newQty) {

  }

  renderItem(item) {

  }

  _countQuantity(){ // Подсчет количества товаров в корзине
    return  this.items.reduce((sum, item) => sum + item.quantity(), 0);
    // console.log(`Общая стоимость товаров в каталоге равна ${price} у.е`);
  }

  render() {
    const block = document.querySelector(this.container);
    for (let item of this.items){
      const product = new CartItems(item);
      this.items[this.items.indexOf(item)] = product;
      block.insertAdjacentHTML('beforeend', product.render());
    }
    if (this.items == 0)
      block.innerHTML = 'Корзина пуста';
    else block.insertAdjacentHTML('beforeend', `<p>Вы выбрали ${this._countQuantity()} товаров на сумму ${this.total()} у.е.`);
  }

  total() {
    return this.items.reduce((acc, item) => acc + item.quantity() * item.price, 0);
  }
}

class CartItems {
  constructor(id, title, price, img = `https://placehold.it/200x150` ) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.img = img;
  }
  
  quantity(qnt = 1) {
    return function (q) {
      q = qnt;
      return q;
    }
  }
  render() {
    this.quantity(1);
    return `<div class="product-item-cart" data-id="${this.id}">
                 <img src="${this.img}" alt="${this.title}">
                 <div class="desc-cart">
                     <h3>${this.title}</h3>
                     <p>${this.price}</p>
                     <input type="number" class="quantity" data-id="${this.id}" value="${this.quantity()}">
                     <p>${this.totalPrice}</p>
                     <button class="del-btn">Удалить</button>
                 </div>
             </div>`
  }
}

const items = new ItemsList();
items.fetchItems().then(() => {
  document.querySelector('.products').innerHTML = items.render();
});
const cart = new Cart();
cart.fetchItems().then(() => {
  cart.render();
});
document.querySelector('.products').addEventListener('click', (event) =>{
  if(event.target.classList.contains('buy-btn')) {
    const id = event.target.dataset.id;
    const $item = document.querySelector(`.cart div[data-id="${id}"]`);
    if($item) {
      const $currentQty = $item.querySelector('.quantity');
      $currentQty.value = +$currentQty.value + 1;
      cart.update(id, +$currentQty.value);
    } else {
      cart.add(event.target.dataset);
    }
    document.querySelector('.total').innerHTML = cart.total();
  }
});
document.querySelector('.cart').addEventListener('change', (event) => {
  if(event.target.classList.contains('quantity')) {
    const $parent = event.target.parentElement;
    if(!cart.update($parent.dataset.id, +event.target.value)) {
      event.target.value = 1;
    }
    document.querySelector('.total').innerHTML = cart.total();
  }
});