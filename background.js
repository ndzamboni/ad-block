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

function isValidUrlPattern(pattern) {
  try {
    new URL(pattern);
    return true;
  } catch (error) {
    return false;
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
      // Ensure the domain does not include '*' or other invalid characters
      if (domain.includes('*') || domain.includes('?') || domain.includes('&')) {
        console.warn(`Skipping invalid domain pattern: ${domain}`);
        return;
      }

      try {
        const urlFilter = `*://${domain}/*`;
        rules.push({
          id: idCounter++,
          priority: 1,
          action: { type: 'block' },
          condition: { urlFilter, resourceTypes: ['main_frame', 'sub_frame', 'script', 'image', 'stylesheet', 'object', 'xmlhttprequest', 'other'] }
        });

        // Limit the number of rules to avoid exceeding the Chrome extension limit
        if (rules.length >= 5000) {
          throw new Error('Rule limit exceeded');
        }
      } catch (error) {
        console.error(`Error creating rule for domain: ${domain}`, error);
      }
    }
  });

  return rules;
}

async function initializeBlocker() {
  const easyListText = await fetchEasyList();
  if (easyListText) {
    const rules = parseEasyList(easyListText);

    // Log the number of rules parsed
    console.log(`Parsed ${rules.length} rules from EasyList`);

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({ length: rules.length }, (_, i) => i + 1),
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
