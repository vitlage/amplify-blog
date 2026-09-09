"use client";
import React, { useEffect, useRef } from 'react';
import styles from './ScrollFillText.module.css';

/**
 * ScrollFillText – renders children exactly like a <div>, then after mount
 * wraps each text node's words in <span> elements and progressively fills
 * them from light gray to black based on scroll position.
 *
 * Spans with gradient classes (whole_screen_text_color*) are left untouched.
 */

const INITIAL_COLOR = '#b8c4ce';
const FILLED_COLOR = '#1a1a1a';

const SKIP_CLASSES = [
    'whole_screen_text_color',
    'whole_screen_text_color2',
    'whole_screen_text_color3',
];

function shouldSkipNode(el) {
    if (!el.className) return false;
    return SKIP_CLASSES.some((c) => el.className.includes(c));
}

/**
 * Walk the DOM tree and wrap every bare text word in a <span class="word">.
 * Skip any element whose class is in SKIP_CLASSES.
 */
function wrapWordsInDOM(container, wordClass) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];

    // Collect text nodes first (can't mutate while walking)
    while (walker.nextNode()) {
        const node = walker.currentNode;
        // Skip text inside gradient-colored spans
        if (node.parentElement && node.parentElement !== container && shouldSkipNode(node.parentElement)) {
            continue;
        }
        if (node.textContent.trim()) {
            textNodes.push(node);
        }
    }

    textNodes.forEach((node) => {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();

        parts.forEach((part) => {
            if (part.trim()) {
                const span = document.createElement('span');
                span.className = wordClass;
                span.style.color = INITIAL_COLOR;
                span.textContent = part;
                frag.appendChild(span);
            } else if (part) {
                frag.appendChild(document.createTextNode(part));
            }
        });

        node.parentNode.replaceChild(frag, node);
    });
}

const ScrollFillText = ({ children, className }) => {
    const containerRef = useRef(null);
    const wrappedRef = useRef(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || wrappedRef.current) return;

        // Wrap words in spans after mount
        wrapWordsInDOM(el, styles.word);
        wrappedRef.current = true;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const vpWidth = window.innerWidth;
            const vpHeight = window.innerHeight;

            const visible = rect.right > 0 && rect.left < vpWidth && rect.bottom > 0 && rect.top < vpHeight;
            if (!visible) return;

            // Progress with 1.5× multiplier so fill runs ahead of scroll
            const progress = Math.min(
                1,
                Math.max(0, ((vpWidth - rect.left) / (vpWidth + rect.width)) * 1.5)
            );

            const wordEls = el.querySelectorAll(`.${styles.word}`);
            const total = wordEls.length;
            if (!total) return;

            wordEls.forEach((wordEl, i) => {
                wordEl.style.color = progress > (i / total) ? FILLED_COLOR : INITIAL_COLOR;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
};

export default ScrollFillText;
