<script lang="ts">
  export let href: string;
</script>

<a {href} tabindex="0">
  <div tabindex="-1">
    <slot>Click here!</slot>
  </div>
</a>

<style>
  a {
    outline: none;
    background: transparent;
    border: none;
    text-decoration: none;
    user-select: none;
    font-family: 'Fredoka One', cursive;
  }

  a:focus > div {
    border-image: url(/SpaceInvader.svg) 13 fill / 13px / 1.5rem 2rem space;
    animation: wobble 500ms ease-out forwards normal;
  }

  div {
    padding: 0.5rem 1rem;
    background: var(--foreground-color);
    color: var(--background-color);
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    border: none;
  }

  div:focus {
    outline: none;
  }

  div:hover {
    background-color: transparent;
    background-image: repeating-linear-gradient(
      45deg,
      var(--foreground-color),
      var(--background-color)
    );
    background-size: 0.13rem 0.1rem;
    background-repeat: repeat;
    animation: verticalBgPan 8s linear infinite;
  }

  div:active {
    filter: blur(1px);
  }

  @keyframes verticalBgPan {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 100% 100%;
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
