// api/openLibrary.js
export async function searchBooksByTitle(title) {
  const response = await fetch(`http://openlibrary.org/search.json?title=${title}`);
  const data = await response.json();
  return data.docs;
}

export async function fetchBookCoverUrl(title) {
  const books = await searchBooksByTitle(title);
  if (books.length > 0) {
    const coverEditionKey = books[0].cover_edition_key;
    if (coverEditionKey) {
      return `https://covers.openlibrary.org/b/olid/${coverEditionKey}-M.jpg`;
    }
  }
  return null;
}
