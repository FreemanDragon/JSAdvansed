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
    return `<div class="item"><h3>${this.title}</h3><p>${this.price}</p></div>`
  }
}

const items = new ItemsList();
items.fetchItems().then(() => {
  document.querySelector('.catalog').innerHTML = items.render();
});