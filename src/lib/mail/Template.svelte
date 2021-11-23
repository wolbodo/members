<script>
  export let subject = "Email from Wolbodo"
</script>

<svelte:head>{subject}</svelte:head>

<mjml>
  <mj-head>
     <mj-font name="Righteous"
       href="https://fonts.googleapis.com/css2?family=Righteous" />
     <mj-font name="Rubik"
       href="https://fonts.googleapis.com/css2?family=Rubik" />
    <mj-style>
      .gradient &lcub;
        background: linear-gradient(
          180deg,
          #b9c6d2 0%,
          #d0dde9 10.45%,
          #edf0f8 41.35%
        );

        font-family: Rubik, Arial;
      &rcub;
    </mj-style>
  </mj-head>
  <mj-body css-class="gradient">
    <mj-section full-width="">
      <mj-column width="20%">
        <mj-image align="right" src="https://members.wolbodo.nl/android-chrome-192x192.png"></mj-image>
      </mj-column>
      <mj-column width="80%" vertical-align="middle">
        <mj-text padding="30px" font-family="Righteous, Arial">
          <slot name='header' />
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section>
      <slot />
    </mj-section>
  </mj-body>
</mjml>