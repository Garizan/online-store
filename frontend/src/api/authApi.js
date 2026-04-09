export async function registerCustomer(payload) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка регистрации');
    }

    return res.json(); // { token: "..." }
}