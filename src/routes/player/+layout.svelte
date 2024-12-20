<script>
  import "../../app.css";
</script>

<div>
  <slot />
</div>

<style>
  div {
    display: grid;
    place-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--secondary-color);
  }
</style>
