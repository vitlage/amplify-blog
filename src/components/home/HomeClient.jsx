"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import InputAI from "@/components/inputAI/InputAI";
import JSAlert from 'js-alert';
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import SyncSection from '@/components/syncSection/SyncSection';
import ScrollFillText from '@/components/scrollFillText/ScrollFillText';
import Aurora from '@/components/aurora/Aurora';
import BidWinDeliver from '@/components/bidWinDeliver/BidWinDeliver';
import AuralisHero from '@/components/auralisHero/AuralisHero';
// import BrandIntro from '@/components/brandIntro/BrandIntro';
import TextType from '@/components/textType/TextType';
import CookieConsent from '@/components/cookieConsent/CookieConsent';
import TryItInInbox from '@/components/tryItInInbox/TryItInInbox';

export default function HomeClient({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;

  const [faqItemOpen, setFaqItemOpen] = useState(0);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      if (window.innerWidth <= 768) {
        return;
      }
      const section = document.querySelector('.horizontal-sticky');
      if (!section) return;
      const offsetTop = section.parentElement.offsetTop;
      const scrollSection = document.querySelector('.horizontal-block');
      if (!scrollSection) return;
      let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
      percentage = percentage < 0 ? 0 : percentage > 177 ? 177 : percentage;
      scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const lockScroll = () => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const preventBackgroundScroll = (e) => {
    if (!e.target.closest('.clickable_modal')) {
      e.preventDefault();
    }
  };

  const onTryItClickable1 = () => {
    document.querySelector(".clickable_modal1").style.display = "block";
    lockScroll();
    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    if (window.analytics) window.analytics.track('Try it clickable 1 clicked');
  };
  const onTryItClickable2 = () => {
    document.querySelector(".clickable_modal2").style.display = "block";
    lockScroll();
    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    if (window.analytics) window.analytics.track('Try it clickable 2 clicked');
  };
  const onTryItClickable3 = () => {
    document.querySelector(".clickable_modal3").style.display = "block";
    lockScroll();
    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    if (window.analytics) window.analytics.track('Try it clickable 3 clicked');
  };
  const onTryItClickableClose = () => {
    document.querySelector(".clickable_modal1").style.display = "none";
    unlockScroll();
    document.removeEventListener('wheel', preventBackgroundScroll);
    document.removeEventListener('touchmove', preventBackgroundScroll);
  }
  const onTryItClickableClose2 = () => {
    document.querySelector(".clickable_modal2").style.display = "none";
    unlockScroll();
    document.removeEventListener('wheel', preventBackgroundScroll);
    document.removeEventListener('touchmove', preventBackgroundScroll);
  }
  const onTryItClickableClose3 = () => {
    document.querySelector(".clickable_modal3").style.display = "none";
    unlockScroll();
    document.removeEventListener('wheel', preventBackgroundScroll);
    document.removeEventListener('touchmove', preventBackgroundScroll);
  }

  const faqItemClick = (item) => {
    setFaqItemOpen(item);
  };

  const onregisterclick = (param) => {
    if (window.analytics) {
      window.analytics.track('Landing page button clicked', { buttonNumber: param });
    }
  }

  const handleDemoRequest = () => {
    if (window.analytics) {
      window.analytics.track('Demo/Contact requested', { button: 'Request a Demo', page: 'home' });
    }
    // Trigger Convertic popup
    if (window.ACX && window.ACX.openPopup) {
      window.ACX.openPopup();
    } else if (window.openAcellePopup) {
      window.openAcellePopup();
    }
  }

  const onSubscribe = () => {
    const form = new URLSearchParams({
      api_token: process.env.NEXT_PUBLIC_CONVERTIC_API_TOKEN,
      list_uid: process.env.NEXT_PUBLIC_CONVERTIC_LIST_UID,
      EMAIL: subscriberEmail,
    });

    fetch(`https://app.convertic.ai/public/api/v2/subscribers`, {
      method: "POST",
      body: form,
    })
      .then(response => {
        if (!response.ok) throw new Error('HTTP error: ' + response.status);
        JSAlert.alert("Thank you for subscribing! Stay tuned for the latest updates and exclusive content.");
      })
      .catch(error => {
        JSAlert.alert("Something went wrong. Please try again.");
      })
  }

  return (
    <>
      {/* Original markup moved from page.jsx below this line. */}
      <header className="row header">
        <Aurora
          colorStops={["#8A63FF", "#6366F1", "#3B82F6"]}
          blend={0.6}
          amplitude={0.8}
          speed={0.3}
        />
        <div className="col-12 above">
          <div className="row">
            <div className="col p-4">
              <nav className="navbar">
                {/* Burger menu button (mobile only, appears first) */}
                <button
                  className={`burger_menu ${mobileMenuOpen ? 'open' : ''}`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>

                <div className="header_nav_logo">
                  {/* <div className="hor_circle2">
                    <div className="hor_circle_inner"></div>
                  </div> */}
                  <a href="/" className="header_nav_logo_link">
                    <Image
                      src="/logo-mark-universal.png"
                      alt="Convertic"
                      width={48}
                      height={48}
                      priority
                      className="header_nav_logo_icon"
                    />
                    <span>Convertic<span style={{ color: "#1C71E8" }}>.</span>ai</span>
                  </a>
                </div>

                {/* Desktop menu */}
                <div className="header_nav_links">
                  <a href="/use-cases" className="header_nav_link">Use Cases</a>
                  <a href="/pricing" className="header_nav_link">Pricing</a>
                  <a href="/blog" className="header_nav_link">Blog</a>
                </div>
                <div className="header_nav_buttons">
                  <a href="https://app.convertic.ai/login" className="header_nav_btn header_nav_btn_outline">Login</a>
                  <a href="https://app.convertic.ai/users/register" className="header_nav_btn header_nav_btn_filled">Try it</a>
                </div>

                {/* Mobile buttons (always visible on mobile) */}
                <div className="header_nav_mobile_buttons">
                  <a href="https://app.convertic.ai/login" className="header_nav_btn header_nav_btn_outline">Login</a>
                  <a href="https://app.convertic.ai/users/register" className="header_nav_btn header_nav_btn_filled">Try it</a>
                </div>

                {/* Mobile menu overlay */}
                {mobileMenuOpen && (
                  <div className="mobile_menu_overlay" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile_menu" onClick={(e) => e.stopPropagation()}>
                      <a href="/use-cases" className="mobile_menu_link" onClick={() => setMobileMenuOpen(false)}>Use Cases</a>
                      <a href="/pricing" className="mobile_menu_link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                      <a href="/blog" className="mobile_menu_link" onClick={() => setMobileMenuOpen(false)}>Blog</a>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
          <div className="row pt-5 header_title">
            <div className="col centeredElement">
              <div className="centeredElement">
                <h1 className="header_title_text">
                  <span>Make every email &nbsp;</span><br />
                  <TextType
                    text={["interactive", "app-like", "engaging", "convertic"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className="higlighted_header"
                  />
                  {/* <span> AI agent</span> */}
                </h1>
              </div>
            </div>
          </div>
          <div className="all_first_cta">
            <a href="https://app.convertic.ai/users/register" onClick={() => onregisterclick(1)} className="all_menu_button">Get started</a>
            <div onClick={handleDemoRequest} id="request_demo_btn" className="all_menu_button all_menu_button_secondary">
              Request a demo
            </div>
          </div>
        </div>
      </header>

      <SyncSection />

      <BidWinDeliver />

      <AuralisHero
        onGetStarted={() => onregisterclick(7)}
        onRequestDemo={handleDemoRequest}
      />

      <div className="row" style={{ marginTop: "clamp(5rem, 12vw, 11rem)" }}>
        <div className="col">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="all_container">
                  <div className="all_faq">
                    <h1 className="all_faq_header_bold">FAQ:</h1>
                    <div className="all_faq_container">
                      <div className="all_faq_item" onClick={() => faqItemClick(0)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">How does Convertic works?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 0 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 0 && (
                          <div className="all_faq_item_answer">
                            Convertic provides different interactive emails service which improve conversion of email campaingns and increase AOV. For example your email subscribers can add additional products to the cart right inside email, or leave feedback without leaving inbox. <br />
                          </div>
                        )}
                      </div>

                      <div className="all_faq_item" onClick={() => faqItemClick(1)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">Do you offer a free trial?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 1 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 1 && (
                          <div className="all_faq_item_answer">
                            Yes, we offer 14 days free trial. On top of that you will be able to unlock bonus credits by completing your profile and sharing the platform with friends through referrals.
                          </div>
                        )}
                      </div>

                      <div className="all_faq_item" onClick={() => faqItemClick(2)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">Can you explain the key features of Convertic.ai?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 2 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 2 && (
                          <div className="all_faq_item_answer">Yes, we bring interactivity in email marketing providing different types of widgets, with which email readers can interact, leave comments, reviews, stars, add similar items to the cart and many more.</div>
                        )}
                      </div>

                      <div className="all_faq_item" onClick={() => faqItemClick(3)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">Can I customize the email templates?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 3 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 3 && (
                          <div className="all_faq_item_answer">Of course, you can use our PRO editor to customize emails how you want. Moreover, you will be able to effortlessly transform your content with AI text rewriting tool and seamless re-generation of stunning visuals. </div>
                        )}
                      </div>

                      <div className="all_faq_item" onClick={() => faqItemClick(4)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">Do you have an affiliate program?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 4 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 4 && (
                          <div className="all_faq_item_answer">Yes, we have an affiliate program that each customer can participate in. Just visit the “Referral” menu item inside your account, copy your referral link, invite your friend, and you will receive 30% of the first three months of the plan your friend chooses.</div>
                        )}
                      </div>

                      <div className="all_faq_item" onClick={() => faqItemClick(5)}>
                        <div className="all_faq_item_question">
                          <div className="all_faq_item_text">Should I move from my current ESP?</div>
                          <div className="d-block">
                            <div className="all_faq_item_plus">
                              <div className="all_faq_item_plus_inner">
                                {faqItemOpen == 5 ? <div className='all_faq_item_minus'>-</div> : "+"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {faqItemOpen == 5 && (
                          <div className="all_faq_item_answer">It’s not necessary to move from your existing email service provider (ESP). However, Convertic, a full-scale ESP, can enhance your current ESP with interactivity and gamification. If you need help configuring Convertic with your current ESP, send us an email at info@convertic.ai, and we will do it for you for free.</div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <BrandIntro /> */}

      {false && (
      <div className="row my-5">
        <div className="col above">
          <div className="horizontal_parent">
            <div className="horizontal-sticky">
              <div className="horizontal-block">
                <div className="hor-element first-hor-element"></div>
                <div className="hor-element">
                  <div className="hor_circle2">
                    <div className="hor_circle_inner"></div>
                  </div>
                  <ScrollFillText className="whole_screen_text whole_screen_text_small">
                    Take your email marketing to the next level with <span className="whole_screen_text_color">interactive emails</span> that captivate and convert
                  </ScrollFillText>
                </div>
                <div className="hor-element first-hor-element"></div>
                <div className="hor-element">
                  <div className="hor_circle">
                    <div className="hor_circle_inner"></div>
                  </div>
                  <ScrollFillText className="whole_screen_text whole_screen_text_small">
                    Create powerful, conversion-driven emails in seconds and turn subscribers into <span className="whole_screen_text_color">loyal customers</span>.
                  </ScrollFillText>
                </div>
                <div className="hor-element first-hor-element"></div>
                <div className="hor-element">
                  <div className="hor_circle3">
                    <div className="hor_circle_inner"></div>
                  </div>
                  <ScrollFillText className="whole_screen_text whole_screen_text_small">
                    Unlock higher sales and <span className="whole_screen_text_color">stronger customer connections</span> with instantly generated, dynamic email campaigns.
                  </ScrollFillText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {false && (
      <div>
        <h2 className="aiTryExampleHowEmails">How interactive emails appear to your target audience</h2>
        <section className="section whole_screen_text">
          <div>
            <div className="whole_screen_case_color">Case 1:</div>
            Increase revenue from <span className="whole_screen_text_color">shopping</span> in email
            <div className="whole_screen_right_bottom">
              <button onClick={onTryItClickable1} className="all_menu_button try_it_clickable try_it_clickable1">Try it clickable</button>
            </div>
          </div>
          <div className="whole_screen_right">
            <div className="whole_screen_right_top"></div>
            <video width="670" height="900" src="https://storage.googleapis.com/convertic-videos/vid.mov" autoPlay muted loop playsInline>
              <source src="https://storage.googleapis.com/convertic-videos/vid.mov" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="clickable_modal clickable_modal1" data-lenis-prevent style={{ overflow: 'auto' }}>
            <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross1" onClick={onTryItClickableClose}>
              <div className="all_faq_item_plus_inner">+</div>
            </div>
            <iframe src="/shop.html" style={{ width: '100%', height: '1200px', border: 'none', display: 'block', pointerEvents: 'auto' }}></iframe>
          </div>
        </section>

        <section className="section whole_screen_text">
          <div>
            <div className="whole_screen_case_color">Case 2:</div>
            Get more <span className="whole_screen_text_color3">social proof</span> from in-email review forms
            <div className="whole_screen_right_bottom">
              <button onClick={onTryItClickable2} className="all_menu_button try_it_clickable try_it_clickable2">Try it clickable</button>
            </div>
          </div>
          <div className="whole_screen_right">
            <div className="whole_screen_right_top"></div>
            <video width="670" height="900" src="https://storage.googleapis.com/convertic-videos/feedback.mov" autoPlay muted loop playsInline>
              <source src="https://storage.googleapis.com/convertic-videos/feedback.mov" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="clickable_modal clickable_modal2" data-lenis-prevent style={{ overflow: 'auto' }}>
            <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross2" onClick={onTryItClickableClose2}>
              <div className="all_faq_item_plus_inner">+</div>
            </div>
            <iframe src="/feedback.html" style={{ width: '100%', height: '1000px', border: 'none', display: 'block', pointerEvents: 'auto' }}></iframe>
          </div>
        </section>

        <section className="section whole_screen_text">
          <div>
            <div className="whole_screen_case_color">Case 3:</div>
            Create in-email bundles, subscriptions and measure <span className="whole_screen_text_color">NPS</span>
            <div className="whole_screen_right_bottom">
              <button onClick={onTryItClickable3} className="all_menu_button try_it_clickable try_it_clickable3">Try it clickable</button>
            </div>
          </div>
          <div className="whole_screen_right">
            <div className="whole_screen_right_top"></div>
            <video width="670" height="900" src="https://storage.googleapis.com/convertic-videos/upsell.mov" autoPlay muted loop playsInline>
              <source src="https://storage.googleapis.com/convertic-videos/upsell.mov" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="clickable_modal clickable_modal3" data-lenis-prevent style={{ overflow: 'auto' }}>
            <div className="all_faq_item_plus try_it_clickable_cross try_it_clickable_cross3" onClick={onTryItClickableClose3}>
              <div className="all_faq_item_plus_inner">+</div>
            </div>
            <iframe src="/upsell.html" style={{ width: '100%', height: '1100px', border: 'none', display: 'block', pointerEvents: 'auto' }}></iframe>
          </div>
        </section>
      </div>
      )}

      <div className="row my-5">
        <div className="col above">
          <div className="container">
            <div className="row">
              <TryItInInbox showTemplateOptions={true} />
            </div>
          </div>
        </div>
      </div>

      {false && (
      <div className="row">
        <div className="col">
          <div className="container">
            <div className="row">
              <InputAI />
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col">
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="all_middle_text">
                    <div className="all_middle_text_colorful1">Email experiences of tomorrow.</div>
                    <div className="all_middle_text_colorful1">Delivered today.</div>
                    <a className="all_middle_text_button" href="https://app.convertic.ai/users/register" onClick={() => onregisterclick(6)}>Get started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="row mt-5">
          <div className="col">
            <div className="container">
              <div className="row">
                <div className="col">
                  <h1 className="all_faq_header_bold footer_header_title">Let’s start your email-led</h1>
                  <h1 className="all_faq_header_bold footer_header_title">growth marketing</h1>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="footer_feedback">
                    <p className="footer_signup_text">Sign up for updates on our latest innovations</p>
                    <div className="footer_feedback_container">
                      <input className="footer_feedback_input" type="text" placeholder="Subscribe to our news" value={subscriberEmail} onInput={e => setSubscriberEmail(e.target.value)} />
                      <button className="footer_contact_button" onClick={onSubscribe}>Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col">
                  <div className="footer_contact_info">
                    <a href="mailto:contact@convertic.ai" className="footer_contact_email">contact@convertic.ai</a>
                    <a href="https://x.com/convertic_ai" target="_blank" rel="noopener noreferrer" className="footer_social_link">
                      <FaXTwitter size={20} />
                    </a>
                    <a href="https://www.linkedin.com/company/convertic-ai/" target="_blank" rel="noopener noreferrer" className="footer_social_link">
                      <FaLinkedin size={20} />
                    </a>
                    {/* <div>+1 (786) 633-11-49</div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </>
  );
}

