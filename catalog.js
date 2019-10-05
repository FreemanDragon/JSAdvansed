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
        const users = JSON.parse(xhr.responseText);

        resolve(users);
      }
    };
    xhr.send();
  });
}

class ItemsList {
  constructor() {
    this.items = [];
  }

  fetchItems() {
    return sendRequest('/goods')
      .then((items) => {
        this.items = items;
      });
  }

  total() {
    // let total = 0;
    // this.items.forEach((item) => {
    //   total += item.price;
    // });

    // for(let i = 0; i < this.items.length; i++) {
    //   total += this.items[i].price;
    // }

    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  render() {
    return this.items.map((item) => new Item(item.title, item.price).render()).join('');
  }
}

class Item {
  constructor(title, price) {
    this.price = price;
    this.title = title;
  }

  render() {
    return `<div class="product-item"><h3>${this.title}</h3><p>${this.price}</p></div>`
  }
};

class Cart {
  constructor() {
    this.items = [];
    this.element = null;
  }

  fetchItems() {
    return fetch('/cart')
        .then(response => response.json())
        .then((items) => {
          this.items = items;
        });
  }

  add(item) {
    fetch('/cart', {
      method: 'POST',
      body: JSON.stringify({...item, qty: 1}),
      headers: {
        'Content-type': 'application/json',
      },
    })
        .then((response) => response.json())
        .then((item) => {
          this.element.insertAdjacentHTML('beforeend', this.renderItem(item));
        });
    this.items.push({...item, qty: 1});
  }

  update(id, newQty) {
    if(newQty < 1) {
      if(confirm('Вы действительно хотите удалить товар из корзины?')) {
        fetch(`/cart/${id}`, {
          method: 'DELETE',
        })
            .then(response => response.json())
            .then((item) => {
              const $item = document.querySelector(`.cart li[data-id="${id}"]`);
              if($item) {
                $item.remove();
              }
            });
        const idx = this.items.findIndex(entity => entity.id === id);
        this.items.splice(idx, 1);
      } else {
        return false;
      }
    } else {
      fetch(`/cart/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({qty: newQty}),
        headers: {
          'Content-type': 'application/json',
        },
      })
          .then(response => response.json())
          .then((item) => {
            console.log('Обновление количества прошло успешно!');
          });

      const idx = this.items.findIndex(entity => entity.id === id);
      this.items[idx].qty = newQty;
    }

    return true;
  }

  renderItem(item) {
    return `<li data-id="${item.id}">
        <h3>${item.title}</h3>
        <input class="qty" type="number" value="${item.qty}" />
      </li>`
  }

  render() {
    if(!this.element) {
      this.element = document.createElement('ul');

      this.element.innerHTML = this.items.map(this.renderItem).join('');
    }

    return this.element;
  }

  total() {
    return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  }
}

const items = new ItemsList();
const cart = new Cart();
items.fetchItems().then(() => {
  document.querySelector('.products').innerHTML = items.render();
});