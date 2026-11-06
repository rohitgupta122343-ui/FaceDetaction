import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const [expression, setExpression] = useState("Starting camera…");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let cameraStream = null;
    let landmarker = null;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not available in this browser.");
        }

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
        });

        if (!active) {
          landmarker.close();
          return;
        }

        landmarkerRef.current = landmarker;
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (!active) {
          cameraStream.getTracks().forEach((track) => track.stop());
          landmarker.close();
          return;
        }

        const video = videoRef.current;
        if (!video) throw new Error("Camera preview could not be initialized.");

        video.srcObject = cameraStream;
        await video.play();
        if (active) setExpression("Ready to detect your mood");
      } catch (cameraError) {
        if (active) {
          setError(cameraError.message || "Unable to start the camera.");
          setExpression("Camera unavailable");
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      cameraStream?.getTracks().forEach((track) => track.stop());
      landmarker?.close();
      landmarkerRef.current = null;
    };
  }, []);

  function detectExpression() {
    const landmarker = landmarkerRef.current;
    const video = videoRef.current;

    if (!landmarker || !video || video.readyState < 2) {
      setError("Wait for the camera to start before detecting your mood.");
      return null;
    }

    setError("");
    const result = landmarker.detectForVideo(video, performance.now());

    if (!result.faceBlendshapes.length) {
      setExpression("No face detected");
      return null;
    }

    const categories = result.faceBlendshapes[0].categories;
    const getScore = (name) =>
      categories.find((item) => item.categoryName === name)?.score || 0;

    const happy = (getScore("mouthSmileLeft") + getScore("mouthSmileRight")) / 2;
    const surprise =
      (getScore("browInnerUp") +
        getScore("eyeWideLeft") +
        getScore("eyeWideRight") +
        getScore("jawOpen")) /
      4;
    const sad =
      (getScore("mouthFrownLeft") +
        getScore("mouthFrownRight") +
        getScore("browDownLeft") +
        getScore("browDownRight")) /
      4;

    const mood =
      happy > 0.45
        ? "happy"
        : surprise > 0.2
          ? "surprised"
          : sad > 0.01
            ? "sad"
            : "neutral";

    setExpression(mood);
    return mood;
  }

  function handleClick() {
    const mood = detectExpression();
    if (mood) onClick(mood);
  }

  return (
    <div className="face-expression" style={styles.container}>
      <h1>Face Expression Detection</h1>
      <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
      <h2 style={styles.expression}>{expression}</h2>
      <button type="button" onClick={handleClick}>Face Detection</button>
      {error && <p role="alert" style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    fontFamily: "Arial",
  },
  video: {
    width: "100%",
    maxWidth: "500px",
    borderRadius: "15px",
    border: "2px solid #444",
  },
  expression: {
    fontSize: "28px",
    marginTop: "20px",
  },
  error: {
    color: "#ff9a9a",
  },
};

export default FaceExpression;
