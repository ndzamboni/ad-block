// background.js

const easyListUrl = 'https://easylist.to/easylist/easylist.txt';

async function fetchEasyList() {
  try {
    const response = await fetch(easyListUrl);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Failed to fetch EasyList:', error);
  }
}

function parseEasyList(easyListText) {
  const lines = easyListText.split('\n');
  const blockUrls = [];

  lines.forEach(line => {
    // Skip comments and empty lines
    if (line.startsWith('!') || line.trim() === '') {
      return;
    }

    // Handle simple domain blocking rules
    if (line.startsWith('||')) {
      const domain = line.slice(2).split('^')[0];
      blockUrls.push(`*://${domain}/*`);
    }
  });

  return blockUrls;
}

async function initializeBlocker() {
  const easyListText = await fetchEasyList();
  if (easyListText) {
    const blockUrls = parseEasyList(easyListText);

    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        return { cancel: true };
      },
      { urls: blockUrls },
      ["blocking"]
    );

    console.log('Ad blocker initialized with EasyList');
  }
}

initializeBlocker();
