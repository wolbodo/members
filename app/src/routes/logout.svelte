<script context='module'>
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ session, fetch }) {
		if (session.user) {
      await fetch('/auth/logout', { method: 'post' })
		}

    return {
      status: 302, 
      redirect: '/login'
    }
	}
</script>