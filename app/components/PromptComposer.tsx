"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

type ToneOption = "confident" | "friendly" | "inspirational" | "urgent";

type CameraMotion = "steady" | "slow push-in" | "dynamic" | "handheld";

type LightingStyle = "soft daylight" | "studio key light" | "cinematic moody" | "vivid neon";

const defaultNarrative = `Hey there! I'm excited to walk you through our latest product update. Here's what you need to know...`;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function PromptComposer() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarCredits, setAvatarCredits] = useState("");
  const [avatarName, setAvatarName] = useState("Avery");
  const [roleDescription, setRoleDescription] = useState(
    "Product specialist with a welcoming, tech-savvy presence"
  );
  const [tone, setTone] = useState<ToneOption>("friendly");
  const [cameraMotion, setCameraMotion] = useState<CameraMotion>("steady");
  const [lighting, setLighting] = useState<LightingStyle>("soft daylight");
  const [backgroundDescription, setBackgroundDescription] = useState(
    "Minimalist studio backdrop with subtle branded gradients"
  );
  const [narrative, setNarrative] = useState(defaultNarrative);
  const [callToAction, setCallToAction] = useState(
    "Close with a confident smile and invite viewers to explore the full release notes."
  );
  const [storyBeats, setStoryBeats] = useState(
    "1. Friendly greeting\n2. Highlight key product benefit\n3. Short demo walkthrough\n4. CTA"
  );
  const [extraNotes, setExtraNotes] = useState(
    "Maintain lip sync accuracy with clear enunciation. Focus on natural facial expressions."
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarPreview(dataUrl);
      setIsCopySuccess(false);
    } catch (error) {
      console.error(error);
      alert("Unable to load that image. Please try another file.");
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setAvatarPreview(dataUrl);
        setIsCopySuccess(false);
      } catch (error) {
        console.error(error);
        alert("Unable to load that image. Please try another file.");
      }
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const generatedPrompt = useMemo(() => {
    const promptSections = [
      `You are producing a Kling 2.6 talking-head video.`,
      avatarPreview
        ? `Use the uploaded avatar image as the exact face reference for the talent.`
        : `Use a digital avatar named ${avatarName}, ${roleDescription}.`,
      avatarPreview && avatarCredits
        ? `Avatar reference attribution: ${avatarCredits}.`
        : avatarCredits
        ? `Avatar reference attribution: ${avatarCredits}.`
        : null,
      `Voice & delivery tone: ${tone}. Ensure syncing with the following narration script and keep mouth shapes crisp for each phoneme.`,
      `Camera framing: medium close-up from chest up. Camera motion: ${cameraMotion}.`,
      `Lighting: ${lighting}. Background: ${backgroundDescription}.`,
      `Story beats (follow sequentially):\n${storyBeats.trim()}`,
      `Narration script (match timing & lip sync):\n${narrative.trim()}`,
      callToAction ? `Closing moment: ${callToAction}` : null,
      extraNotes ? `Production notes: ${extraNotes}` : null,
      `Export at 1080p, 16:9. Keep total duration under 60 seconds.`
    ].filter(Boolean);

    return promptSections.join("\n\n");
  }, [
    avatarCredits,
    avatarName,
    avatarPreview,
    backgroundDescription,
    callToAction,
    cameraMotion,
    extraNotes,
    lighting,
    narrative,
    roleDescription,
    storyBeats,
    tone
  ]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopySuccess(true);
      setTimeout(() => setIsCopySuccess(false), 2500);
    } catch (error) {
      console.error(error);
      alert("Unable to copy. Please copy manually from the text area.");
    }
  }, [generatedPrompt]);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>Kling 2.6 Avatar Prompt Studio</h1>
          <p>
            Upload your avatar reference, craft narrative beats, and generate a production-ready prompt tailored for Kling 2.6 text-to-video generation.
          </p>
        </div>
        <button
          type="button"
          className="upload-trigger"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Avatar
        </button>
      </header>

      <section className="content">
        <div className="panel">
          <h2>Avatar Reference</h2>
          <label
            className={`dropzone ${avatarPreview ? "has-image" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {avatarPreview ? (
              <div className="image-wrapper">
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  fill
                  sizes="220px"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <span>Drop an image or click to browse</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <div className="field-grid">
            <label>
              <span>Avatar name</span>
              <input
                value={avatarName}
                onChange={(event) => setAvatarName(event.target.value)}
                placeholder="e.g. Avery"
              />
            </label>
            <label>
              <span>Credit / Source</span>
              <input
                value={avatarCredits}
                onChange={(event) => setAvatarCredits(event.target.value)}
                placeholder="Optional attribution"
              />
            </label>
          </div>
          <label>
            <span>Role & presence</span>
            <input
              value={roleDescription}
              onChange={(event) => setRoleDescription(event.target.value)}
              placeholder="How should the talent be perceived?"
            />
          </label>
        </div>

        <div className="panel">
          <h2>Performance Direction</h2>
          <div className="chip-group">
            {(
              ["confident", "friendly", "inspirational", "urgent"] as ToneOption[]
            ).map((option) => (
              <button
                key={option}
                type="button"
                className={`chip ${tone === option ? "chip--active" : ""}`}
                onClick={() => setTone(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="field-grid">
            <label>
              <span>Camera motion</span>
              <select
                value={cameraMotion}
                onChange={(event) => setCameraMotion(event.target.value as CameraMotion)}
              >
                <option value="steady">Locked-off, steady shot</option>
                <option value="slow push-in">Slow push-in</option>
                <option value="dynamic">Dynamic slider motion</option>
                <option value="handheld">Handheld energy</option>
              </select>
            </label>
            <label>
              <span>Lighting</span>
              <select
                value={lighting}
                onChange={(event) => setLighting(event.target.value as LightingStyle)}
              >
                <option value="soft daylight">Soft daylight</option>
                <option value="studio key light">Studio key light</option>
                <option value="cinematic moody">Cinematic moody</option>
                <option value="vivid neon">Vivid neon</option>
              </select>
            </label>
          </div>
          <label>
            <span>Background</span>
            <input
              value={backgroundDescription}
              onChange={(event) => setBackgroundDescription(event.target.value)}
              placeholder="Set design and atmosphere"
            />
          </label>
          <label>
            <span>Story beats</span>
            <textarea
              value={storyBeats}
              onChange={(event) => setStoryBeats(event.target.value)}
              rows={4}
            />
          </label>
        </div>

        <div className="panel">
          <h2>Narration Script</h2>
          <label>
            <span>Voiceover lines</span>
            <textarea
              value={narrative}
              onChange={(event) => setNarrative(event.target.value)}
              rows={8}
            />
          </label>
          <label>
            <span>Call to action</span>
            <input
              value={callToAction}
              onChange={(event) => setCallToAction(event.target.value)}
              placeholder="How should the video wrap up?"
            />
          </label>
          <label>
            <span>Additional production notes</span>
            <textarea
              value={extraNotes}
              onChange={(event) => setExtraNotes(event.target.value)}
              rows={3}
              placeholder="Add timing cues, expression goals, etc."
            />
          </label>
        </div>
      </section>

      <section className="prompt-output">
        <div className="prompt-header">
          <h2>Generated Kling 2.6 Prompt</h2>
          <button type="button" onClick={copyToClipboard} className="copy-btn">
            {isCopySuccess ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea value={generatedPrompt} readOnly rows={14} />
      </section>
    </div>
  );
}
