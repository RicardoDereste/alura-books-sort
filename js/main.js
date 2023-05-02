let books = []
const endPointAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
getSearchBooksAPI()

const elementInsertBooks = document.getElementById('books')
const elementValueTotalBooksAvailable = document.getElementById('total-amount-books-available')

async function getSearchBooksAPI() {
    const res = await fetch(endPointAPI)
    books = await res.json()
    let booksDiscount = applyDiscount(books)
    displayBooks(booksDiscount)
}

function displayBooks(listBooks) {
    elementValueTotalBooksAvailable.innerHTML = ''
    elementInsertBooks.innerHTML = ''
    listBooks.forEach(book => {
        let availability = checkBookAvailability(book)
        elementInsertBooks.innerHTML += `
        <div class="book">
            <img class="${availability}" src="${book.imagem}" alt="${book.alt}"/>
            <h2 class="book-title">
                ${book.titulo}
            </h2>
            <p class="book-description">${book.autor}</p>
            <p class="book-price" id="price">R$${book.preco.toFixed(2)}</p>
            <div class="tags">
                <span class="tag">${book.categoria}</span>
            </div>
        </div>
        `
    });
}

function applyDiscount(books) {
    const discount = 0.3
    booksDiscount = books.map(book => {
        return {...book, preco: book.preco - (book.preco * discount)}
    })
    return booksDiscount
}

const buttons = document.querySelectorAll('.btn')
buttons.forEach(btn => btn.addEventListener('click', filterBooks))

function filterBooks() {
    const elementBtn = document.getElementById(this.id)
    const categoria = elementBtn.value
    let booksFiltered = categoria == 'available' ? filterAvailability() : filterCategory(categoria)
    displayBooks(booksFiltered)
    if (categoria == 'available') {
        const totalAmount = calculateTotalAmountBooksAvailable(booksFiltered)
        displayValueBooksAvailable(totalAmount)
    }
}

function filterCategory(categoria) {
    return books.filter(book => book.categoria == categoria)
}

function filterAvailability() {
    return books.filter(book => book.quantidade > 0)
}

function displayValueBooksAvailable(totalAmount) {
    elementValueTotalBooksAvailable.innerHTML = `
        <div class="books-available">
            <p>All books available for R$ <span id="value">${totalAmount}</span></p>
        </div>
    `
}

let btnOrderPrice = document.getElementById('btnSortByPrice')
btnOrderPrice.addEventListener('click', orderPrice)

function orderPrice() {
    let booksOrdered = books.sort((a, b) => a.preco - b.preco)
    displayBooks(booksOrdered)
}

function checkBookAvailability(book) {
    if (book.quantidade > 0) {
        return 'livro__imagens'
    } else {
        return 'livros__imagens unavailable'
    }
}

function calculateTotalAmountBooksAvailable(books) {
    return books.reduce((acc, book) => acc + book.preco, 0).toFixed(2)
}