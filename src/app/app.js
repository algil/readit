const {ipcRenderer} = require('electron');
const items = require('./items');
const menu = require('./menu');

//Navigate selected item with up/down keys
$(document).keydown((event) => {
  switch (event.key) {
    case 'ArrowUp':
      items.changeItem('up');
      break;
    case 'ArrowDown':
      items.changeItem('down');
      break;
  }
});

//show add-modal
$('.open-add-modal').click(() => {
  $('#add-modal').addClass('is-active');
  $('#item-input').focus();
});

//hide add-modal
$('.close-add-modal').click(() => {
  $('#add-modal').removeClass('is-active');
  $('#search').focus();
});

//handle add-modal submission
$('#add-button').click(() => {
  //get url from input
  let newItemUrl = $('#item-input').val();
  if (newItemUrl) {
    //disable modal UI
    $('#item-input').prop('disabled', true);
    $('#add-button').addClass('is-loading');
    $('.close-add-modal').addClass('is-disabled');

    ipcRenderer.send('new-item', newItemUrl);
  }
});

//listen for new item from main
ipcRenderer.on('new-item-success', (event, item) => {
  //Add item to items array
  items.toReadItems.push(item);

  //Save items
  items.saveItems();

  //add item to UI
  items.addItem(item);

  //close and reset modal
  $('#add-modal').removeClass('is-active');
  $('#item-input').prop('disabled', false).val('');
  $('#add-button').removeClass('is-loading');
  $('.close-add-modal').removeClass('is-disabled');

  if (items.toReadItems.length === 1) {
    $('.read-item:first()').addClass('is-active');
  }
});

//simulate and click on enter
$('#item-input').keyup((event) => {
  if (event.key === 'Enter') {
    $('#add-button').click();
  }
});

//filter items by title
$('#search').keyup((event) => {
  let filter = $(event.currentTarget).val();

  $('.read-item').each((index, element) => {
    $(element).text().toLowerCase().includes(filter) ? $(element).show() : $(element).hide();
  });
});

//Add items when app loads
if (items.toReadItems.length) {
  items.toReadItems.forEach(items.addItem);
  $('.read-item:first()').addClass('is-active');
}