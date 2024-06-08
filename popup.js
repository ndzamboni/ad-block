document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('whitelist').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
          const url = new URL(tabs[0].url);
          chrome.storage.sync.get('whitelist', function(data) {
            const whitelist = data.whitelist || [];
            if (!whitelist.includes(url.hostname)) {
              whitelist.push(url.hostname);
              chrome.storage.sync.set({ whitelist: whitelist }, function() {
                alert(url.hostname + ' added to whitelist.');
              });
            } else {
              alert(url.hostname + ' is already whitelisted.');
            }
          });
        } else {
          console.error('No active tab found.');
        }
      });
    });
  });
  