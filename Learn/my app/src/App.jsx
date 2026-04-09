import { useRef, useState } from "react";
import "./App.css";

const API_URL = "https://api.yamline.com/convert/yaml/json";

const sampleYaml = `title: YAMLine Demo
owner:
  name: Taylor
  contact:
    email: taylor@example.com
items:
  - sku: A1
    qty: 2
    price: 14.5
  - sku: B7
    qty: 1
    price: 42
active: true
`;

function App() {
  const [yaml, setYaml] = useState(sampleYaml);
  const [json, setJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(null);

  const handleConvert = async () => {
    if (!yaml.trim()) {
      setError("Please paste YAML to convert.");
      setJson("");
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: yaml,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed (${res.status}).`);
      }

      const text = await res.text();
      let pretty = text;

      try {
        const parsed = JSON.parse(text);
        pretty = JSON.stringify(parsed, null, 2);
      } catch {
        // Keep original if response isn't parseable JSON.
      }

      setJson(pretty);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Conversion failed.");
        setJson("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setYaml("");
    setJson("");
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const handleDownload = () => {
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yamline.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <span className="badge">YAML → JSON</span>
        <h1>YAMLine API Converter</h1>
        <p className="subtitle">
          Paste YAML, send it to the YAMLine endpoint, and get back clean JSON.
          Press Ctrl or ⌘ plus Enter to run instantly.
        </p>
        <div className="actions">
          <button className="primary" onClick={handleConvert} disabled={loading}>
            {loading ? "Converting..." : "Convert"}
          </button>
          <button className="ghost" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button
            className="ghost"
            onClick={() => setYaml(sampleYaml)}
            disabled={loading}
          >
            Load Example
          </button>
        </div>
      </header>

      <section className="grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>YAML Input</h2>
              <span className="hint">Raw YAML is posted to the API.</span>
            </div>
            <span className="status">{yaml.length} chars</span>
          </div>
          <textarea
            value={yaml}
            onChange={(event) => setYaml(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type: config\nversion: 1\nfeatures:\n  - name: fast\n    enabled: true"
          />
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>JSON Output</h2>
              <span className="hint">Pretty-printed for readability.</span>
            </div>
            <div className="panel-actions">
              <button className="ghost" onClick={handleCopy} disabled={!json}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button className="ghost" onClick={handleDownload} disabled={!json}>
                Download
              </button>
            </div>
          </div>

          <pre className={`output ${json ? "" : "empty"}`}>
            <code>{json || "Converted JSON will appear here."}</code>
          </pre>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <footer className="foot">
        <span>POST https://api.yamline.com/convert/yaml/json</span>
        <span>Response status: {loading ? "working" : "ready"}</span>
      </footer>
    </div>
  );
}

export default App;
