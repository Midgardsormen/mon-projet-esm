<script lang="ts">
    import { supabase } from "../../../libs/shared/src/client/supabase/supabase.js";


  
    let email = '';
    let password = '';
    let errorMessage = '';
  
    const signIn = async () => {
      // Appel à Supabase pour se connecter avec email + mot de passe
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
  
      if (error) {
        // Si la connexion a échoué
        errorMessage = error.message;
      } else {
        const token = data.session?.access_token;

        await fetch('/auth/set-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })
        
        // data.session => contient les infos de session
        // data.user => contient l'utilisateur
        // La session est aussi stockée en localStorage
  
        // Redirection vers la page d'accueil par exemple :
        window.location.href = '/';
      }
    };
  </script>
  
  <form on:submit|preventDefault={signIn}>
    <label for="email">Email</label>
    <input id="email" type="email" bind:value={email} required />
  
    <label for="password">Mot de passe</label>
    <input id="password" type="password" bind:value={password} required />
  
    {#if errorMessage}
      <p style="color: red">{errorMessage}</p>
    {/if}
  
    <button type="submit">Se connecter</button>
  </form>
  