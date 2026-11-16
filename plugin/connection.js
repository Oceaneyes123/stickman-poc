export async function ensureCaptureScript(tabId) {
  const ping = () =>
    chrome.tabs.sendMessage(
      tabId,
      { type: "frame-study-ping" },
      { frameId: 0 },
    );
  try {
    if ((await ping())?.ready === true) return;
  } catch (error) {
    if (
      !/Receiving end does not exist|Could not establish connection/i.test(
        error.message,
      )
    )
      throw error;
  }
  if (typeof chrome.scripting?.executeScript !== "function") {
    const declared = chrome.runtime
      ?.getManifest?.()
      .permissions?.includes("scripting");
    const error = new Error(
      `${declared ? "Chrome has not exposed the scripting API in this panel." : "Chrome is using an extension manifest without the scripting permission."} Click Reload extension below (or the Reload button on Frame Study's card at chrome://extensions), then reopen Frame Study and click Connect video. Refreshing YouTube alone does not reload extension permissions.`,
    );
    error.code = "SCRIPTING_UNAVAILABLE";
    throw error;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId, frameIds: [0] },
      files: ["core.js", "content.js"],
    });
    if ((await ping())?.ready !== true)
      throw new Error("The capture script did not respond.");
  } catch (error) {
    throw new Error(
      `Cannot connect to YouTube: ${error.message} Reload the YouTube page, allow Frame Study access to YouTube in Chrome, then click Connect video.`,
    );
  }
}
