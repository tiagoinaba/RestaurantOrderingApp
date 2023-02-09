import { menuItems } from "./data.js"


const itemSection = document.getElementById('item-section')
const myModal = document.querySelector('.modal')
const ccnInput = document.getElementById('ccn')
const cvvInput = document.getElementById('cvv')
const paymentForm = document.getElementById('payment-form')
const basket = []
let sum = 0


document.addEventListener('click', function(e) {
    if(e.target.dataset.item) {
        addItem(e.target.dataset.item)
    }
    else if(e.target.dataset.closeModal) {
        closeModal()
    } else if(e.target.dataset.closePaymentModal) {
        closePaymentModal()
    }
    else if(e.target.dataset.basketRemove) {
        removeFromBasket(e.target.dataset.basketRemove)
    }
    else if(e.target.dataset.basketAdd) {
        addItem(e.target.dataset.basketAdd)
    }
    else if(e.target.dataset.complete) {
        openPaymentModal()
    }
    else if(e.target.id === "shopping-cart") {
        displayModal()
    } 
    else if(e.target.id === "clear-basket-btn") {
        clearBasket()
    } 
    else if(!document.getElementById('payment-modal-outer').contains(e.target)) {
        closePaymentModal()
    }
    
    
    if(!document.getElementById('popup').contains(e.target)) {
        closePopup()
    }

    
    
})

paymentForm.addEventListener('submit', function(e) {
    e.preventDefault()

    const paymentFormData = new FormData(paymentForm)
    let name = paymentFormData.get('name-input')
    paymentComplete(name)
})

ccnInput.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
    || (e.keyCode > 47 && e.keyCode < 58)
    || e.keyCode == 8)) {
        return false;
    }
}

cvvInput.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
    || (e.keyCode > 47 && e.keyCode < 58)
    || e.keyCode == 8)) {
        return false;
    }
}

function renderItems() {
    let html = ''
    menuItems.forEach(function(item) {
        html += `
        <div class="item">
            <img class="item-graphic" src="${item.image}" alt="${item.imageAlt}">
            <div>
                <h2>${item.itemName}</h2>
                <p>${item.ingredients}</p>
                <h3>$${item.price}</h3>
            </div>
            <button class="add-btn" data-item='${item.itemName}'>+</button>
        </div>`

        basket.push({
            item: item.itemName,
            ammount: 0,
            price: item.price
        })
    })
    itemSection.innerHTML += html
}

renderItems()

function addItem(item) {
    menuItems.forEach(function(menuItem) {
        if(item === menuItem.itemName) {
            basket.forEach(function(basketItem) {
                if(basketItem.item === item) {
                    basketItem.ammount++
                }
            })
        }
    })

    displayModal()

    renderBasket()
}

function removeFromBasket(item) {
    menuItems.forEach(function(menuItem) {
        if(item === menuItem.itemName) {
            basket.forEach(function(basketItem) {
                if(basketItem.item === item) {
                    basketItem.ammount--
                }
            })
        }
    })


    const test = basket.filter(function(basketItem) {
        return basketItem.ammount === 0
    })

    if(test.length === basket.length) {
        closeModal()
    }

    renderBasket()
}

function renderBasket() {
    const totalPriceEl = document.querySelector('.total-price')
    const itemsDiv = document.querySelector('.items')
    let html = ''
    sum = 0

    basket.forEach(function(basketItem) {
        if(basketItem.ammount != 0) {
            html += `
            <div class="modal-item">
                <h2>${basketItem.item}</h2>
                <div class="modal-btns">
                    <i class="fa-solid fa-circle-minus basket-btn"
                    data-basket-remove="${basketItem.item}"></i>
                    <h2>${basketItem.ammount}</h2>
                    <i class="fa-solid fa-circle-plus basket-btn"
                    data-basket-add="${basketItem.item}"></i>
                </div>
                <h2>$${basketItem.price * basketItem.ammount}</h2>
            </div>`
            sum += basketItem.price * basketItem.ammount
        }
    })

    itemsDiv.innerHTML = html

    html = `
                    <h2>Total price:</h2>
                    <h2>$${sum}</h2>
                `
    const newDiv = document.createElement('div')
    newDiv.classList.add('total-price')
    newDiv.innerHTML = html
    
    totalPriceEl.replaceWith(newDiv)
}

function clearBasket() {
    basket.forEach(function(item) {
        item.ammount = 0
    })
    sum = 0
    renderBasket()
}

function paymentComplete(name) {
    clearBasket()
    closePaymentModal()
    closeModal()
    displayCompletePopup(name)
}

function closePopup() {
    const popup = document.getElementById('popup')
    popup.style.display = 'none'
    const overlay = document.querySelectorAll('.overlay')
    for(let element of overlay) {
        element.parentNode.removeChild(element)
    }
}

function displayCompletePopup(name) {
    const popup = document.getElementById('popup')
    popup.style.display = 'block'
    popup.innerHTML = `<h2>Thanks, ${name}! Your order is on its way!</h2>`
    document.getElementById('shopping-cart')
    .insertAdjacentHTML('afterend', `<div class="overlay"></div>`)
}

function openPaymentModal() {
    const paymentModal = document.querySelector('#payment-modal-outer')
    const payBtn = document.querySelector('#pay-btn')
    itemSection.insertAdjacentHTML('afterbegin', `<div class="overlay"></div>`)
    myModal.insertAdjacentHTML('beforeend', `<div class="overlay"></div>`)
    payBtn.innerText = `Pay $${sum}`
    paymentModal.classList.remove('payment-modal-outer')
}

function closePaymentModal() {
    const paymentModal = document.querySelector('#payment-modal-outer')
    const overlay = document.querySelectorAll('.overlay')
    for(let element of overlay) {
        element.parentNode.removeChild(element)
    }
    paymentModal.classList.add('payment-modal-outer')
}

function displayModal() {
    myModal.classList.add('display-modal')
    document.getElementById('shopping-cart').style.display = 'none'
    setBlankHeight()
}

function closeModal() {
    myModal.classList.remove('display-modal')
    document.getElementById('shopping-cart').style.display = 'block'
    setBlankHeight()
}

function setBlankHeight() {
    const myBlank = document.querySelector('.blank')

    myBlank.style.height = `${myModal.clientHeight}px`
}


