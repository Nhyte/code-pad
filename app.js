const byId = id => document.getElementById(id);
const code = byId("code"), copy = byId("copy"), select = byId("select"), status = byId("status");
function selectCode() { code.focus(); code.select(); code.setSelectionRange(0, code.value.length); }
async function loadSnippet() {
  copy.disabled = select.disabled = true;
  status.textContent = "Loading…";
  try {
    const response = await fetch("snippet.json?t=" + Date.now(), {cache:"no-store"});
    if (!response.ok) throw new Error("load");
    const data = await response.json();
    if (![data.code].every(v => typeof v === "string")) throw new Error("format");
    code.value = data.code;
    byId("count").textContent = data.code.length.toLocaleString() + " characters";
    copy.disabled = select.disabled = false;
    status.textContent = "";
  } catch {
    status.textContent = "Could not load the latest snippet. Check your connection and refresh.";
  }
}
copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(code.value);
    status.textContent = "Copied. Paste into your editor.";
  } catch {
    selectCode();
    status.textContent = "Automatic copying is unavailable. Code selected — press Ctrl+C to copy.";
  }
});
select.addEventListener("click", () => { selectCode(); status.textContent = "Code selected. Press Ctrl+C to copy."; });
byId("reload").addEventListener("click", loadSnippet);
loadSnippet();
