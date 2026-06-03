const images = import.meta.glob("../images/books/*", {
    eager: true,
    import: "default"
});

export function getBookImage(imageUrl) {
    if (!imageUrl) {
        return null;
    }

    const fileName = imageUrl.split("/").pop();

    const imageKey = Object.keys(images).find((path) =>
        path.endsWith(`/${fileName}`)
    );

    return imageKey ? images[imageKey] : null;
}