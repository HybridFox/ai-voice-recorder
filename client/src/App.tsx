import { useEffect, useState } from "react";
import "./App.css";

import { IMediaRecorder, MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import ky from "ky";

let chunks: Blob[] = [];

function App() {
	const [mediaRecorder, setMediaRecorder] = useState<IMediaRecorder>();
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<{ id: number; sentence: string }>();
	const [blob, setBlob] = useState<Blob>()

	useEffect(() => {
		initMediaRecorder();
		loadPrompt();
	}, []);

	const loadPrompt = async () => {
		setPrompt(await ky.get('/api/v1/prompts').json());
	}

	const initMediaRecorder = async () => {
		await register(await connect());

		console.log("getUserMedia supported.");

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
		setMediaRecorder(mediaRecorder)

		mediaRecorder.onstop = (e) => {
			const blob = new Blob(chunks, {
				type: "audio/wav",
			});

			setBlob(blob);
		}

		mediaRecorder.ondataavailable = (e) => {
			chunks.push(e.data);
		};
	}

	const startRecording = () => {
		setBlob(undefined);

		if (!mediaRecorder) {
			return;
		}

		mediaRecorder.start();
		console.log(mediaRecorder.state);
		console.log("recorder started");
		setIsRecording(true)
	};

	const stopRecording = () => {
		if (!mediaRecorder) {
			return;
		}

		mediaRecorder.stop();
		console.log(mediaRecorder.state);
		console.log("recorder stopped");
		setIsRecording(false);
	};

	const submitPrompt = () => {
		ky.post(`/api/v1/prompts/${prompt?.id}`, {
			body: blob
		})
			.then(() => {
				loadPrompt();
				setBlob(undefined);
				chunks = []
			})
	};

	return (
		<div>
			<h1>{prompt?.sentence}</h1>
			<button onClick={() => loadPrompt()}>LOAD PROMPT</button>
			{!isRecording && (
				<button onClick={() => startRecording()}>
					START RECORDING
				</button>
			)}
			{isRecording && (
				<button onClick={() => stopRecording()}>STOP RECORDING</button>
			)}
			{!!blob && <button onClick={() => submitPrompt()}>SUBMIT PROMPT</button>}
		</div>
	);

	// return <></>
}

export default App;
