declare global {
    interface Window {
      my_fragment?: any; 
      // éventuellement préciser un type précis si tu sais ce que c’est
      // par exemple : 
      // my_fragment?: { [key: string]: unknown; };
    }
  }
  
  export {};