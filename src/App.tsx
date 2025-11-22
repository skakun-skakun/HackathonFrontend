import { useState, useRef } from 'react'
import './App.css'
import * as path from "node:path";

export default function App() {
    const textboxRef: any = useRef<HTMLTextAreaElement | null>(null);
    const buttonRef: any = useRef<HTMLButtonElement | null>(null);
    const [textAreaValue, setTextAreaValue] = useState('');

    const [classification, setClassification] = useState('');
    const [genRequest, setGenRequest] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (event: any) => {
        setTextAreaValue(event.target.value);
        if (textboxRef.current instanceof HTMLTextAreaElement) {
            textboxRef.current.style.height="inherit";
            textboxRef.current.style.height = `${textboxRef.current.scrollHeight}px`;
        }
    }

    const handleSubmit = async (event: any) => {
        if (event)
            event.preventDefault();
        // setTextAreaValue('');
        if (buttonRef.current instanceof HTMLButtonElement) {
            buttonRef.current.disabled = true;
            buttonRef.current.classList.toggle("cursor-pointer");
            buttonRef.current.classList.toggle("opacity-50");
            setIsLoading(true);
            await fetch('https://a6rn8adkxb.eu-central-1.awsapprunner.com/api/process-complaint', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "text": textAreaValue
                })
            }).then(res => res.json()).then(data => {
                if (data.success) {
                    setClassification(data.data.classification.result);
                    setGenRequest(data.data.generatedRequest);
                }
                else {
                    setClassification(data.message);
                }
                setIsLoading(false);
            });
            // console.log(res);
            buttonRef.current.disabled = false;
            buttonRef.current.classList.toggle("cursor-pointer");
            buttonRef.current.classList.toggle("opacity-50");
        }
    }

    const checkForEnter = async (event: any) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            await handleSubmit(null);
        }
    }

    return (
        <div className={"flex flex-col h-screen items-center gap-10 pt-10 " + (classification ? "justify-start": "justify-center")}>
            <form className="flex flex-col w-xl max-w-screen gap-10 px-10" onSubmit={handleSubmit}>
                <h1 className="text-center text-6xl">Комунальний помічник</h1>
                <div className="relative">
                    <textarea ref={textboxRef} value={textAreaValue} onChange={handleChange} onKeyDown={checkForEnter} placeholder="Чим я можу Вам допомогти?" rows={1}
                              className="w-full min-h-16 text-xl/10 rounded-[32px] py-3 pl-5 pr-15 bg-white shadow-xl placeholder:text-neutral-500 resize-none"/>
                    <button ref={buttonRef} type="submit" className="absolute bottom-5 right-4 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"
                             fill="none">
                            <path
                                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                                fill="black"/>
                            <path d="M8 16H24M24 16L17.7778 10M24 16L17.7778 22" stroke="white" strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </form>
            {isLoading ? <p className="text-2xl">loading...</p>:
                <div className="flex flex-col gap-10 px-10 w-6xl max-w-screen">
                    <p className="text-xl">{classification}</p>
                    {genRequest ? <p className="text-2xl font-semibold whitespace-pre-line">{genRequest}</p> : null}
                    <p></p>
                </div>
            }
        </div>
    )
}
