exports.pageConfig = {
  missingImageUrls: [
    'https://www.example.com/files/default_images/0.jpg',
    'https://www.example.com/files/default_images/2.jpg',
    'https://www.example.com/files/default_images/4.jpg',
    'https://www.example.com/files/default_images/6.jpg',
  ],
  itemDetails: {
    author: {
      pattern: '#author',
      prop: 'innerText',
    },
    isbn: {
      pattern: '#isbn',
      prop: 'innerText',
    },
    title: {
      pattern: '#title',
      prop: 'innerText',
    },
    editUrl: {
      funcBody: 'return `${window.url}/edit/item.isbn`',
    },
  },

  pages: [
    {
      page: 'https://www.example.com',
      itemSelector: '.item',
      itemImage: {
        pattern: 'img',
        prop: 'src',
      },
      itemUrl: {
        funcBody: 'return parentElement.parentElement.src',
      },
    },
    {
      pages: [
        'https://www.example.com/foobar1',
        'https://www.example.com/foobar2',
        'https://www.example.com/foobar3',
        'https://www.example.com/foobar4',
      ],
      itemSelector: '.new-items',
      itemImage: {
        pattern: 'span.item-image > img',
        prop: 'src',
      },
      itemUrl: {
        pattern: 'span.link > a',
        prop: 'href',
      },
    },
  ],
};
exports.itemSchema = {};

exports.loginConfig = {
  loginUrl: 'https://www.example.com/login',
  waitBeforeSelector: '#login-element',
  usernameInputSelector: '#username',
  passwordInputSelector: '#password',
  loginButtonSelector: '#login-btn',
  waitAfterSelector: '#page',
};

exports.uploadConfig = {
  waitBeforeSelector: '#edit-window',
  uploadInputSelector: '#upload',
  submitButtonSelector: '#submit-btn',
  waitAfterSelector: '#item',
};
