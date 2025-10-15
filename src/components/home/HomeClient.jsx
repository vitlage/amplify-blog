"use client";
import React, { useEffect, useState } from "react";
import InputAI from "@/components/inputAI/InputAI";
import JSAlert from 'js-alert';
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import SyncSection from '@/components/syncSection/SyncSection';
import Aurora from '@/components/aurora/Aurora';

export default function HomeClient({ searchParams }) {
  const page = parseInt(searchParams?.page) || 1;

  const [faqItemOpen, setFaqItemOpen] = useState(0);
  const [subscriberEmail, setSubscriberEmail] = useState("");

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

  useEffect(() => {
    const dynamicText = document.querySelector(".higlighted_header");
    if (!dynamicText) return;
    const highLightedWords = ["interactive", "app-like", "convertic"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeEffect = () => {
      const currentWord = highLightedWords[wordIndex];
      const currentChar = currentWord.substring(0, charIndex);
      dynamicText.textContent = currentChar;
      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 200);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 100);
      } else {
        isDeleting = !isDeleting;
        wordIndex = !isDeleting ? (wordIndex + 1) % highLightedWords.length : wordIndex;
        setTimeout(typeEffect, 1200);
      }
    }
    typeEffect();
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

  const onTryItInputFocus = () => {
    document.querySelector(".all_faq_input_send").classList.add("all_faq_input_send_focus");
  };
  const onTryItInputBlur = () => {
    document.querySelector(".all_faq_input_send").classList.remove("all_faq_input_send_focus");
  };

  const submitForm = (e) => {
    e.preventDefault();
    const mainInputAlert = document.querySelector("#alert-message");
    const mainInputElement = document.querySelector(".all_faq_input");
    var formData = new FormData(e.currentTarget);
    var formObject = {};
    formData.forEach(function (value, key) { formObject[key] = value; });

    if (window.analytics) {
      window.analytics.track("User submitted Try it in your inbox: ", { email: mainInputElement.value });
    }

    const displayAlert = (r) => {
      mainInputAlert.innerHTML = `<div class="alert alert-${r.status} animate__animated animate__fadeIn">${r.msg}</div>`;
      if (window.analytics) {
        if (r.status === 'danger') {
          window.analytics.track("Email NOT sent to Try it in your inbox: ", { email: mainInputElement.value });
        } else {
          window.analytics.track("Email sent to Try it in your inbox: ", { email: mainInputElement.value });
        }
      }
      mainInputElement.value = '';
    }

    // Ensure we have both required values and encode them for URL safety
    const email = formObject.main_input?.trim();
    const template = formObject.template_option || '66c37609b2af3'; // Default to first template if somehow undefined

    if (!email) {
      displayAlert({ status: 'danger', msg: 'Please enter your email address' });
      return;
    }

    fetch(`https://app.convertic.ai/landing/templates/send/${encodeURIComponent(email)}/${encodeURIComponent(template)}`)
      .then(response => {
        if (!response.ok) throw new Error('HTTP error: ' + response.status);
        return response.json();
      })
      .then(data => displayAlert(data))
      .catch(error => displayAlert({ status: 'danger', 'msg': 'Oops, Something went wrong. Please, try it later' }));
  }

  const onregisterclick = (param) => {
    if (window.analytics) {
      window.analytics.track('Landing page button clicked', { buttonNumber: param });
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
                <div className="header_nav_buttons">
                  <a href="https://app.convertic.ai/login" className="header_nav_btn header_nav_btn_outline">Login</a>
                  <a href="https://app.convertic.ai/users/register" className="header_nav_btn header_nav_btn_filled">Try it</a>
                </div>
              </nav>
            </div>
          </div>
          <div className="row pt-5 header_title">
            <div className="col centeredElement">
              <div className="centeredElement">
                <h1 className="header_title_text">
                  <span>Make every email &nbsp;</span><br />
                  <span className="higlighted_header">interactive</span>
                  {/* <span> AI agent</span> */}
                </h1>
              </div>
            </div>
          </div>
          <div className="all_first_cta">
            <a href="https://app.convertic.ai/users/register" onClick={() => onregisterclick(1)} className="all_menu_button">Get started</a>
            <div onClick={() => onregisterclick(1)} id="request_demo_btn" className="all_menu_button all_menu_button_secondary">
              Request a demo
            </div>
          </div>
        </div>
      </header>

      <SyncSection />

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
                  <div className="whole_screen_text whole_screen_text_small">
                    {/* Do you want to increase revenue from <span className="whole_screen_text_color">email marketing?</span> */}
                    Take your email marketing to the next level with <span className="whole_screen_text_color">interactive emails</span> that captivate and convert
                  </div>
                </div>
                <div className="hor-element first-hor-element"></div>
                <div className="hor-element">
                  <div className="hor_circle">
                    <div className="hor_circle_inner"></div>
                  </div>
                  <div className="whole_screen_text whole_screen_text_small">
                    {/* Start to use interactive emails to <span className="whole_screen_text_color">skyrocket</span> sales and customer loyalty for your brand */}
                    Create powerful, conversion-driven emails in seconds and turn subscribers into <span className="whole_screen_text_color">loyal customers</span>.
                  </div>
                </div>
                <div className="hor-element first-hor-element"></div>
                <div className="hor-element">
                  <div className="hor_circle3">
                    <div className="hor_circle_inner"></div>
                  </div>
                  <div className="whole_screen_text whole_screen_text_small">
                    {/* Generate <span className="whole_screen_text_color">any email</span> in seconds and see conversions soar to new heights */}
                    Unlock higher sales and <span className="whole_screen_text_color">stronger customer connections</span> with instantly generated, dynamic email campaigns.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <div className="row my-5">
        <div className="col above">
          <div className="container">
            <div className="row">
              <form className="all_build" onSubmit={(e) => submitForm(e)}>
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 col-lg-6 all_faq_header_flex">
                      <h1 className="all_faq_header_bold all_faq_header_container">
                        Try it &nbsp;
                        <span className="all_faq_header_gradient"></span>
                      </h1>
                      <h1 className="all_faq_header_bold"> in your inbox:</h1>
                    </div>
                    <div className="col-12 col-lg-6 d-flex button_radio_container">
                      <div className="button_radio_wrapper">
                        <label className="button_radio" htmlFor="first_option">
                          <input type="radio" name="template_option" id="first_option" value="66c37609b2af3" defaultChecked />
                          <span>First template</span>
                        </label>
                        <label className="button_radio" htmlFor="second_option">
                          <input type="radio" name="template_option" id="second_option" value="66c373e4562c5" />
                          <span>Second template</span>
                        </label>
                        <label className="button_radio" htmlFor="third_option">
                          <input type="radio" name="template_option" id="third_option" value="66c37695e547d" />
                          <span>Third template</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="all_faq_question_header"></h2>
                <input
                  className="all_faq_input"
                  onFocus={onTryItInputFocus}
                  onBlur={onTryItInputBlur}
                  id="main_input"
                  name="main_input"
                  type="email"
                  required
                  placeholder="Leave your email address here to check out how it works in your inbox"
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                />
                <button type="submit" className="all_faq_input_send">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="h-4 w-4 m-1 md:m-0" strokeWidth="2"><path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" fill="currentColor"></path></svg>
                </button>
              </form>

              <div id="alert-message"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="container">
            <div className="row">
              <InputAI />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
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
                          <div className="all_faq_item_text">Can you explain the key features of your email marketing software?</div>
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
    </>
  );
}

