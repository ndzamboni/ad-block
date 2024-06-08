// background.js

const easyListUrl = 'https://easylist.to/easylist/easylist.txt';

async function fetchEasyList() {
  try {
    const response = await fetch(easyListUrl);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Failed to fetch EasyList:', error);
    return null;
  }
}

function parseEasyList(easyListText) {
  const lines = easyListText.split('\n');
  const rules = [];
  let idCounter = 1;

  lines.forEach(line => {
    // Skip comments and empty lines
    if (line.startsWith('!') || line.trim() === '') {
      return;
    }

    // Handle simple domain blocking rules
    if (line.startsWith('||')) {
      const domain = line.slice(2).split('^')[0];
      rules.push({
        "id": idCounter++,
        "priority": 1,
        "action": { "type": "block" },
        "condition": { "urlFilter": `*://${domain}/*`, "resourceTypes": ["main_frame", "sub_frame", "script", "image", "stylesheet", "object", "xmlhttprequest", "other"] }
      });
    }
  });

  return rules;
}

async function initializeBlocker() {
  const easyListText = await fetchEasyList();
  if (easyListText) {
    const rules = parseEasyList(easyListText);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule, index) => index + 1),
      addRules: rules
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error updating rules:', chrome.runtime.lastError);
      } else {
        console.log('Ad blocker initialized with EasyList rules');
      }
    });
  }
}

initializeBlocker();
