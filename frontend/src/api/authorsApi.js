const BASE_URL = '/api/authors';

export async function getAuthors() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Не удалось загрузить авторов');
    return res.json();
}

export async function searchAuthors(name) {
    const res = await fetch(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error('Не удалось выполнить поиск');
    return res.json();
}