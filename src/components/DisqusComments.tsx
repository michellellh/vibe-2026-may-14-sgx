import React, { useEffect } from 'react';

const DisqusComments = () => {
  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    const scriptId = 'disqus-embed-script';
    
    // Check if the script already exists to avoid duplication
    if (document.getElementById(scriptId)) {
      // If it exists, we might need to reset it for the new page context if it were a real SPA with dynamic routes
      // but for this fixed terminal layout, just returning is safer.
      if ((window as any).DISQUS) {
        (window as any).DISQUS.reset({
          reload: true
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://capital-prime.disqus.com/embed.js';
    script.setAttribute('data-timestamp', (+new Date()).toString());
    script.async = true;

    // Append standard Disqus div if it doesn't exist
    if (!document.getElementById('disqus_thread')) {
        const threadDiv = document.createElement('div');
        threadDiv.id = 'disqus_thread';
        document.body.appendChild(threadDiv);
    }

    (document.head || document.body).appendChild(script);

    return () => {
      // Optional: Cleanup script on unmount if needed
      // const existingScript = document.getElementById(scriptId);
      // if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="px-4 py-8 mt-12 bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-4xl mx-auto">
        <h3 className="font-headline text-lg font-bold mb-6 text-on-surface">Community Discussions</h3>
        <div id="disqus_thread"></div>
        <noscript>
          Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
        </noscript>
      </div>
    </div>
  );
};

export default DisqusComments;
