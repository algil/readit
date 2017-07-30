const {shell} = require('electron');

//Track items with array
exports.toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || [];

//Save items to localStorage
exports.saveItems = () => {
  localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems));
};

//Toggle item as selected
exports.selectItem = (event) => {
  $('.read-item').removeClass('is-active');
  $(event.currentTarget).addClass('is-active');
};

//Delete item by index
window.deleteItem = (index = false) => {
  //Set i to active item if not passed as argument
  if (index === false) {
    index = ($('.read-item.is-active').index() - 1);
  }

  //Remove item from DOM
  $('.read-item').eq(index).remove();

  //Remove from array
  this.toReadItems = this.toReadItems.filter((item, itemIndex) => itemIndex !== index);

  //Update storage
  this.saveItems();

  //Select prev item or none if list is empty
  if (this.toReadItems.length) {
    //If first item was deleted, select new first in list, else previous item
    let newIndex = (index === 0) ? 0 : index - 1;
    $('.read-item').eq(newIndex).addClass('is-active');

  } else {
    $('#no-items').show();
  }
};

//Select next/prev item
exports.changeItem = (direction) => {
  //Get current active item
  let currentItem = $('.read-item.is-active');

  //Check direction and get next or previous read-item
  let newItem = (direction === 'down') ? currentItem.next('.read-item') : currentItem.prev('.read-item');

  if (newItem.length) {
    currentItem.removeClass('is-active');
    newItem.addClass('is-active');
  }
};

//Open item in default browser
window.openInBrowser = () => {
  if (this.toReadItems.length > 0) {
    let targetItem = $('.read-item.is-active');
    shell.openExternal(targetItem.data('url'));
  }
};

//Open item for reading
window.openItem = () => {
  //Only if items have been added
  if (this.toReadItems.length) {
    //Get selected item
    let targetItem = $('.read-item.is-active');

    //Get item content URL
    let contentURL = encodeURIComponent(targetItem.data('url'));

    //Get item index to pass to proxy window
    let itemIndex = targetItem.index() - 1;

    //Reader window URL
    let readerWindowUrl = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`;

    //Open item in new proxy BrowserWindow
    let readerWindow = window.open(readerWindowUrl, targetItem.data('title'))
  }
};

//Add new item
exports.addItem = (item) => {
  $('#no-items').hide();

  let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                    <figure class="image has-shadow is-64x64 thumb">
                      <img src="${item.screenshot}">
                    </figure>
                    <h2 class="title is-4 column">${item.title}</h2>
                  </a>`;

  $('#read-list').append(itemHTML);

  //Attach select event handler
  $('.read-item')
    .off('click, dblclick')
    .on('click', this.selectItem)
    .on('dblclick', window.openItem);
};