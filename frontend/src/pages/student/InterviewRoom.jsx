import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import toast from "react-hot-toast";
import { COLORS, fontHead, fontBody } from "../../theme";
import { getInterviewById, getEphemeralToken, saveTranscript } from "../../api/interviews";
import { useAuth } from "../../context/AuthContext";
import { AudioPlaybackQueue } from "../../utils/audioPlayback";
import { AudioCapture } from "../../utils/audioCapture";

const CONCLUSION_MARKER = "this concludes our interview session";

export default function InterviewRoom() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading | ready | connecting | live | ending | problem
  const [problemText, setProblemText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [messages, setMessages] = useState([]); // [{ role: "model" | "user", text, live }]
  const [questionNumber, setQuestionNumber] = useState(0);
  const [hasAnswers, setHasAnswers] = useState(false);

  const sessionRef = useRef(null);
  const playbackRef = useRef(null);
  const captureRef = useRef(null);
  const turnsRef = useRef([]); // chronological turns, saved to the backend at the end
  const modelTextRef = useRef("");
  const userTextRef = useRef("");
  const questionCountRef = useRef(0);
  const endingRef = useRef(false);
  const speakingTimerRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await getInterviewById(id, token);
        if (data.status === "Completed") {
          navigate(`/student/interview-report/${id}`, { replace: true });
          return;
        }
        setInterview(data);
        setPhase("ready");
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchInterview();
  }, [id, token, navigate]);

  // Always release the microphone and connection if the student leaves this page
  useEffect(() => {
    return () => {
      clearTimeout(speakingTimerRef.current);
      captureRef.current?.stop();
      sessionRef.current?.close();
      playbackRef.current?.close();
    };
  }, []);

  // Keep the newest message in view as text streams in
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const saveAndNavigate = useCallback(async () => {
    setPhase("ending");

    // Let the AI finish speaking its closing line before we leave the page
    const remaining = playbackRef.current ? playbackRef.current.getRemainingMs() : 0;
    const audioDrained = new Promise((resolve) => setTimeout(resolve, remaining > 0 ? remaining + 300 : 0));

    try {
      const [saved] = await Promise.all([saveTranscript(id, turnsRef.current, token), audioDrained]);

      if (saved.status === "Abandoned") {
        toast("Interview ended before any answers were recorded.");
        navigate("/student/interview-coach");
        return;
      }

      toast.success("Interview completed!");
      navigate(`/student/interview-report/${id}`);
    } catch (err) {
      toast.error(err.message);
      setProblemText("We couldn't save your interview.");
      setPhase("problem");
    }
  }, [id, token, navigate]);

  const finishInterview = useCallback(() => {
    if (endingRef.current) return;
    endingRef.current = true;
    clearTimeout(speakingTimerRef.current);
    setAiSpeaking(false);
    captureRef.current?.stop();
    captureRef.current = null;
    sessionRef.current?.close();
    saveAndNavigate();
  }, [saveAndNavigate]);

  // Adds streamed text to the live bubble for that speaker (or starts a new bubble)
  const appendLive = (role, text) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.live && last.role === role) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
      }
      const settled = prev.map((m, i) => (i === prev.length - 1 ? { ...m, live: false } : m));
      return [...settled, { role, text, live: true }];
    });
  };

  const handleMessage = (message) => {
    const content = message?.serverContent;
    if (!content) return;

    const audioPart = content.modelTurn?.parts?.find((p) => p.inlineData);
    if (audioPart && playbackRef.current) {
      clearTimeout(speakingTimerRef.current);
      playbackRef.current.playChunk(audioPart.inlineData.data);
      setAiSpeaking(true);
    }

    if (content.inputTranscription?.text) {
      userTextRef.current += content.inputTranscription.text;
      appendLive("user", content.inputTranscription.text);
    }
    if (content.outputTranscription?.text) {
      modelTextRef.current += content.outputTranscription.text;
      appendLive("model", content.outputTranscription.text);
    }

    if (content.turnComplete) {
      const userText = userTextRef.current.trim();
      const modelText = modelTextRef.current.trim();
      userTextRef.current = "";
      modelTextRef.current = "";

      setMessages((prev) => prev.map((m) => (m.live ? { ...m, live: false } : m)));

      // The student's answer always comes BEFORE the AI's reply in the same turn
      if (userText) {
        turnsRef.current.push({ role: "user", text: userText });
        setHasAnswers(true);
      }
      if (modelText) {
        turnsRef.current.push({ role: "model", text: modelText });
      }

      if (modelText.toLowerCase().includes(CONCLUSION_MARKER)) {
        finishInterview();
        return;
      }

      if (modelText) {
        questionCountRef.current += 1;
        setQuestionNumber(questionCountRef.current);
      }

      // Show "Your turn" only once the AI's audio has actually finished playing
      const remaining = playbackRef.current ? playbackRef.current.getRemainingMs() : 0;
      clearTimeout(speakingTimerRef.current);
      speakingTimerRef.current = setTimeout(() => setAiSpeaking(false), remaining + 200);
    }
  };

  const handleStart = async () => {
    setPhase("connecting");
    setMessages([]);
    setQuestionNumber(0);
    setHasAnswers(false);
    turnsRef.current = [];
    modelTextRef.current = "";
    userTextRef.current = "";
    questionCountRef.current = 0;
    endingRef.current = false;
    playbackRef.current = new AudioPlaybackQueue();

    try {
      const { token: ephemeralToken, model } = await getEphemeralToken(id, token);
      const ai = new GoogleGenAI({ apiKey: ephemeralToken, httpOptions: { apiVersion: "v1alpha" } });

      const session = await ai.live.connect({
        model,
        callbacks: {
          onopen: () => {},
          onmessage: handleMessage,
          onerror: (err) => {
            toast.error(`Connection error: ${err?.message || "unknown"}`);
          },
          onclose: () => {
            if (endingRef.current) return;
            endingRef.current = true;
            captureRef.current?.stop();
            captureRef.current = null;
            clearTimeout(speakingTimerRef.current);
            setAiSpeaking(false);
            setProblemText("The connection to the interviewer was interrupted.");
            setPhase("problem");
          },
        },
      });
      sessionRef.current = session;

      // Start the microphone only after the session object exists
      captureRef.current = new AudioCapture((base64Chunk) => {
        if (endingRef.current) return;
        sessionRef.current?.sendRealtimeInput({
          audio: { data: base64Chunk, mimeType: "audio/pcm;rate=16000" },
        });
      });

      try {
        await captureRef.current.start();
      } catch {
        endingRef.current = true;
        toast.error("Microphone access is required. Please allow it in your browser and try again.");
        session.close();
        playbackRef.current?.close();
        playbackRef.current = null;
        setPhase("ready");
        return;
      }

      setPhase("live");
      setAiSpeaking(true);
      session.sendRealtimeInput({ text: "Begin the interview now." });
    } catch (err) {
      endingRef.current = true;
      toast.error(err.message);
      playbackRef.current?.close();
      playbackRef.current = null;
      setPhase("ready");
    }
  };

  const handleEndEarly = () => {
    if (window.confirm("End the interview now? Your answers so far will still be saved.")) {
      finishInterview();
    }
  };

  if (phase === "loading" || !interview) {
    return <p style={{ ...fontBody, color: COLORS.textMuted }}>Loading...</p>;
  }

  const total = interview.questionCount;
  const shownQuestion = Math.min(Math.max(questionNumber, 1), total);
  const progressPct = (Math.min(questionNumber, total) / total) * 100;
  const inSession = phase === "live" || phase === "ending" || phase === "problem";

  return (
    <div className="max-w-170 mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[22px] font-bold" style={{ ...fontHead, color: COLORS.textDark }}>
            {interview.role}
          </h1>
          <p className="text-[13.5px]" style={{ ...fontBody, color: COLORS.textMuted }}>
            {interview.level} · {interview.type}
          </p>
        </div>
        {inSession && (
          <span className="text-[13px] font-semibold whitespace-nowrap" style={{ ...fontBody, color: COLORS.primary }}>
            Question {shownQuestion} of {total}
          </span>
        )}
      </div>

      {inSession && (
        <div className="w-full h-1.5 rounded-full bg-[#EEF1F8] overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: COLORS.primary }}
          />
        </div>
      )}

      {phase === "ready" && (
        <div className="border border-[#ECEEF3] rounded-2xl p-8 bg-white text-center">
          <h2 className="text-[18px] font-semibold mb-2" style={{ ...fontHead, color: COLORS.textDark }}>
            Ready when you are
          </h2>
          <p className="text-[14px] mb-5" style={{ ...fontBody, color: COLORS.textMuted }}>
            You'll have a voice conversation with an AI interviewer. {total} question{total === 1 ? "" : "s"}, and you'll
            see everything written out as you go.
          </p>
          <ul className="text-[13.5px] text-left max-w-95 mx-auto mb-6 list-disc pl-5" style={{ ...fontBody, color: COLORS.textDark }}>
            <li className="mb-1">Allow microphone access when your browser asks</li>
            <li className="mb-1">Use headphones to avoid echo</li>
            <li>Wait for the AI to finish each question before you answer</li>
          </ul>
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-xl font-semibold text-[15px] text-white"
            style={{ ...fontBody, background: COLORS.accent }}
          >
            Start Interview
          </button>
        </div>
      )}

      {phase === "connecting" && (
        <p className="text-[15px] text-center py-16" style={{ ...fontBody, color: COLORS.textMuted }}>
          Connecting to your interviewer...
        </p>
      )}

      {inSession && (
        <>
          <div
            ref={chatBoxRef}
            className="border border-[#ECEEF3] rounded-2xl bg-white p-5 h-[50vh] overflow-y-auto flex flex-col gap-4 mb-4"
          >
            {messages.length === 0 && (
              <p className="text-[13.5px] text-center my-auto" style={{ ...fontBody, color: COLORS.textMuted }}>
                Waiting for the interviewer...
              </p>
            )}
            {messages.map((m, i) => {
              const isAi = m.role === "model";
              return (
                <div key={i} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl"
                    style={{
                      background: isAi ? "#EEF1FC" : "#F8ECF1",
                      borderTopLeftRadius: isAi ? 4 : undefined,
                      borderTopRightRadius: isAi ? undefined : 4,
                    }}
                  >
                    <p
                      className="text-[11.5px] font-semibold mb-1"
                      style={{ ...fontBody, color: isAi ? COLORS.primary : COLORS.accent }}
                    >
                      {isAi ? "AI Interviewer" : "You"}
                    </p>
                    <p className="text-[14.5px] leading-relaxed" style={{ ...fontBody, color: COLORS.textDark }}>
                      {m.text.trimStart()}
                      {m.live && (
                        <span
                          className="inline-block w-1.5 h-4 ml-1 align-middle rounded-sm animate-pulse"
                          style={{ background: isAi ? COLORS.primary : COLORS.accent }}
                        />
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "live" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: aiSpeaking ? COLORS.primary : COLORS.accent }}
                />
                <span
                  className="text-[13.5px] font-semibold"
                  style={{ ...fontBody, color: aiSpeaking ? COLORS.primary : COLORS.accent }}
                >
                  {aiSpeaking ? "AI is speaking..." : "Your turn - Now speak your answer"}
                </span>
              </div>
              <button
                onClick={handleEndEarly}
                className="text-[13.5px] font-semibold"
                style={{ ...fontBody, color: "#B91C1C" }}
              >
                End Interview
              </button>
            </div>
          )}

          {phase === "ending" && (
            <p className="text-[14px] text-center" style={{ ...fontBody, color: COLORS.textMuted }}>
              Saving your interview and generating your report. This can take a few seconds...
            </p>
          )}

          {phase === "problem" && (
            <div className="border border-[#F3D2D2] bg-[#FBEAEA] rounded-2xl p-5 text-center">
              <p className="text-[14px] font-semibold mb-3" style={{ ...fontBody, color: "#B91C1C" }}>
                {problemText}
              </p>
              <div className="flex justify-center gap-3">
                {hasAnswers && (
                  <button
                    onClick={saveAndNavigate}
                    className="px-5 py-2.5 rounded-lg font-semibold text-[13.5px] text-white"
                    style={{ ...fontBody, background: COLORS.accent }}
                  >
                    Save what we have
                  </button>
                )}
                <button
                  onClick={() => setPhase("ready")}
                  className="px-5 py-2.5 rounded-lg font-semibold text-[13.5px]"
                  style={{ ...fontBody, color: COLORS.textMuted, background: "#fff" }}
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}