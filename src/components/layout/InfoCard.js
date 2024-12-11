import React from 'react';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

function InfoCard({
          status,
          analysis,
          readingSpeed,
          cost,
          accuracy,
      }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Info</h3>

            {status === "processing" && (
                <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 border-2 border-t-transparent border-gray-800 rounded-full animate-spin my-0 mx-auto"></div>
                </div>
            )}
            {status !== "processing" && (
                <div className="space-y-4">
                    <div className="flex flex-col space-x-3">

                        <div className="flex space-x-3">
                            <TrendingUp
                                className={`${accuracy ? "translate-y-2/4" : ""} h-5 w-5 text-red-500 transition-all`}/>
                            <p className="text-sm text-gray-600">Accuracy</p>

                        </div>
                        <p className={`${accuracy ? "" : "hidden"} font-semibold text-gray-800 pl-5`}>{accuracy}%</p>
                    </div>
                    <div className="flex flex-col space-x-3">

                        <div className="flex space-x-3">
                            <Clock
                                className={`${readingSpeed ? "translate-y-2/4" : ""} h-5 w-5 text-blue-500 transition-all`}/>
                            <p className="text-sm text-gray-600">Reading Speed</p>

                        </div>
                        <p className={`font-semibold text-gray-800 pl-5 ${readingSpeed ? "block" : "hidden"}`}>{readingSpeed} words/min</p>
                    </div>

                    <div className="flex flex-col space-x-3">
                        <div className="flex space-x-3">
                            <DollarSign
                                className={`${status === "completed" ? "translate-y-2/4" : ""} h-5 w-5 text-green-500 transition-all`}/>
                            <p className="text-sm text-gray-600">Api Costs</p>
                        </div>

                        {status === "completed" && (
                            <div>
                                <p className="font-semibold text-gray-800 pl-5">AssemblyAI:
                                    ${cost?.assemblyAI?.toFixed(4) || "0.0000"}</p>
                                <p className="font-semibold text-gray-800 pl-5">OpenAI:
                                    ${cost?.openAI?.toFixed(4) || "0.0000"}</p>
                                <p className="font-semibold text-gray-800 pl-5">Total:
                                    ${((cost?.assemblyAI || 0) + (cost?.openAI || 0)).toFixed(4)}</p>
                            </div>
                        )}

                        {/*<div className="flex space-x-3">
                        <Bot className="h-5 w-5 text-orange-500 translate-y-2/4"/>
                        <p className="text-sm text-gray-600">AI Analyze</p>
                    </div>
                    <p className="font-semibold text-gray-800 pl-5">
                        {status === "processing" && (
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border-2 border-t-transparent border-gray-800 rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </div>
                        )}
                        {status === "completed" && analysis && <span>{analysis}</span>}
                    </p>*/}
                    </div>
                </div>
            )}


        </div>
    );
}

export default InfoCard;