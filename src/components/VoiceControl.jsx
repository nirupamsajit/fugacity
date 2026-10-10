
import { useEffect, useRef, useState } from "react";

export default function VoiceControl({
  onReadAloud,
  onStopReading,
  onShowActions,
}) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState(
    'Press "Start voice control" and say "help".'
  );

  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, []);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Voice recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setMessage('Listening... Say "help" for available commands.');
    };

    recognition.onresult = (event) => {
      const result =
        event.results[event.results.length - 1][0].transcript
          .trim()
          .toLowerCase();

      setMessage(`Heard: "${result}"`);

      if (/\b(help|what can i say|available commands)\b/i.test(result)) {
        setMessage(
          'Commands: "read aloud", "stop reading", "show actions", and "stop listening".'
        );
      } else if (
        /\b(stop listening|turn off voice control|disable voice control)\b/i.test(
          result
        )
      ) {
        recognition.stop();
      } else if (
        /\b(stop reading|stop audio|stop speaking|silence)\b/i.test(result)
      ) {
        onStopReading?.();
        setMessage("Audio stopped.");
      } else if (
        /\b(show actions|show action items|what should i do)\b/i.test(result)
      ) {
        onShowActions?.();
        setMessage("Showing the possible action items.");
      } else if (
        /\b(read aloud|read the overview|listen to overview|read summary)\b/i.test(
          result
        )
      ) {
        onReadAloud?.();
        setMessage("Reading the overview aloud.");
      } else {
        setMessage(
          `I heard "${result}", but I don't recognise that command. Say "help".`
        );
      }
    };

    recognition.onerror = (event) => {
      setMessage(
        event.error === "not-allowed"
          ? "Microphone access was denied. Allow microphone access in your browser settings."
          : `Voice recognition error: ${event.error}`
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setMessage("Could not start voice control. Please try again.");
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
    setMessage("Voice control stopped.");
  }

  return (
    <section
      className="voice-control"
      aria-labelledby="voice-control-heading"
    >
      <h3 id="voice-control-heading">Voice control</h3>
      <p>
        Use your voice to listen to the overview or find important action
        items.
      </p>

      <div className="voice-control-buttons">
        <button
          type="button"
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? "Listening..." : "Start voice control"}
        </button>

        <button
          type="button"
          onClick={stopListening}
          disabled={!isListening}
        >
          Stop listening
        </button>
      </div>

      <p role="status" aria-live="polite">
        {message}
      </p>

      <p>
        Try saying: "Read aloud", "Stop reading", "Show actions", or "Help".
      </p>
    </section>
  );
}
