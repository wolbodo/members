<script lang="ts">
  export let onClick: Function;
</script>

<button on:click={(e) => onClick(e)}>
  <div tabindex="-1">
    <slot>Click here!</slot>
  </div>
</button>

<style>
  button {
    outline: none;
    background: transparent;
    appearance: none;
    border: none;
    text-decoration: none;
    padding: 0;
  }

  button:focus > div {
    border-image: url(/SpaceInvader.svg) 13 fill / 13px / 1.5rem 2rem space;
    animation: wobble 500ms ease-out forwards normal;
  }

  div {
    padding: 0.5rem 1rem;
    background: var(--primary);
    color: var(--background);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    border: none;
    border-radius: 10rem;
  }

  div:focus {
    outline: none;
  }

  div:hover {
    background-color: transparent;
    background-image: repeating-linear-gradient(
      45deg,
      var(--primary),
      var(--background)
    );
    background-size: 0.13rem 0.1rem;
    background-repeat: repeat;
    animation: verticalBgPan 8s linear infinite;
  }

  @keyframes verticalBgPan {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 0% 100%;
    }
  }

  @keyframes wobble {
    0% {
      transform: scale(1.15);
    }
    25% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.075);
    }
    75% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  }
</style>
