export async function searchBooksByTitle(title) {
    const response = await fetch(`http://openlibrary.org/search.json?title=${title}`);
    const data = await response.json();
    return data.docs;
}