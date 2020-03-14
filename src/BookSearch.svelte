<script>
  import axios from 'axios';

  let query = 'go';
  let result = [];

  async function onSearch() {
    const url = `${process.env.API_BASE_URL}/book/search?title=${query}`;
    try {
      const rsp = await axios.get(url);
      result = rsp.data.data;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<input bind:value="{query}" />
<button on:click="{onSearch}">Search</button>
<div></div>
{#each result as book}
  <ul>
    <li>Title: <a href={book.url} target="_blank">{book.title}</a></li>
    <li>ISBN: {book.isbn13}</li>
    <li>Authors: {book.authors.join(', ')}</li>
    <li>Price: {book.currency} {book.price}</li>
    <li>Publisher: {book.publisher}</li>
    <li>Contents: {book.contents}</li>
  </ul>
{/each}
