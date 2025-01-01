<script>
  import Boostagram from "./Boostagram.svelte";

  import { showBoost } from "$/stores";

  let hideModal = false;

  let textLength = 0;
  let saveText = "";
  let displayText = "";

  function resetInputs() {
    textLength = 0;
    saveText = "";
    displayText = "";
  }
</script>

<section
  class="boostagram"
  class:hide={hideModal}
  on:mousedown|self={() => {
    $showBoost = false;
    resetInputs();
  }}
  on:touchstart|self={() => {
    $showBoost = false;
    resetInputs();
  }}
>
  <div class="modal boostagram">
    <div class="scroll-bar-clipper boostagram">
      <Boostagram bind:textLength bind:saveText bind:displayText />
    </div>
  </div>
</section>

<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    background-color: hsla(0, 0%, 0%, 0.45);
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
    z-index: 200;
    backdrop-filter: blur(3px);
  }

  .modal {
    width: calc(100% - 16px);
    max-width: 360px;
    padding: 0;
    height: 80vh;
    border-radius: 5px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    color: var(--primary-text-color);
    border: var(--modal-border);
    box-shadow: var(--modal-box-shadow);
  }

  .scroll-bar-clipper {
    width: 100%;
    height: 100%;
    padding: 0;
    background-color: var(--secondary-color);
    background: linear-gradient(
      var(--shownotes-color-light),
      var(--shownotes-color-dark)
    );
    color: var(--secondary-text-color);
    border-radius: 5px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 8px;
  }

  .value-header {
    display: flex;
    justify-content: space-between;
  }

  .value-header > span {
    margin-right: 8px;
  }

  input {
    height: 42px;
    outline: none;
    background-color: var(--input-background-color);
    color: var(--primary-text-color);
  }

  textarea {
    background-color: var(--input-background-color);
    color: var(--primary-text-color);
  }

  textarea:focus,
  input:focus {
    border: 1px solid var(--primary-text-color);
    background-color: var(--input-background-color);
  }

  textarea:hover,
  input:hover {
    border: 1px solid var(--tertiary-text-color);
  }

  .sat-value {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 8px;
  }

  .sat-value > span {
    position: absolute;
    right: 8px;
    bottom: 18px;
  }

  .sat-value > input {
    padding-right: 40px;
    text-align: right;
    width: 100%;
  }

  h2 {
    margin: 0 0 8px 0;
    text-align: end;
  }

  .sender-input {
    margin-left: 8px;
    width: calc(100% - 8px);
  }

  textarea {
    margin: 0;
    padding: 8px;
    height: 100%;
    min-height: 100px;
    width: 100%;
    resize: none;
    flex-grow: 1;
    outline: none;
  }

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .red {
    color: red;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .recepient-input {
    padding-bottom: 8px;
  }

  .recepient-input > p {
    padding: 0;
    margin: 0;
  }

  .recepient-input > .select-theme {
    display: inline-block;
    width: calc(100% - 8px);
    flex-grow: 1;
    margin-left: 8px;
    --background: var(--input-background-color);
    --border: 1px solid var(--border-color);
    --borderFocusColor: var(--primary-text-color);
    --itemIsActiveBG: var(--secondary-color);
    --itemHoverBG: var(--tertiary-color);
    --listBackground: var(--primary-color);
  }

  .recepient-input > .select-theme > p {
    padding: 0 0 0 4px;
  }

  button {
    min-height: 40px;
    width: 100%;
    max-width: 86px;
    align-self: center;
    background-color: var(--primary-button-background-color);
    color: var(--primary-text-color);
    border-radius: 20px;
  }

  .bottom-bar > button {
    width: 40px;
    min-width: 40px;
    position: relative;
    margin-top: 8px;
    top: 0;
    left: 0;
  }

  .bottom-bar > button:disabled {
    background-color: var(--tertiary-color);
    cursor: not-allowed;
  }

  .bottom-bar > button > div {
    position: relative;
    left: 2px;
    transform: rotate(-30deg);
  }

  .hide {
    display: none;
  }
</style>
