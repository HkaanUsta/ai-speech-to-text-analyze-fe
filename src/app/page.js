"use client"
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReadingInterface from "@/components/layout/ReadingInterface";
import InfoCard from "@/components/layout/InfoCard";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {fetchFile} from "@ffmpeg/util";

const ffmpeg = new FFmpeg({ log: true });

function App() {
    const [file, setFile] = useState(null);
    const [inputText, setInputText] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [readingSpeed, setReadingSpeed] = useState("");
    const [status, setStatus] = useState("");
    const [cost, setCost] = useState([{ assemblyAI: 0, openAI: 0 }]);
    const [transcription, setTranscription] = useState("");
    const [feedback, setFeedback] = useState("");
    const [correctedTranscription, setCorrectedTranscription] = useState("");
    const [accuracy, setAccuracy] = useState("");


    const convertToMp3 = async (inputFile) => {
        if (!ffmpeg.loaded) {
            toast.info("Loading FFmpeg...");
            await ffmpeg.load();
        }

        toast.info("Converting file to MP3 format...");
        ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile));

        await ffmpeg.exec(["-i", inputFile.name, "output.mp3"]);

        const data = await ffmpeg.readFile("output.mp3");
        const mp3Blob = new Blob([data.buffer], { type: "audio/mp3" });

        return new File([mp3Blob], "converted.mp3", { type: "audio/mp3" });
    };


    const handleUpload = async () => {


        let fileToUpload = file;

        // If the file is OGG, convert it to MP3
        if (file && file.type !== "audio/mp3") {
            fileToUpload = await convertToMp3(file);
            setFile(fileToUpload); // Update the file in state
        }


        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("text", inputText);

        try {
            setStatus("processing");
            toast.info("The process has been started. Please wait...");
            //Bu kısım complex yapılarda api.js gibi bir dosya içine taşınarak merkezi bir sistem sağlanabilir
            const response = await axios.post("http://localhost:8000/api/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAnalysis(response.data.analysis);
            setReadingSpeed(response.data.reading_speed);
            setCost(response.data.cost);
            setTranscription(response.data.transcription);
            setFeedback(response.data.feedback);
            setCorrectedTranscription(response.data.corrected_transcription);
            setAccuracy(response.data.accuracy);

            setStatus("completed");
            toast.success("The process has been completed successfully!");
        } catch (error) {
            setStatus("failed");
            const errorMessage = error.response?.data?.error || "An unknown error occurred.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <ReadingInterface
                            file={file}
                            setFile={setFile}
                            inputText={inputText}
                            setInputText={setInputText}
                            handleUpload={handleUpload}
                            transcription={transcription}
                            correctedTranscription={correctedTranscription}
                            feedback={feedback}
                            status={status}
                        />
                    </div>
                    <div>
                        <InfoCard
                            status={status}
                            analysis={analysis}
                            readingSpeed={readingSpeed}
                            cost={cost}
                            accuracy={accuracy}
                        />
                    </div>
                </div>
            </main>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
    );
}

export default App;
