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
            setHtmlContent(JSON.parse(result).content);

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

    const examplePrompts = [
        
    ];

    const tryExamplePrompt = (text) => {
        setInputValue(text);
    }

    return (
        <div>
            <div className="row">
                <div className="col">
                    <div className="container">
                        <div className="row">
                            <h2 className={styles.aiInputTitle}>Write a prompt to generate an AMP email:</h2>
                        </div>
                    </div>
                </div>
            </div>
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
                                     className={styles.aiInputBoxButtonIcon} strokeWidth="2">
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
                <div>
                    <h2 className={styles.aiTryExample}>Click to try example prompts:</h2>
                    <div className={styles.stepper_prompt_suggestion}>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt("Welcome email for a fashion brand")}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>
                            <div className={styles.example_prompt_text}>Welcome email for a fashion brand</div>
                        </div>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt("Product showcase email for a guitar brand")}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>
                            <div className={styles.example_prompt_text}>Product showcase email for a guitar brand</div>
                        </div>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt("Simple discount offer email for a cosmetics brand")}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>
                            <div className={styles.example_prompt_text}>Simple discount offer email for a cosmetics brand</div>
                        </div>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt('"Thank you" email for subscribers of a skincare brand')}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>
                            <div className={styles.example_prompt_text}>{"Thank you"} email for subscribers of a skincare brand</div>
                        </div>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt('"Sale is ending soon" email for a sustainable footwear brand')}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>

                            <div className={styles.example_prompt_text}>{"Sale is ending soon"} email for a sustainable footwear brand</div>
                        </div>
                        <div className={styles.stepper_prompt_suggestion_item} onClick={() => tryExamplePrompt("Early bird pricing email for a tech conference with feedback form at the bottom")}>
                            <div className={styles.hor_circle_small}>
                                <div className={styles.hor_circle_inner_small}></div>
                            </div>
                            <div className={styles.example_prompt_text}>Early bird pricing email for a tech conference with feedback form at the bottom</div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default InputAI;