import { useEffect, useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const defaultCode = {
    python: "# Write your Python code here\nprint(\"Hello, Python!\")",
    cpp: "// Write your C++ code here\n#include <iostream>\nint main() {\n  std::cout << \"Hello, C++!\" << std::endl;\n  return 0;\n}",
    java: "// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Java!\");\n  }\n}",
  };

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const submitCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://3t3vy3oy01.execute-api.us-west-2.amazonaws.com/danish",
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ code, language }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOutput(data.body);
      } else {
        setOutput("Error: Unable to fetch output.");
      }
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      <div className="head">
        <header>
          <h1 style={{ color: 'blue' }}>Online Code Editor</h1>
        </header>
      </div>
      <br />
      <br />
      <div className="container">
        <div className="editor-container">
          <div>
            <button
              className="mode-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: isDarkMode ? '#444' : '#f0f0f0',
                color: isDarkMode ? '#f0f0f0' : '#000',
              }}
            >
              {isDarkMode ? "DaRk" : "LiGhT"}
            </button>
          </div>
          <div className="editor-buttons">
            {Object.keys(defaultCode).map((lang) => (
              <button
                key={lang}
                className={language === lang ? "selected" : ""}
                onClick={() => setLanguage(lang)}
              >
                {lang === "cpp" ? "C++" : lang.toUpperCase()}
              </button>
            ))}
          </div>
          <Editor
            value={code}
            onChange={(e) => setCode(e)}
            theme={isDarkMode ? "vs-dark" : "light"}
            height="70vh"
            language={language}
            options={{ fontSize: 16, smoothScrolling: true }}
          />
          <button className="submit-btn" onClick={submitCode}>
            {loading ? "Running..." : "RUN"}
          </button>
        </div>

        <div className="output-container">
          <h3>Output:</h3>
          {loading ? <div className="loader"></div> : <pre>{output}</pre>}
        </div>
      </div>
    </div>
  );
}

export default App;
