import {useEffect, useState} from "react";
import styles from "./inputai.module.css";

const phrases = [
    'Welcome email for a fashion brand',
    'Product showcase email for a guitar brand',
    'Early bird pricing email for a tech conference'
];

const InputAI = () => {
    const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);
    const [animate, setAnimate] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputValue.trim() || loading) {
            return;
        }
        try {
            setLoading(true);

            const response = await fetch("https://app.convertic.ai/public/api/v2/landing/demo/generate-template?prompt=" + encodeURIComponent(inputValue), {
                method: "GET",
                headers: {
                    "Accept": "text/html"
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.text();
            setHtmlContent(result);

            setInputValue("");
            setLoading(false);
        } catch (error) {

        }

    }

    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            if (!inputValue) {
                setAnimate(true);
                setTimeout(() => {
                    index = (index + 1) % phrases.length;
                    setCurrentPhrase(phrases[index]);
                    setAnimate(false);
                }, 300);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isFocused, inputValue]);

    return (
        <div>
            <div className={styles.aiInputContainer}>
                <form className={styles.aiInputBox} onSubmit={handleSubmit}>
                    {!inputValue && (
                        <div className={`${styles.placeholderWrapper} ${animate ? styles.fadeOut : styles.fadeIn}`}>
                            {currentPhrase}
                        </div>
                    )}
                    <input
                        className={styles.aiInputBoxControl}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button
                        type="submit"
                        className={`${styles.aiInputBoxButton} ${isFocused ? styles.aiInputBoxButton_active : ''}`}
                    >

                        {loading ? (
                                <div className={`spinner-border ${styles.aiInputBoxButtonSpinner}`} role="status"></div>
                            ) :
                            (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"
                                     className={styles.aiInputBoxButtonIcon} stroke-width="2">
                                    <path
                                        d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                        fill="currentColor"></path>
                                </svg>
                            )
                        }
                    </button>
                </form>
            </div>
            {htmlContent ?
                <div className={styles.aiTemplateBox}>
                    <iframe
                        className={styles.aiTemplateBoxIframe}
                        srcDoc={htmlContent}
                        title="Result"
                    />
                </div> : ''}
        </div>
    );
};

export default InputAI;