// Базовый класс, описывающий блоки
function Block(id, className, tagName) {
  // Описываем публичные свойства
  this.id = id;
  this.className = className;

  // Описываем защищенные свойства
  this._tagName = tagName;
  this._element = null;
}

// Выносим метод отрисовки в прототип
Block.prototype.render = function() {
  // Рендерим только, если раньше не отрендерили
  if(!this._element) {
    this._element = document.createElement(this._tagName);

    if(this.id) {
      this._element.id = this.id;
    }

    this._element.className = this.className;
  }

  return this._element;
}

// Класс для меню
function Menu(id, className, items) {
  // Вызываем конструктор базового класса
  Block.call(this, id, className, 'ul');

  // Описываем дополнительные публичные свойства
  this.items = items;
}

// Наследуем прототип
Menu.prototype = Object.create(Block.prototype);
// Переопределяем метод отрисовки
Menu.prototype.render = function() {
  // Вызываем базовый метод отрисовки, чтобы получить контейнер
  Block.prototype.render.call(this);

  // Отрисовываем каждый пункт
  this.items.forEach((item) => {
    // Проверяем, что пункт меню - экземпляр Block
    // Это небольшая защита от дурака, чтобы не передавали в класс ничего лишнего
    if(item instanceof Block) {
      this._element.appendChild(item.render());
    }
  });

  return this._element;
}

// Класс для пункта меню
function MenuItem(title, href) {
  // Вызываем конструктор базового класса
  Block.call(this, null, 'menu-item', 'li');

  // Описываем дополнительные публичные свойства
  this.title = title;
  this.href = href;
}

// Наследуем прототип
MenuItem.prototype = Object.create(Block.prototype);
// Переопределяем метод отрисовки
MenuItem.prototype.render = function() {
  // Вызываем базовый метод отрисовки, чтобы получить контейнер
  Block.prototype.render.call(this);

  // Рисуем ссылку
  const $link = document.createElement('a');
  $link.textContent = this.title;
  $link.href = this.href;

  this._element.appendChild($link);

  return this._element;
}

/*
class Block {
  constructor(id, className, tagName) {
    this.id = id;
    this.className = className;
    this._tagName = tagName;
  
    this._element = null;
  }

  render() {
    if(!this._element) {
      this._element = document.createElement(this._tagName);
  
      if(this.id) {
        this._element.id = this.id;
      }
  
      this._element.className = this.className;
    }
  
    return this._element;
  }
}

class Menu extends Block {
  constructor(id, className, items) {
    super(id, className, 'ul');
  
    this.items = items;
  }

  render() {
    super.render();
  
    this.items.forEach((item) => {
      if(item instanceof Block) {
        this._element.appendChild(item.render());
      }
    });
  
    return this._element;
  }
}

class MenuItem extends Block {
  constructor(title, href) {
    super(null, 'menu-item', 'li');
  
    this.title = title;
    this.href = href;
  }

  render() {
    super.render();
  
    const $link = document.createElement('a');
    $link.textContent = this.title;
    $link.href = this.href;
  
    this._element.appendChild($link);
  
    return this._element;
  }
}
*/