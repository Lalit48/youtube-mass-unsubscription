document.getElementById("startUnsubscribing").addEventListener("click", async () => {
  const statusElement = document.getElementById("status");
  statusElement.textContent = "Status: Running...";

  // Inject the script to the YouTube subscriptions page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: unsubscribeAllChannels,
  });

  statusElement.textContent = "Status: Completed!";
});

// This function will be injected into the YouTube page
function unsubscribeAllChannels() {
  const unsubscribeButtons = Array.from(document.querySelectorAll('ytd-subscribe-button-renderer button[aria-label^="Unsubscribe"]'));
  let count = 0;

  if (unsubscribeButtons.length === 0) {
    alert("No unsubscribe buttons found. Make sure you're on the Subscriptions page.");
    return;
  }

  unsubscribeButtons.forEach((button, index) => {
    setTimeout(() => {
      button.click(); // Click the unsubscribe button
      setTimeout(() => {
        const confirmButton = document.querySelector('yt-confirm-dialog-renderer button[aria-label="Confirm"]');
        if (confirmButton) {
          confirmButton.click(); // Click the confirm button
        }
        count++;
        if (index === unsubscribeButtons.length - 1) {
          alert(`Unsubscribed from ${count} channels.`);
        }
      }, 500); // Short delay to wait for the confirmation dialog to appear
    }, index * 1500); // Adding delay to avoid bot detection
  });
}
