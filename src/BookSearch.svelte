<script>
  import axios from 'axios';
  import {Button, Card, TextField} from 'smelte';

  let query = 'go';
  let result = [];
  let searching = false;

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
</script>

<div>
  <TextField label="Input search text" bind:value="{query}" outlined />
  <Button light disabled={searching} on:click="{onSearch}">Search</Button>
</div>

{#each result as book}
  <Card.Card>
    <div slot="title">
      <Card.Title title="{book.title}" subheader="{book.authors.join(', ')}" />
    </div>
    <div slot="text" class="p-5 pb-0 pt-3 text-gray-700 body-2">
      {book.contents}
    </div>
    <div slot="actions">
      <div class="p-2">
        <Button text>ADD</Button>
      </div>
    </div>
  </Card.Card>
{/each}
