<script>
  export let href;
  let growFactor = 1.0;
  let stop = false;
  let buttonElement;

  let focusInvaders = true;

  const grow = () => {
    if (!buttonElement || stop) return;
    buttonElement.style.transform = `scale(${growFactor})`;
    growFactor += 0.01;
    requestAnimationFrame(grow);
  };

  const startGrowing = () => {
    stop = false;
    requestAnimationFrame(grow);
  };

  const stopGrowing = () => {
    stop = true;
    growFactor = 1.0;
    buttonElement.style.transform = "none";
  };

  const clickChildLink = (e) => {
    const { firstElementChild } = e.currentTarget;
    firstElementChild.click();
  };
</script>

<button on:click={clickChildLink} bind:this={buttonElement}>
  <a {href} />
  <div tabindex="-1" on:pointerdown={startGrowing} on:pointerup={stopGrowing}>
    <slot>Click here!</slot>
  </div>
</button>

<style>
  a {
    display: none;
  }
  button {
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: var(--background-color);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    border: none;
    border-radius: 10rem;
    outline: none;
  }

  button:focus > div {
    border-image: url(/SpaceInvader.svg) 13 fill / 13px / 1.5rem 2rem space;
  }

  div:focus {
    outline: none;
  }

  button:hover {
    cursor: pointer;
    background-color: transparent;
    background-image: repeating-linear-gradient(
      to bottom,
      indigo,
      blue,
      turquoise,
      limegreen,
      yellow,
      orange,
      red,
      indigo,
      blue
    );
    background-size: 800% 800%;
    animation: rainbow 4s linear infinite;
  }

  @keyframes rainbow {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 0% 100%;
    }
  }
</style>
