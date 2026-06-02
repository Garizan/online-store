const CART_KEY = "cart";

export function getCart() {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
        return [];
    }

    try {
        return JSON.parse(cart);
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addBookToCart(book) {
    const cart = getCart();

    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
        if (existingItem.cartQuantity >= book.quantity) {
            throw new Error(`Only ${book.quantity} copies of "${book.title}" are available`);
        }

        existingItem.cartQuantity += 1;
    } else {
        if (book.quantity <= 0) {
            throw new Error(`"${book.title}" is out of stock`);
        }

        cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: book.quantity,
            genre: book.genre,
            author: book.author,
            cartQuantity: 1
        });
    }

    saveCart(cart);
    return cart;
}

export function removeBookFromCart(bookId) {
    const cart = getCart().filter((item) => item.id !== bookId);
    saveCart(cart);
    return cart;
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
}