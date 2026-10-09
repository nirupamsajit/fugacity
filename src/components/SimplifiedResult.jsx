
import { useState } from "react";

function splitIntoSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function findImportantDates(text) {
  const datePattern =
    /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?)\b/gi;

  return [...new Set(text.match(datePattern) || [])];
}

export default function SimplifiedResult({ text = "" }) {
  const [showOriginal, setShowOriginal] = useState(false);

  if (!text.trim()) return null;

  const sentences = splitIntoSentences(text);

  const actionSentences = sentences.filter((sentence) =>
    /\b(must|need to|required|submit|complete|pay|bring|attend|contact|apply|register|deadline|due|before|by)\b/i.test(
      sentence
    )
  );

  const dates = findImportantDates(text);

  const summarySentences = sentences.slice(0, 3);

  function speakSummary() {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const content = [
      "Here is your document summary.",
      ...summarySentences,
      actionSentences.length
        ? `Important actions: ${actionSentences.join(". ")}`
        : "",
      dates.length ? `Dates mentioned: ${dates.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join(". ");

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
  }

  return (
    <section className="simplified-result" aria-live="polite">
      <span className="section-kicker">YOUR DOCUMENT, MADE CLEARER</span>
      <h2>Let's break it down.</h2>

      <div className="result-card">
        <h3>Quick overview</h3>
        {summarySentences.length ? (
          <ul>
            {summarySentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        ) : (
          <p>No readable sentences were detected.</p>
        )}
        <p className="result-disclaimer">
          This is an automatic preview, not an AI-verified summary. Check the
          original document before acting on important information.
        </p>
      </div>

      <div className="result-card">
        <h3>Possible actions to check</h3>
        {actionSentences.length ? (
          <ul>
            {actionSentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        ) : (
          <p>
            No obvious action statements were detected. Review the original
            document carefully.
          </p>
        )}
      </div>

      {dates.length > 0 && (
        <div className="result-card">
          <h3>Dates mentioned</h3>
          <ul>
            {dates.map((date) => (
              <li key={date}>{date}</li>
            ))}
          </ul>
          <p>Verify all dates against the original document.</p>
        </div>
      )}

      <div className="result-actions">
        <button type="button" onClick={speakSummary}>
          Listen to overview
        </button>
        <button type="button" onClick={stopSpeaking}>
          Stop audio
        </button>
        <button
          type="button"
          onClick={() => setShowOriginal((current) => !current)}
        >
          {showOriginal ? "Hide original text" : "View original text"}
        </button>
      </div>

      {showOriginal && (
        <div className="result-card">
          <h3>Original extracted text</h3>
          <pre>{text}</pre>
        </div>
      )}
    </section>
  );
}
