<script>
  export let href;
  let growFactor = 1.0;
  let stop = false;
  let buttonElement;

  const grow = (time) => {
    if (!buttonElement) return;
    if (stop) {
      stop = false;
      growFactor = 1.0;
      buttonElement.style.transform = 'none';
      return;
    }
    buttonElement.style.transform = `scale(${growFactor})`;
    growFactor += 0.01;
    requestAnimationFrame(grow);
  };

  const stopGrowing = () => {
    stop = true;
  };
</script>

<a href={href} >
  <button
    on:click
    on:pointerdown={grow}
    on:pointerup={stopGrowing}
    bind:this={buttonElement}
    class="focus-dashed">
    <slot>Click here!</slot>
  </button>
  </a>

<style>
  button {
    position: relative;
    padding: 0.5rem 1rem;
    background: var(--main-color);
    color: var(--color-white);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    border: none;
    border-radius: 10rem;
    outline: none;
  }

  button.focus-dashed:focus {
    outline: dashed 0.25rem var(--main-color);
    outline-offset: 0.125rem;
  }

  button:hover {
    background-color: transparent;
    background-image: repeating-linear-gradient(
      to right,
      var(--main-color),
      violet,
      indigo,
      blue,
      green,
      yellow,
      orange,
      red
    );
    /* -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
    background-size: 800% 800%;
    animation: rainbow 2s linear infinite;
  }

  @keyframes rainbow {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 100% 0%;
    }
  }
</style>