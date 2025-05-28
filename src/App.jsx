import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal } from 'xterm';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';
import './App.css';

const socket = io('https://python-backend-31f4.onrender.com');

export default function App() {
    const [code, setCode] = useState(`print("Hello from Python!")\nfor i in range(5):\n    print(i)`);
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const term = new Terminal({ fontSize: 14, theme: { background: '#1e1e2e' } });
        term.open(document.getElementById('terminal'));
        socket.on('output', data => term.writeln(data));

        const successMessages = [
            "Code executed successfully with output and GUI rendering!",
            "Awesome! Your code ran and GUI output is displayed correctly.",
            "Success! Text output and GUI elements loaded perfectly.",
            "Execution complete: Text and GUI output received without errors.",
            "Perfect! Both terminal output and GUI visuals are working fine.",
            "Your Python script ran smoothly with input and GUI output.",
            "Congrats! Your program handled input, text output, and GUI display.",
            "Execution done: GUI and text outputs are showing up as expected."
        ];

        socket.on('image', () => {
            const msg = successMessages[Math.floor(Math.random() * successMessages.length)];
            setMessage(msg);
        });

        return () => {
            socket.off('output');
            socket.off('image');
        };
    }, []);

    const handleRun = () => {
        setMessage('');
        socket.emit('run', { code, input });
    };

    return (
        <div className="wrapper">
            <header>
                <h1>Online Python Editor</h1>
                <button className="run-btn" onClick={handleRun}>Run ▶</button>
            </header>

            <main>
                <section className="editor-pane">
                    <Editor
                        language="python"
                        theme="vs-dark"
                        value={code}
                        onChange={setCode}
                        options={{ fontSize: 15, minimap: { enabled: false } }}
                    />
                </section>

                <section className="io-pane">
                    <div className="output-wrapper">
                        <div id="terminal" className="terminal-box" />
                    </div>
                    <textarea
                        placeholder="stdin → type here if your program uses input()"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    {message && <div className="success-message">{message}</div>}
                </section>
            </main>
        </div>
    );
}