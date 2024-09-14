const scripts = [
    { name: 'demo_count_machine', description: 'Demonstrates a simple counter machine.' },
    { name: 'demo_fetch_machine', description: 'Shows how to handle asynchronous operations.' },
    { name: 'demo_guards', description: 'Illustrates the use of guards in state transitions.' },
    { name: 'demo_input_machine', description: 'Exemplifies handling user input in a state machine.' },
    { name: 'demo_learn_dsalgo_machine', description: 'A more complex example related to learning data structures and algorithms.' },
    { name: 'demo_todo_machine', description: 'Demonstrates a todo list implementation using XState.' }
];

function renderScriptList() {
    const scriptList = document.getElementById('script-list');
    scripts.forEach((script, index) => {
        const scriptContainer = document.createElement('div');
        scriptContainer.className = 'script-container';
        scriptContainer.innerHTML = `
        <h3>${script.name}</h3>
        <p>${script.description}</p>
        <button onclick="runScript('${script.name}', ${index})">Execute Script</button>
        <button onclick="toggleCode('${script.name}', ${index})">Show/Hide Code</button>
        <div id="codeDisplay${index}" class="code-display"></div>
        <div id="console${index}" class="console">
          <div class="console-input">> Ready to execute script...</div>
        </div>
      `;
        scriptList.appendChild(scriptContainer);
    });
}

async function runScript(scriptName, index) {
    const consoleDiv = document.getElementById(`console${index}`);
    consoleDiv.innerHTML += `<div class="console-input">> Executing ${scriptName}...</div>`;

    try {
        const response = await fetch(`/run/${scriptName}`);
        const result = await response.text();
        consoleDiv.innerHTML += `<pre class="console-output">${result}</pre>`;
    } catch (error) {
        consoleDiv.innerHTML += `<div class="console-output">Error running script: ${error.message}</div>`;
    }

    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

async function toggleCode(scriptName, index) {
    const codeDisplay = document.getElementById(`codeDisplay${index}`);
    if (codeDisplay.style.display === 'none' || codeDisplay.style.display === '') {
        codeDisplay.style.display = 'block';
        if (!codeDisplay.querySelector('.monaco-editor')) {
            await loadMonaco();
            const editor = monaco.editor.create(codeDisplay, {
                language: 'javascript',
                theme: 'vs-dark',
                readOnly: true,
                minimap: { enabled: false }
            });
            try {
                const response = await fetch(`/code/${scriptName}`);
                const code = await response.text();
                editor.setValue(code);
            } catch (error) {
                editor.setValue(`Error loading code: ${error.message}`);
            }
        }
    } else {
        codeDisplay.style.display = 'none';
    }
}

async function loadMonaco() {
    return new Promise((resolve) => {
        if (window.monaco) {
            resolve();
        } else {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' } });
            require(['vs/editor/editor.main'], resolve);
        }
    });
}

renderScriptList();