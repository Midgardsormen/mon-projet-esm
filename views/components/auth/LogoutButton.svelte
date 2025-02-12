<script lang="ts">
    import { supabase } from "../../../libs/shared/src/client/supabase/supabase.js";
  
    const logout = async () => {
      // 1) Déconnexion côté Supabase (supprime le token du localStorage)
      await supabase.auth.signOut();
  
      // 2) Appel à Nest pour supprimer le cookie sur le serveur
      await fetch('/auth/clear-token', {
        method: 'POST'
      });
  
      // 3) Redirection vers la page de login (ou la page d'accueil)
      window.location.href = '/';
    };
  </script>
  
  <button on:click={logout}>
    Se déconnecter
  </button>
  