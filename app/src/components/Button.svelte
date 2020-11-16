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
    class="focus-ants">
    <slot>Click here!</slot>
  </button>
  </a>

<style>
  button {
    position: relative;
    padding: 0.25rem 0.5rem;
    background: var(--main-color);
    color: var(--color-white);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    border: solid 0.25rem var(--main-color);
    border-radius: 10rem;
    outline: none;
  }

  button.focus-dashed:focus {
    outline: dashed 0.25rem var(--main-color);
    outline-offset: 0.125rem;
  }

  button.focus-inset-shadow:focus {
    box-shadow: inset 0 0 0.125rem 0.25rem var(--color-white);
  }

  button.focus-ants:focus::before {
    content: '';
    position: absolute;
    top: -0.75rem;
    right: -1rem;
    bottom: -0.75rem;
    left: -1rem;
    background-color: var(--main-color);
    -webkit-mask-image: url('ant-border-rectangle.svg#svgView(preserveAspectRatio(none))');
    -webkit-mask-size: 100% 100%;
    mask-image: url('ant-border-rectangle.svg#svgView(preserveAspectRatio(none))');
    mask-size: 100% 100%;
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
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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