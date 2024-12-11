import React, { useRef, useState } from "react";
import { Mic, FileVolume } from "lucide-react";
import MicRecorder from "mic-recorder-to-mp3";

function ReadingInterface({ file, setFile, inputText, setInputText, handleUpload, analysis, feedback, correctedTranscription, status }) {
    const fileInputRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef(new MicRecorder({ bitRate: 128 }));

    const handleFileUploadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleStartStopRecording = async () => {
        if (isRecording) {
            recorder.current
                .stop()
                .getMp3()
                .then(([buffer, blob]) => {
                    const mp3File = new File(buffer, "recording.mp3", { type: "audio/mp3" });
                    setFile(mp3File);
                    setIsRecording(false);
                })
                .catch((e) => {
                    console.error("Recording failed:", e);
                    setIsRecording(false);
                });
        } else {
            try {
                await recorder.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Failed to start recording:", e);
            }
        }
    };

    function highlightText(correctedTranscription) {
        if (!correctedTranscription) return null;

        const regex = /\[(.+?)\|(replacement|addition|omission|repetition|reversal)(?:\|(.+?))?\]/g;
        const parts = [];
        let lastIndex = 0;

        correctedTranscription.replace(regex, (match, phrase, type, original, offset) => {
            if (offset > lastIndex) {
                parts.push(<span key={lastIndex}>{correctedTranscription.slice(lastIndex, offset)}</span>);
            }

            const typeToClass = {
                replacement: "text-purple-500",
                addition: "text-red-500",
                omission: "text-blue-500",
                repetition: "text-orange-500",
                reversal: "text-green-500",
            };

            let highlightedText = phrase;
            if ((type === 'replacement' || type === 'reversal') && original) {
                highlightedText += ` (original: ${original})`;
            }

            parts.push(
                <span key={offset} className={typeToClass[type]}>
                    {highlightedText}
                </span>
            );

            lastIndex = offset + match.length;
        });

        if (lastIndex < correctedTranscription.length) {
            parts.push(<span key={lastIndex}>{correctedTranscription.slice(lastIndex)}</span>);
        }

        return parts;
    }

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
            {/* Input Text */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Reading Exercise</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text here..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
                    ></textarea>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    {!feedback && status === "processing" && (
                        <div className="w-8 h-8 border-2 border-t-transparent border-gray-800 rounded-full animate-spin my-0 mx-auto"></div>
                    )}

                    {!feedback && status !== "processing" && (
                        <p className="text-gray-500">No feedback available yet.</p>
                    )}

                    {feedback && status === "completed" && (
                        <div>{feedback}</div>
                    )}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Corrected Transcription</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">

                    {!correctedTranscription && status === "processing" && (
                        <div className="w-8 h-8 border-2 border-t-transparent border-gray-800 rounded-full animate-spin my-0 mx-auto"></div>
                    )}

                    {!correctedTranscription && status !== "processing" && (
                        <p className="text-gray-500">No transcription available yet.</p>
                    )}

                    {correctedTranscription && status === "completed" && (
                        <div>{highlightText(correctedTranscription)}</div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-4">
                    <button
                        className={`${isRecording ? "bg-red-700" : "bg-red-500"} hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all`}
                        onClick={handleStartStopRecording}
                    >
                        <Mic className="h-5 w-5" />
                        <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
                    </button>
                    <button
                        className={`${isRecording ? "hidden" : "block"} bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full flex items-center space-x-2 transition-all`}
                        onClick={handleFileUploadButtonClick}
                    >
                        <FileVolume className="h-5 w-5" />
                        <span>{file ? file.name : "Upload"}</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                    />
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
                    onClick={handleUpload}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default ReadingInterface;
