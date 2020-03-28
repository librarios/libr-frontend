<script>
  import axios from 'axios';
  import {Button, Card, Image, Snackbar, TextField} from 'smelte';

  let query = 'go';
  let result = [];
  let searching = false;
  let showAddedSnackbar = false;

  async function onSearch() {
    const url = `${process.env.API_BASE_URL}/book/search?title=${query}`;
    try {
      searching = true;
      const rsp = await axios.get(url);
      result = rsp.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      searching = false;
    }
  }

  async function onAdd(book) {
    const url = `${process.env.API_BASE_URL}/books/own`;
    try {
      await axios.post(url, {
        isbn: book.isbn13,
        searched: book,
      });
      showAddedSnackbar = true;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="flex flex-row">
  <TextField
    class="flex-auto items-center mt-2"
    label="Input search text"
    bind:value="{query}"
    outlined />
  <div class="p-2">
    <Button light disabled="{searching}" on:click="{onSearch}">Search</Button>
  </div>
</div>

<Snackbar top bind:value={showAddedSnackbar} timeout={2000}>
  <div>Book added</div>
</Snackbar>

<div class="flex flex-row flex-wrap">
  {#each result as book}
    <Card.Card class="flex-auto m-2 w-64 card">
      <div slot="title">
        <Card.Title
          title="{book.title}"
          subheader="{book.authors.join(', ')}" />
      </div>
      <div slot="media">
        <Image class="w-auto" src="{book.thumbnail}" />
      </div>
      <div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">
        {book.contents}
      </div>
      <div slot="actions">
        <div class="p-2">
          <Button text on:click="{onAdd(book)}">ADD</Button>
        </div>
      </div>
    </Card.Card>
  {/each}
</div>
