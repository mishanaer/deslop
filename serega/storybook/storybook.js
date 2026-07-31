import { useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import MiniAppProvider from "../../mini-app/MiniAppProvider";
import { RegularButton } from "../../mini-app/components/Button";
import SegmentedControl from "../../mini-app/components/SegmentedControl";
import Text from "../../mini-app/components/Text";

import { seregaGentle } from "../serega-gentle/assets/waapi/serega-gentle.js";
import { seregaEmotional } from "../serega-emotional/assets/waapi/serega-emotional.js";

import faceLowerUrl from "./assets/face-lower.png";
import faceUpperUrl from "./assets/face-upper.png";
import "./storybook.css";

const SAMPLE_TEXT =
  "Я Серёга — скилл для анимации текста. Отправьте агенту ссылку на репозиторий и напишите: «Подключи Серёгу к проекту»";
const SHORT_SAMPLE_TEXT = "А этот пресет — для коротких фраз";
const SEREGA_URL = "https://github.com/mishanaer/deslop/tree/main/serega";
const TALK_STEP_MS = 60;
const TALK_END_LEAD_MS = 500;
const TALK_DISTANCE_PX = 4;
const TALK_ROTATION_DEG = 4;

const countCharacters = (text) => Array.from(text).length;

const EFFECTS = [
  {
    id: "serega-gentle",
    label: "Gentle",
    text: SAMPLE_TEXT,
    duration: (text) => 500 + Math.max(0, countCharacters(text) - 1) * 15,
    create: (element, text) =>
      seregaGentle(element, {
        phrases: [text],
        autoplay: false,
      }),
  },
  {
    id: "serega-emotional",
    label: "Emotional",
    text: SHORT_SAMPLE_TEXT,
    duration: (text) => 680 + countCharacters(text) * 25,
    create: (element, text) =>
      seregaEmotional(element, {
        text,
        autoplay: false,
      }),
  },
];

const AnimationPreview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sampleRef = useRef(null);
  const faceRef = useRef(null);
  const upperFaceRef = useRef(null);
  const lowerFaceRef = useRef(null);
  const controlsRef = useRef(null);
  const talkTimerRef = useRef(null);
  const talkStopTimerRef = useRef(null);
  const talkSessionRef = useRef(0);
  const activeEffect = EFFECTS[activeIndex];

  const resetFace = () => {
    talkSessionRef.current += 1;

    if (talkTimerRef.current !== null) {
      window.clearInterval(talkTimerRef.current);
      talkTimerRef.current = null;
    }

    if (talkStopTimerRef.current !== null) {
      window.clearTimeout(talkStopTimerRef.current);
      talkStopTimerRef.current = null;
    }

    if (faceRef.current) faceRef.current.dataset.talking = "false";

    for (const layer of [upperFaceRef.current, lowerFaceRef.current]) {
      if (layer) layer.style.transform = "translateY(0px) rotate(0deg)";
    }
  };

  const startTalking = (controls, animationDuration) => {
    resetFace();

    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      !upperFaceRef.current ||
      !lowerFaceRef.current
    ) {
      return;
    }

    const talkingDuration = Math.max(0, animationDuration - TALK_END_LEAD_MS);
    if (talkingDuration === 0) return;

    const session = talkSessionRef.current;
    const randomValue = (range) => (Math.random() * 2 - 1) * range;
    const moveLayer = (layer) => {
      const y = randomValue(TALK_DISTANCE_PX).toFixed(2);
      const rotation = randomValue(TALK_ROTATION_DEG).toFixed(2);
      layer.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
    };
    const moveFace = () => {
      moveLayer(upperFaceRef.current);
      moveLayer(lowerFaceRef.current);
    };

    faceRef.current.dataset.talking = "true";
    moveFace();
    talkTimerRef.current = window.setInterval(moveFace, TALK_STEP_MS);
    talkStopTimerRef.current = window.setTimeout(() => {
      if (talkSessionRef.current === session) resetFace();
    }, talkingDuration);

    controls.finished.finally(() => {
      if (talkSessionRef.current === session) resetFace();
    });
  };

  const play = (controls = controlsRef.current) => {
    if (!controls) return;
    controls.play();
    startTalking(controls, activeEffect.duration(activeEffect.text));
  };

  useLayoutEffect(() => {
    const element = sampleRef.current;
    if (!element) return undefined;

    element.textContent = activeEffect.text;
    const controls = activeEffect.create(element, activeEffect.text);
    controlsRef.current = controls;
    play(controls);

    return () => {
      resetFace();
      controls.destroy();
      if (controlsRef.current === controls) controlsRef.current = null;
    };
  }, [activeEffect]);

  const replay = () => play();
  const setFacePressed = (isPressed) => {
    if (faceRef.current) {
      faceRef.current.dataset.pressed = isPressed ? "true" : "false";
    }
  };
  const openSerega = () => {
    window.open(SEREGA_URL, "_blank", "noopener,noreferrer");
  };
  const handleOpenKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openSerega();
  };
  const handleFaceKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (event.repeat) return;
    setFacePressed(true);
    replay();
  };
  const handleFaceKeyUp = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setFacePressed(false);
  };

  return (
    <main className="animation-preview">
      <div
        className="animation-preview__stack"
        data-effect={activeEffect.id}
      >
        <div
          ref={faceRef}
          className="animation-preview__face"
          data-talking="false"
          data-pressed="false"
          style={{ "--talk-transition-duration": `${TALK_STEP_MS / 2}ms` }}
          onClick={replay}
          onPointerDown={(event) => {
            if (event.button === 0) setFacePressed(true);
          }}
          onPointerUp={() => setFacePressed(false)}
          onPointerCancel={() => setFacePressed(false)}
          onPointerLeave={() => setFacePressed(false)}
          onKeyDown={handleFaceKeyDown}
          onKeyUp={handleFaceKeyUp}
          role="button"
          tabIndex={0}
          aria-label="Повторить анимацию"
        >
          <img
            ref={upperFaceRef}
            className="animation-preview__face-layer animation-preview__face-layer--upper"
            src={faceUpperUrl}
            alt=""
            data-testid="face-upper"
          />
          <img
            ref={lowerFaceRef}
            className="animation-preview__face-layer animation-preview__face-layer--lower"
            src={faceLowerUrl}
            alt=""
            data-testid="face-lower"
          />
        </div>

        <div className="animation-preview__segments">
          <SegmentedControl
            segments={EFFECTS.map(({ label }) => label)}
            onChange={setActiveIndex}
            colorScheme="dark"
            fitContent
            aria-label="Стиль анимации"
          />
        </div>

        <div className="animation-preview__content-stage">
          <div
            className="animation-preview__content-flow animation-preview__content-flow--sizer"
            aria-hidden="true"
          >
            <p className="animation-preview__sample">{SAMPLE_TEXT}</p>
            <div className="animation-preview__button-sizer" />
          </div>

          <div className="animation-preview__content-flow">
            <p
              ref={sampleRef}
              className="animation-preview__sample"
              data-effect={activeEffect.id}
            >
              {activeEffect.text}
            </p>

            <RegularButton
              variant="filled"
              label="Открыть Серёгу"
              onClick={openSerega}
              onKeyDown={handleOpenKeyDown}
              role="link"
              tabIndex={0}
              data-preview-button
              data-testid="open-serega-button"
            />
          </div>
        </div>
      </div>

      <footer className="animation-preview__footer">
        <Text variant="body" weight="regular">
          Серёга — один из инструментов deslop, которые помогают агентам делать
          нормальный дизайн
        </Text>
      </footer>
    </main>
  );
};

createRoot(document.querySelector("#root")).render(
  <MiniAppProvider defaultColorScheme="dark">
    <AnimationPreview />
  </MiniAppProvider>,
);
