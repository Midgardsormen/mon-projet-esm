<script>
    import Home from './components/Home/Home.svelte';
    export let dataForHydration;

    console.log('++++++++++++++++', dataForHydration)
  </script>
  
  <main>
    <h1>{dataForHydration.message}</h1>
    <div id="app">
      <Home dataForHydration={dataForHydration}/>
    </div>
  </main>
  