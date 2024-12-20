<script>
 

  import { allCategories, filteredCategories } = getContext('search');

  let alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  alpha.push('ALL');
  export let filtersHidden;

  function handleFilter(letter) {
    if (letter === 'ALL') {
      $filteredCategories = $allCategories;
    } else {
      $filteredCategories = $allCategories.filter((cat) =>
        cat.name.toLowerCase().startsWith(letter.toLowerCase())
      );
    }
  }
</script>

<div on:click={() => (filtersHidden = true)}>
  <ul>
    {#each alpha as letter}
      <li on:click={handleFilter.bind(this, letter)}>{letter}</li>
    {/each}
  </ul>
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 4;
    background-color: transparent;
  }
  ul {
    position: absolute;
    top: 50px;
    right: 2px;
    background: #fff;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-flow: column;
    gap: 4px 4px;
    padding: 4px;
    border-radius: 3px;
    overflow: hidden;
    box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
    z-index: 4;
  }

  li {
    list-style: none;
    height: 50px;
    width: 50px;
    font-weight: 700;
    display: grid;
    place-content: center;
  }
</style>
