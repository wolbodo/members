<script>
  import Template from './Template.svelte'

  export let person
</script>

<Template subject="Your password has changed">
  <h1 slot=header>Hi {person.name},</h1>
  
  <mj-column>
    <mj-text>
      Just letting you know, your Wolbodo password has changed.
    </mj-text>
  </mj-column>
</Template>
